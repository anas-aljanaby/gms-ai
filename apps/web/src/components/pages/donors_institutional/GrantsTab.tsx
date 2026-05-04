import React, { useState, useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency } from '../../../lib/utils';
import type { InstitutionalDonor, Project, ProjectType } from '../../../types';
import { MOCK_PROJECTS } from '../../../data/projectData';

interface Grant {
  id: string;
  date: string; // ISO
  amount: number;
  currency: 'USD' | 'EUR' | 'TRY';
  type: 'Restricted' | 'Unrestricted';
  projectBeneficiary: string;
  status: 'Paid' | 'Pending' | 'Scheduled';
  attachmentUrl?: string;
}

// Updated mockGrants to match project names and remove non-project grants
const mockGrants: Grant[] = [
    { id: 'GR-01', date: '2024-06-01T00:00:00Z', amount: 50000, currency: 'USD', type: 'Restricted', projectBeneficiary: 'Clean Water Initiative for Rural Villages', status: 'Paid'},
    { id: 'GR-02', date: '2023-11-15T00:00:00Z', amount: 100000, currency: 'USD', type: 'Restricted', projectBeneficiary: 'Education for All', status: 'Paid'},
    { id: 'GR-04', date: '2024-09-01T00:00:00Z', amount: 125000, currency: 'USD', type: 'Restricted', projectBeneficiary: "Rise Aleppo: Women's Empowerment through Vocational Training, Entrepreneurship and Traditional Crafts", status: 'Scheduled' },
    { id: 'GR-03', date: '2023-05-20T00:00:00Z', amount: 250000, currency: 'USD', type: 'Restricted', projectBeneficiary: 'Emergency Food Aid for Conflict Zones', status: 'Paid'},
];


interface GrantsTabProps {
    donor: InstitutionalDonor;
}

const GrantsTab: React.FC<GrantsTabProps> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'institutional_donors']);
    
    const [filters, setFilters] = useState({
        status: 'الكل',
        sector: 'الكل',
        year: 'الكل',
        amount: 'الكل',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getProjectStatusText = (stage: Project['stage'] | undefined) => {
        switch (stage) {
            case 'implementation':
            case 'monitoring':
                return 'جاري التنفيذ';
            case 'planning':
            case 'design':
                return 'مخطط له';
            case 'closure':
                return 'مكتمل';
            default:
                return 'غير معروف';
        }
    };

    const getStatusColor = (stage: Project['stage'] | undefined) => {
        switch (stage) {
            case 'implementation':
            case 'monitoring':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'closure':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'planning':
            case 'design':
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
        }
    };

    const allSponsoredProjects = useMemo(() => {
        return mockGrants.map(grant => {
            const project = MOCK_PROJECTS.find(p => p.name.en === grant.projectBeneficiary);
            if (project) {
                return { project, grant };
            }
            // Handle cases like 'Education for All' which are in grants but not full projects
            if (grant.projectBeneficiary === 'Education for All') {
                 return {
                    grant,
                    project: {
                        name: { en: 'Education for All', ar: 'التعليم للجميع' },
                        goal: 'Supporting primary education for 500 children in conflict zones.',
                        stage: 'closure',
                        type: 'education'
                    } as Partial<Project>
                }
            }
            return null;
        }).filter(Boolean) as { project: Partial<Project>, grant: Grant }[];
    }, []);

    const filteredProjects = useMemo(() => {
        return allSponsoredProjects.filter(({ project, grant }) => {
            // Status Filter
            if (filters.status !== 'الكل' && getProjectStatusText(project.stage) !== filters.status) {
                return false;
            }
            // Sector Filter
            if (filters.sector !== 'الكل' && project.type !== filters.sector) {
                return false;
            }
            // Year Filter
            if (filters.year !== 'الكل' && new Date(grant.date).getFullYear().toString() !== filters.year) {
                return false;
            }
            // Amount Filter
            if (filters.amount !== 'الكل') {
                const amount = grant.amount;
                if (filters.amount === '<50000' && amount >= 50000) return false;
                if (filters.amount === '50000-100000' && (amount < 50000 || amount > 100000)) return false;
                if (filters.amount === '>100000' && amount <= 100000) return false;
            }

            return true;
        });
    }, [allSponsoredProjects, filters]);

    const sectorOptions = useMemo(() => Array.from(new Set(allSponsoredProjects.map(p => p.project.type).filter(Boolean))) as ProjectType[], [allSponsoredProjects]);
    const yearOptions = useMemo(() => Array.from(new Set(mockGrants.map(g => new Date(g.date).getFullYear().toString()))).sort((a,b) => Number(b) - Number(a)), []);


    return (
        <div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-dark-card/50 rounded-lg border dark:border-slate-700">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">حسب الحالة</label>
                    <select id="status-filter" name="status" value={filters.status} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600">
                        <option>الكل</option>
                        <option>مكتمل</option>
                        <option>جاري التنفيذ</option>
                        <option>مخطط له</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="sector-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">حسب القطاع</label>
                    <select id="sector-filter" name="sector" value={filters.sector} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600">
                        <option value="الكل">الكل</option>
                        {sectorOptions.map(sector => <option key={sector} value={sector}>{t(`projects.types.${sector}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">حسب السنة</label>
                    <select id="year-filter" name="year" value={filters.year} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600">
                        <option>الكل</option>
                        {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="amount-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">حسب المبلغ</label>
                    <select id="amount-filter" name="amount" value={filters.amount} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600">
                        <option value="الكل">الكل</option>
                        <option value="<50000">أقل من 50,000$</option>
                        <option value="50000-100000">$50,000 - $100,000</option>
                        <option value=">100000">أكثر من 100,000$</option>
                    </select>
                </div>
            </div>

            <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? filteredProjects.map(({ project, grant }) => (
                    <div key={grant.id} className="project-card bg-card dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-lg text-foreground dark:text-dark-foreground h-14 overflow-hidden">{project.name?.[language] || project.name?.en}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 h-16 overflow-hidden">{project.goal}</p>
                        <div className="project-stats mt-4 pt-4 border-t dark:border-slate-700 flex justify-between items-center text-sm">
                            <span className="font-semibold text-foreground dark:text-dark-foreground">{formatCurrency(grant.amount, language, grant.currency)}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.stage)}`}>
                                {getProjectStatusText(project.stage)}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        <p>لا توجد مشاريع تطابق الفلاتر الحالية.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrantsTab;
