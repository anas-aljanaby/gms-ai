import React, { useState, useRef, useMemo } from 'react';
import { X as XIcon, FileText, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import ModalPortal from '../../common/ModalPortal';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import Spinner from '../../common/Spinner';
import { useTheme } from '../../../hooks/useTheme';
import type { BousalaDemoState } from '../../../lib/bousalaDemoData';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';

type ExportKind = 'pdf' | 'xlsx';

interface ReportGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    bousalaData: BousalaDemoState;
    aiInsights: { tasks: unknown[]; kpis: unknown[]; risks: unknown[] };
}

const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({ isOpen, onClose, bousalaData, aiInsights }) => {
    const { t, dir } = useLocalization(['common', 'bousala']);
    const { theme } = useTheme();
    const toast = useToast();
    const [exportingKind, setExportingKind] = useState<ExportKind | null>(null);
    const reportContentRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';
    const textColor = isDark ? '#A0AEC0' : '#4A5568';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const COLORS = ['hsl(210, 40%, 50%)', 'hsl(145, 63%, 49%)', '#FFBB28', '#FF8042'];

    const hasReportData = bousalaData.goals.length > 0;
    const isExporting = exportingKind !== null;

    const chartData = useMemo(() => {
        const countsData = [
            { name: t('bousala.goals'), count: bousalaData.goals.length },
            { name: t('bousala.projects'), count: bousalaData.projects.length },
            { name: t('bousala.tasks'), count: bousalaData.tasks.length },
        ];

        const completedTasks = bousalaData.tasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = bousalaData.tasks.filter(task => task.status === 'in-progress').length;
        const taskStatusData = [
            { name: t('bousala.task_status.completed'), value: completedTasks },
            { name: t('bousala.task_status.in-progress'), value: inProgressTasks },
        ];

        const goalProgressData = bousalaData.goals.map(g => ({
            name: g.title.length > 24 ? `${g.title.substring(0, 24)}…` : g.title,
            progress: g.progress,
        }));

        return { countsData, taskStatusData, goalProgressData };
    }, [bousalaData, t]);

    const handleClose = () => {
        if (isExporting) return;
        onClose();
    };

    const handleExportPDF = async () => {
        if (!hasReportData) {
            toast.showWarning(t('bousala.reports.noData'));
            return;
        }
        if (!reportContentRef.current) {
            toast.showError(t('bousala.reports.exportError'));
            return;
        }

        setExportingKind('pdf');
        toast.showInfo(t('bousala.reports.exportingPdf'));
        try {
            const canvas = await html2canvas(reportContentRef.current, {
                scale: 2,
                backgroundColor: isDark ? '#1a202c' : '#ffffff',
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(t('bousala.reports.dashboardReportFileName'));
            toast.showSuccess(t('bousala.reports.exportSuccess'));
        } catch (error) {
            console.error('PDF Export Error:', error);
            toast.showError(t('bousala.reports.exportError'));
        } finally {
            setExportingKind(null);
        }
    };

    const handleExportXLSX = async () => {
        if (!hasReportData) {
            toast.showWarning(t('bousala.reports.noData'));
            return;
        }

        setExportingKind('xlsx');
        toast.showInfo(t('bousala.reports.exportingXlsx'));
        try {
            const wb = XLSX.utils.book_new();

            const goalsData = bousalaData.goals.map(g => ({
                [t('bousala.reports.goal')]: g.title,
                [t('bousala.reports.description')]: g.description,
                [t('bousala.reports.progress')]: g.progress,
                [t('bousala.addGoalModal.responsiblePerson')]: g.responsiblePerson,
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(goalsData), t('bousala.reports.sheetGoals'));

            const projectsData = bousalaData.projects.map(p => ({
                [t('bousala.reports.project')]: p.title,
                [t('bousala.reports.progress')]: p.progress,
                [t('bousala.reports.linkedGoal')]: p.linkedGoal,
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projectsData), t('bousala.reports.sheetProjects'));

            const tasksData = bousalaData.tasks.map(task => ({
                [t('bousala.reports.task')]: task.title,
                [t('bousala.reports.status')]: task.status,
                [t('bousala.reports.assignee')]: task.assignee,
                [t('bousala.reports.linkedProject')]: task.linkedProject,
                [t('bousala.addTaskModal.dueDate')]: task.dueDate ?? '',
                [t('bousala.addTaskModal.priority')]: task.priority ?? '',
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tasksData), t('bousala.reports.sheetTasks'));

            const insightsRows = [
                ...aiInsights.tasks.map((item: { title?: string; content?: string }, i) => ({
                    [t('bousala.reports.insightType')]: t('bousala.aiPanel.recommendations'),
                    [t('bousala.reports.insightTitle')]: item.title ?? `Task ${i + 1}`,
                    [t('bousala.reports.insightContent')]: item.content ?? '',
                })),
                ...aiInsights.kpis.map((item: { title?: string; content?: string }, i) => ({
                    [t('bousala.reports.insightType')]: t('bousala.aiPanel.performanceInsights'),
                    [t('bousala.reports.insightTitle')]: item.title ?? `KPI ${i + 1}`,
                    [t('bousala.reports.insightContent')]: item.content ?? '',
                })),
                ...aiInsights.risks.map((item: { title?: string; content?: string }, i) => ({
                    [t('bousala.reports.insightType')]: t('bousala.aiPanel.riskForecast'),
                    [t('bousala.reports.insightTitle')]: item.title ?? `Risk ${i + 1}`,
                    [t('bousala.reports.insightContent')]: item.content ?? '',
                })),
            ];
            if (insightsRows.length > 0) {
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(insightsRows), t('bousala.reports.sheetInsights'));
            }

            XLSX.writeFile(wb, t('bousala.reports.fullReportFileName'));
            toast.showSuccess(t('bousala.reports.exportSuccess'));
        } catch (error) {
            console.error('XLSX Export Error:', error);
            toast.showError(t('bousala.reports.exportError'));
        } finally {
            setExportingKind(null);
        }
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={handleClose} dir={dir}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('bousala.reports.title')}</h2>
                    <button type="button" onClick={handleClose} disabled={isExporting} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50">
                        <XIcon />
                    </button>
                </div>

                {!hasReportData && (
                    <div className="mx-6 mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
                        {t('bousala.reports.noData')}
                    </div>
                )}

                <div ref={reportContentRef} className="p-6 overflow-y-auto bg-white dark:bg-dark-card flex-1">
                    <div className="space-y-8">
                        <h4 className="font-bold text-lg text-center">{t('bousala.visualAnalytics')}</h4>
                        {hasReportData ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="font-semibold text-center mb-2">{t('bousala.reports.itemsDistribution')}</h5>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={chartData.countsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                                                <YAxis tick={{ fill: textColor }} allowDecimals={false} />
                                                <RechartsTooltip />
                                                <Bar dataKey="count" name={t('bousala.reports.count')}>
                                                    {chartData.countsData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-center mb-2">{t('bousala.reports.taskStatus')}</h5>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={chartData.taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                    {chartData.taskStatusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#22C55E', '#F59E0B'][index % 2]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-center mb-2">{t('bousala.reports.goalProgress')}</h5>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={chartData.goalProgressData} layout="vertical" margin={{ right: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                            <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor }} />
                                            <YAxis type="category" dataKey="name" width={150} tick={{ fill: textColor, fontSize: 10 }} />
                                            <RechartsTooltip formatter={(value) => `${value}%`} />
                                            <Bar dataKey="progress" name={t('bousala.reports.progress')} fill="hsl(210, 40%, 50%)" background={{ fill: isDark ? '#334155' : '#e5e7eb' }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-12">{t('bousala.reports.previewEmpty')}</p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleExportXLSX}
                        disabled={!hasReportData || isExporting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:bg-gray-400"
                    >
                        {exportingKind === 'xlsx' ? <Spinner size="w-4 h-4" /> : <FileText size={16} />}
                        {exportingKind === 'xlsx' ? t('bousala.reports.exportingXlsx') : t('bousala.reports.exportXLSX')}
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPDF}
                        disabled={!hasReportData || isExporting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:bg-gray-400"
                    >
                        {exportingKind === 'pdf' ? <Spinner size="w-4 h-4" /> : <Download size={16} />}
                        {exportingKind === 'pdf' ? t('bousala.reports.exportingPdf') : t('bousala.reports.exportPDF')}
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default ReportGenerationModal;
