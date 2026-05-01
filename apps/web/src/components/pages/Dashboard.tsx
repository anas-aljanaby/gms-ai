

import React, { useState, useEffect, lazy, Suspense, useCallback, memo, useRef } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { MOCK_AI_INSIGHTS } from '../../data/aiInsightsData';
import SmartKPICard from '../dashboard/SmartKPICard';
import type { Language, Alert } from '../../types';
import { MOCK_ALERTS } from '../../data/alertsData';
import AlertsTicker from '../common/AlertsTicker';
import { XIcon, WrenchIcon, GridIcon } from '../icons/GenericIcons';
import DashboardControls from '../dashboard/DashboardControls';
import type { FilterState } from '../dashboard/DashboardControls';
import SkeletonLoader from '../common/SkeletonLoader';
import useHistoryState from '../../hooks/useHistoryState';
import LayoutCustomizer from '../dashboard/LayoutCustomizer';
import { PlusCircle, BarChart3, Mail, Settings, ChevronDown, Rocket } from 'lucide-react';
import OnboardingTour from '../onboarding/OnboardingTour';
import { tourSteps } from '../../data/helpData';

// Performance Optimization: Lazy load heavy components
const DonationsChart = lazy(() => import('../dashboard/DonationsChart'));
const AIInsightsPanel = lazy(() => import('../dashboard/AIInsightsPanel'));
const TimelineView = lazy(() => import('../common/TimelineView'));
const MatrixView = lazy(() => import('../common/MatrixView'));
const ComparisonBars = lazy(() => import('../common/ComparisonBars'));
const QuickActionsHub = lazy(() => import('../dashboard/QuickActionsHub'));
const OnboardingChecklist = lazy(() => import('../onboarding/OnboardingChecklist'));
const SummaryCard = lazy(() => import('../dashboard/SummaryCard'));


interface DashboardProps {
  setActiveModule: (module: string) => void;
}

const smartKpiData = [
    { id: 'kpiSponsorships', title: { en: 'Sponsorships Waiting', ar: 'الكفالات المنتظرة' }, value: 18, icon: '👥', changePercentage: 5, priority: 'warning', trend: [15, 12, 16, 14, 18] },
    { id: 'kpiOverdueTasks', title: { en: 'Overdue Donor Tasks', ar: 'مهام المانحين المتأخرة' }, value: 7, icon: '📋', changePercentage: -12.5, priority: 'urgent', trend: [5, 6, 8, 9, 7] },
    { id: 'kpiProjectsAtRisk', title: { en: 'Active Projects at Risk', ar: 'المشاريع النشطة في خطر' }, value: 2, icon: '🚧', priority: 'warning', trend: [3, 3, 2, 2, 2] },
    { id: 'kpiFundsDisbursed', title: { en: 'Funds to be Disbursed', ar: 'الأموال المقرر صرفها' }, value: 125000, icon: '💸', target: 500000, daysRemaining: 45, priority: 'neutral', trend: [80000, 95000, 110000, 125000] },
];

const comparisonData = [ { label: 'Donations', value: 125000, year: 2024 }, { label: 'Donations', value: 110000, year: 2023 }, { label: 'Volunteers', value: 215, year: 2024 }, { label: 'Volunteers', value: 190, year: 2023 }, { label: 'Beneficiaries', value: 3500, year: 2024 }, { label: 'Beneficiaries', value: 3200, year: 2023 } ];

/**
 * FavoriteReportCard - بطاقة تعرض التقرير المفضل للمستخدم.
 * 
 * @component
 * @param {object} props - الخصائص.
 * @param {(module: string) => void} props.setActiveModule - دالة لتغيير الوحدة النشطة للانتقال إلى صفحة التقارير.
 * @returns {JSX.Element}
 */
const FavoriteReportCard: React.FC<{ setActiveModule: (module: string) => void; }> = memo(({ setActiveModule }) => {
    const { t } = useLocalization();
    const [favId, setFavId] = useState<string | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            setFavId(localStorage.getItem('favoriteReport'));
        };
        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const reportCardsInfo: Record<string, {title: string}> = {
        overview: { title: t('projects.reporting.overviewReport') },
        tasks: { title: t('projects.reporting.tasksReport') },
        budget: { title: t('projects.reporting.budgetReport') },
        progress: { title: t('projects.reporting.timelineReport') },
    };

    const favReportName = favId ? reportCardsInfo[favId]?.title : null;

    return (
        <article className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300">
                        <span className="text-2xl" aria-hidden="true">⭐</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">{t('dashboard.favoriteReport.title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{favReportName || t('dashboard.favoriteReport.noneSelected')}</p>
                    </div>
                </div>
            </div>
            {favReportName && (
                 <button 
                    onClick={() => setActiveModule('reports')} 
                    className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                    {t('projects.reporting.viewReport')}
                </button>
            )}
        </article>
    );
});

/**
 * ToastDemoCard - بطاقة لعرض أزرار تجريبية لإظهار إشعارات مختلفة.
 * 
 * @component
 * @returns {JSX.Element}
 */
const ToastDemoCard: React.FC = () => {
    const { t } = useLocalization();
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft h-full">
            <h3 className="font-semibold mb-4">{t('dashboard.toastDemo.title')}</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => showSuccess(t('dashboard.toastDemo.successMessage'), { title: t('dashboard.toastDemo.successTitle') })} className="p-2 text-sm font-semibold bg-green-100 text-green-800 rounded-lg">{t('dashboard.toastDemo.successButton')}</button>
                <button onClick={() => showError(t('dashboard.toastDemo.errorMessage'), { title: t('dashboard.toastDemo.errorTitle') })} className="p-2 text-sm font-semibold bg-red-100 text-red-800 rounded-lg">{t('dashboard.toastDemo.errorButton')}</button>
                <button onClick={() => showWarning(t('dashboard.toastDemo.warningMessage'), { title: t('dashboard.toastDemo.warningTitle') })} className="p-2 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-lg">{t('dashboard.toastDemo.warningButton')}</button>
                <button onClick={() => showInfo(t('dashboard.toastDemo.infoMessage'), { title: t('dashboard.toastDemo.infoTitle') })} className="p-2 text-sm font-semibold bg-blue-100 text-blue-800 rounded-lg">{t('dashboard.toastDemo.infoButton')}</button>
            </div>
        </div>
    );
}

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- WIDGETS CONFIG ---
const WIDGET_COMPONENTS: Record<string, React.FC<any>> = {
    SmartKPICard,
    FavoriteReportCard,
    QuickActionsHub,
    DonationsChart: () => <div className="h-full"><Suspense fallback={<SkeletonLoader type="chart"/>}><DonationsChart /></Suspense></div>,
    AIInsightsPanel: () => <Suspense fallback={<SkeletonLoader type="text" lines={10}/>}><AIInsightsPanel insights={MOCK_AI_INSIGHTS} /></Suspense>,
    TimelineView: ({ progress, setProgress }) => <TimelineView progress={progress} setProgress={setProgress} />,
    MatrixView: () => <div className="h-full"><MatrixView mode="light" /></div>,
    ComparisonBars,
    ToastDemoCard,
    OnboardingChecklist: () => <Suspense fallback={<SkeletonLoader type="text" lines={5}/>}><OnboardingChecklist /></Suspense>,
};

export const ALL_WIDGETS: Record<string, { nameKey: string; component: string; props: any; defaultLayout: { w: number; h: number } }> = {
    kpiSponsorships: { nameKey: 'dashboard.widgets.kpiSponsorships', component: 'SmartKPICard', props: smartKpiData[0], defaultLayout: { w: 1, h: 1 } },
    kpiOverdueTasks: { nameKey: 'dashboard.widgets.kpiOverdueTasks', component: 'SmartKPICard', props: smartKpiData[1], defaultLayout: { w: 1, h: 1 } },
    kpiProjectsAtRisk: { nameKey: 'dashboard.widgets.kpiProjectsAtRisk', component: 'SmartKPICard', props: smartKpiData[2], defaultLayout: { w: 1, h: 1 } },
    kpiFundsDisbursed: { nameKey: 'dashboard.widgets.kpiFundsDisbursed', component: 'SmartKPICard', props: smartKpiData[3], defaultLayout: { w: 1, h: 1 } },
    donationsChart: { nameKey: 'dashboard.widgets.donationsChart', component: 'DonationsChart', props: {}, defaultLayout: { w: 1, h: 2 } },
    timeline: { nameKey: 'dashboard.widgets.timelineView', component: 'TimelineView', props: { progress: 65 }, defaultLayout: { w: 1, h: 4 } },
    matrix: { nameKey: 'dashboard.widgets.matrixView', component: 'MatrixView', props: {}, defaultLayout: { w: 1, h: 3 } },
    compare: { nameKey: 'dashboard.widgets.comparisonBars', component: 'ComparisonBars', props: {data: comparisonData}, defaultLayout: { w: 1, h: 2 } },
    favReport: { nameKey: 'dashboard.widgets.favoriteReport', component: 'FavoriteReportCard', props: {}, defaultLayout: { w: 1, h: 1 } },
    toastDemo: { nameKey: 'dashboard.widgets.toastDemo', component: 'ToastDemoCard', props: {}, defaultLayout: { w: 1, h: 1 } },
    onboarding: { nameKey: 'dashboard.widgets.gettingStarted', component: 'OnboardingChecklist', props: {}, defaultLayout: { w: 1, h: 2 } },
    quickActions: { nameKey: 'dashboard.widgets.quickActions', component: 'QuickActionsHub', props: {}, defaultLayout: { w: 4, h: 1 } },
    aiInsights: { nameKey: 'dashboard.widgets.aiInsights', component: 'AIInsightsPanel', props: {}, defaultLayout: { w: 2, h: 2 } },
};

export const KPI_WIDGETS = ['kpiSponsorships', 'kpiOverdueTasks', 'kpiProjectsAtRisk', 'kpiFundsDisbursed'];
const PINNED_WIDGETS = ['aiInsights', 'quickActions'];

// --- PRESET LAYOUTS ---
const defaultLayouts = {
    lg: [
        { i: 'matrix', x: 0, y: 0, w: 1, h: 2 },
        { i: 'donationsChart', x: 0, y: 2, w: 1, h: 2 },
        { i: 'timeline', x: 0, y: 4, w: 1, h: 4 },
        { i: 'compare', x: 0, y: 8, w: 1, h: 2 },
        { i: 'favReport', x: 0, y: 10, w: 1, h: 1 },
        { i: 'onboarding', x: 0, y: 11, w: 1, h: 2 },
    ]
};
export const PRESET_LAYOUTS = {
    executive: {
        widgets: ['donationsChart', 'matrix'],
        layouts: { lg: [
            { i: 'donationsChart', x: 0, y: 0, w: 1, h: 2 },
            { i: 'matrix', x: 0, y: 2, w: 1, h: 3 },
        ] }
    },
    manager: {
        widgets: ['timeline', 'donationsChart'],
        layouts: { lg: [
            { i: 'timeline', x: 0, y: 0, w: 1, h: 4 },
            { i: 'donationsChart', x: 0, y: 4, w: 1, h: 2 }
        ] }
    },
    analyst: {
        widgets: ['donationsChart', 'compare', 'matrix', 'timeline'],
        layouts: { lg: [
            { i: 'donationsChart', x: 0, y: 0, w: 1, h: 2 },
            { i: 'compare', x: 0, y: 2, w: 1, h: 2 },
            { i: 'matrix', x: 0, y: 4, w: 1, h: 3 },
            { i: 'timeline', x: 0, y: 7, w: 1, h: 4 }
        ] }
    },
};

/**
 * getInitialLayouts - تحميل تخطيط لوحة القيادة من localStorage أو إرجاع التخطيط الافتراضي.
 * @returns {object} - كائن التخطيطات لـ react-grid-layout.
 */
const getInitialLayouts = () => {
    try {
        const saved = localStorage.getItem('dashboard-layouts');
        if (saved) return JSON.parse(saved);
    } catch(e) { /* fall through to default */ }
    return defaultLayouts;
};

const getInitialVisibleWidgets = () => {
    try {
        const saved = localStorage.getItem('dashboard-visible-widgets');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch(e) { /* fall through to default */ }
    // Default: all widgets visible
    return Object.keys(ALL_WIDGETS).filter(id => !PINNED_WIDGETS.includes(id));
};


/**
 * Dashboard - مكون لوحة القيادة الرئيسية القابل للتخصيص.
 * يعرض مؤشرات الأداء الرئيسية (KPIs) ومجموعة من الودجات القابلة للسحب والتحجيم.
 * 
 * @component
 * @param {DashboardProps} props - الخصائص.
 * @returns {JSX.Element}
 */
const Dashboard: React.FC<DashboardProps> = ({ setActiveModule }) => {
    const { t } = useLocalization();
    const [isCustomizeMode, setIsCustomizeMode] = useState(false);
    const [layouts, setLayouts, undo, redo, canUndo, canRedo] = useHistoryState<Layouts>(getInitialLayouts());
    const [visibleWidgets, setVisibleWidgets] = useState<string[]>(getInitialVisibleWidgets());
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [timelineProgress, setTimelineProgress] = useState(65);
    const [filters, setFilters] = useState<FilterState | null>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const [isTourOpen, setIsTourOpen] = useState(false);

    useEffect(() => {
        const tourCompleted = localStorage.getItem('onboardingTourCompleted');
        if (!tourCompleted) {
            setIsTourOpen(true);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
        localStorage.setItem('dashboard-visible-widgets', JSON.stringify(visibleWidgets));
    }, [layouts, visibleWidgets]);

    /**
     * onLayoutChange - معالج يتم استدعاؤه عند تغيير تخطيط الشبكة.
     * @param {Layout[]} layout - التخطيط الحالي.
     * @param {Layouts} newLayouts - كائن التخطيطات الجديد.
     */
    const onLayoutChange = (layout: Layout[], newLayouts: Layouts) => {
        setLayouts(newLayouts);
    };
    
    /**
     * handleAlertClick - معالج النقر على تنبيه من الشريط المتحرك.
     * @param {Alert} alert - كائن التنبيه الذي تم النقر عليه.
     */
    const handleAlertClick = (alert: Alert) => {
        if (alert.targetModule && alert.targetId) {
            const path = [alert.targetModule, alert.targetId, alert.targetTab].filter(Boolean).join('/');
            setActiveModule(path);
        } else {
            console.log('Alert clicked (no target):', alert);
        }
    };
    
    /**
     * handleAlertDismiss - معالج لإغلاق تنبيه من الشريط المتحرك.
     * @param {string} alertId - معرف التنبيه المراد إغلاقه.
     */
    const handleAlertDismiss = (alertId: string) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    };

     const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, []);

    const handleTourComplete = () => {
        setIsTourOpen(false);
        localStorage.setItem('onboardingTourCompleted', 'true');
    };

    /**
     * renderWidget - دالة لتقديم مكون الودجت بناءً على معرفه.
     * @param {string} widgetId - معرف الودجت.
     * @returns {JSX.Element | null} - مكون الودجت أو null إذا لم يتم العثور عليه.
     */
    const renderWidget = (widgetId: string) => {
        const config = ALL_WIDGETS[widgetId];
        if (!config) return null;
        const Component = WIDGET_COMPONENTS[config.component];
        
        if (widgetId === 'timeline') {
            return <Component progress={timelineProgress} setProgress={setTimelineProgress} />;
        }
        
        const props = { ...config.props, setActiveModule };
        return <Component {...props} />;
    };
    
    const kpisToRender = KPI_WIDGETS.filter(id => visibleWidgets.includes(id));
    const gridWidgetsToRender = visibleWidgets.filter(id => !KPI_WIDGETS.includes(id) && !PINNED_WIDGETS.includes(id));


    return (
        <div className="space-y-8" ref={dashboardRef}>
            <OnboardingTour
                isOpen={isTourOpen}
                onClose={handleTourComplete}
                steps={tourSteps}
            />
            <AlertsTicker
                alerts={alerts}
                onAlertClick={handleAlertClick}
                onAlertDismiss={handleAlertDismiss}
            />
            
            <header className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-dark-foreground">
                        {t('dashboard.title')}
                    </h1>
                     {filters && (
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-200 mt-2">
                            {t('dashboard.activeFilters')}: {t('dashboard.controls.timePeriod')}: {t(`dashboard.controls.periods.${filters.timePeriod}`)}, {t('dashboard.controls.department')}: {t(`dashboard.controls.departments.${filters.department}`)}
                        </div>
                    )}
                </div>
                <DashboardControls 
                    onFilterChange={handleFilterChange} 
                    onCustomizeClick={() => setIsCustomizeMode(true)}
                    setActiveModule={setActiveModule}
                    dashboardRef={dashboardRef}
                />
            </header>

             <button
                onClick={() => setIsTourOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
                <Rocket size={16} /> {t('onboarding.startTour')}
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Spans 2/3 on lg) */}
                <main className="w-full lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
                        {kpisToRender.map(widgetId => {
                            const config = ALL_WIDGETS[widgetId];
                            const Component = WIDGET_COMPONENTS[config.component];
                            const props = { ...config.props, setActiveModule };
                            return <Component key={widgetId} {...props} />;
                        })}
                    </div>

                    <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
                        rowHeight={150}
                        onLayoutChange={onLayoutChange}
                        isDraggable={isCustomizeMode}
                        isResizable={isCustomizeMode}
                        draggableHandle=".drag-handle"
                        margin={[32, 32]}
                        containerPadding={[0, 0]}
                    >
                        {gridWidgetsToRender.map(widgetId => (
                            <div key={widgetId} className="custom-widget bg-transparent">
                                {isCustomizeMode && <div className="drag-handle absolute top-2 right-2 p-2 cursor-move bg-black/10 rounded-full z-10"><GridIcon className="w-4 h-4"/></div>}
                                <div className="h-full">{renderWidget(widgetId)}</div>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </main>
                
                {/* Sticky Sidebar (Spans 1/3 on lg) */}
                <aside className="w-full lg:col-span-1 space-y-8 lg:sticky lg:top-8 self-start">
                    <Suspense fallback={<SkeletonLoader type="text" lines={10}/>}>
                        <AIInsightsPanel insights={MOCK_AI_INSIGHTS} />
                    </Suspense>
                    <QuickActionsHub setActiveModule={setActiveModule} />
                </aside>
            </div>


            <LayoutCustomizer
                isOpen={isCustomizeMode}
                onClose={() => setIsCustomizeMode(false)}
                layouts={layouts}
                setLayouts={setLayouts}
                widgets={visibleWidgets}
                setWidgets={setVisibleWidgets}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
        </div>
    );
};

export default Dashboard;