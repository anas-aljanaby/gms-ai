import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { MOCK_FISCAL_YEAR_2024 } from '../../../../data/financialData';
import type { FinancialPeriod, FinancialPeriodStatus } from '../../../../types';
import { formatDate } from '../../../../lib/utils';
import { MoreHorizontalIcon } from '../../../icons/GenericIcons';
import { ListIcon, CalendarIcon, LockIcon, UnlockIcon, CheckSquareIcon, UndoIcon } from '../../../icons/ActionIcons';

const FinancialPeriodsConfiguration: React.FC = () => {
    const { t, language } = useLocalization();
    const [periods, setPeriods] = useState<FinancialPeriod[]>(MOCK_FISCAL_YEAR_2024);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [fiscalYearExists, setFiscalYearExists] = useState(true); // Control between setup and dashboard
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const openPeriod = useMemo(() => periods.find(p => p.status === 'Open'), [periods]);
    const softClosedPeriod = useMemo(() => periods.find(p => p.status === 'Soft-Closed'), [periods]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const StatusBadge: React.FC<{ status: FinancialPeriodStatus }> = ({ status }) => {
        const styles: Record<FinancialPeriodStatus, string> = {
            'Future': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Open': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 animate-pulse',
            'Soft-Closed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'Hard-Closed': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
        return (
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${styles[status]}`}>
                <span className={`w-2 h-2 rounded-full ${styles[status].replace(/text-(.*)-(\d+)/, 'bg-$1-500').replace(/dark:bg-(.*)-(\d+)\/(\d+)/, 'dark:bg-$1-400')}`}></span>
                {t(`financialSettings.periods.statuses.${status}`)}
            </span>
        );
    };

    const renderPeriodList = () => (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-card/50 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('financialSettings.periods.table.period')}</th>
                            <th scope="col" className="px-6 py-3">{t('financialSettings.periods.table.startDate')}</th>
                            <th scope="col" className="px-6 py-3">{t('financialSettings.periods.table.endDate')}</th>
                            <th scope="col" className="px-6 py-3">{t('financialSettings.periods.table.status')}</th>
                            <th scope="col" className="px-6 py-3 text-right">{t('financialSettings.periods.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map((period, index) => {
                             const canBeOpened = period.status === 'Future' && (index === 0 || (periods[index-1].status === 'Soft-Closed' || periods[index-1].status === 'Hard-Closed')) && !openPeriod && !softClosedPeriod;

                            return (
                                <tr key={period.id} className="bg-card dark:bg-dark-card border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                                    <th scope="row" className="px-6 py-4 font-bold text-foreground dark:text-dark-foreground whitespace-nowrap">{period.name[language]}</th>
                                    <td className="px-6 py-4">{formatDate(period.startDate, language)}</td>
                                    <td className="px-6 py-4">{formatDate(period.endDate, language)}</td>
                                    <td className="px-6 py-4"><StatusBadge status={period.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block" ref={activeDropdown === period.id ? dropdownRef : null}>
                                            <button onClick={() => setActiveDropdown(activeDropdown === period.id ? null : period.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                                                <MoreHorizontalIcon />
                                            </button>
                                            {activeDropdown === period.id && (
                                                <div className="absolute right-0 mt-2 w-56 bg-card dark:bg-dark-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        {canBeOpened && <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><UnlockIcon /> {t('financialSettings.periods.actions.openPeriod')}</a>}
                                                        {period.status === 'Open' && <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><CheckSquareIcon /> {t('financialSettings.periods.actions.beginClosing')}</a>}
                                                        {period.status === 'Soft-Closed' && <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><LockIcon /> {t('financialSettings.periods.actions.hardClose')}</a>}
                                                        {period.status === 'Soft-Closed' && <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"><UndoIcon /> {t('financialSettings.periods.actions.reopenPeriod')}</a>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('financialSettings.periods.title')}</h3>
            
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft p-4 border border-gray-200 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h4 className="font-bold text-lg">{t('financialSettings.periods.dashboard.title', { year: '2024' })}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           {t('financialSettings.periods.dashboard.currentOpen')}: <span className="font-semibold text-green-600 dark:text-green-400">{openPeriod?.name[language] || t('financialSettings.periods.dashboard.noOpenPeriod')}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-gray-200 dark:bg-slate-700 rounded-lg flex">
                            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}><ListIcon/></button>
                            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}><CalendarIcon/></button>
                        </div>
                        <button disabled={!openPeriod} className="px-4 py-2 text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {t('financialSettings.periods.dashboard.closePeriod')}
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? renderPeriodList() : (
                <div className="text-center p-8 bg-card dark:bg-dark-card rounded-2xl shadow-soft">
                    <p>Calendar view is under construction.</p>
                </div>
            )}

        </div>
    );
};

export default FinancialPeriodsConfiguration;
