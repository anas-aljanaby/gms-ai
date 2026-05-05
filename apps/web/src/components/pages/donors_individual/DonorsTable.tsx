
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { DonorStageId, IndividualDonor, SortDirection } from '../../../types';
import { formatDate, formatCurrency, formatNumber, formatRelativeTime } from '../../../lib/utils';
import { MoreHorizontalIcon, ChevronDownIcon } from '../../icons/GenericIcons';
import { StatusBadge } from './DonorBadges';
import { Columns3, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface DonorsTableProps {
    donors: IndividualDonor[];
    onDonorSelect: (donor: IndividualDonor) => void;
    sortColumn: keyof IndividualDonor | null;
    sortDirection: SortDirection;
    onSort: (column: keyof IndividualDonor) => void;
    stageByEmail?: Map<string, DonorStageId>;
}

type ColumnId = 'donor' | 'donorType' | 'status' | 'pipelineStage' | 'owner' | 'country' | 'totalDonations' | 'lastGift' | 'lastContact' | 'nextAction' | 'openTasks' | 'tags';

type ColumnGroup = {
    groupKey: string;
    color: string;
    columns: ColumnId[];
};

const COLUMN_GROUPS: ColumnGroup[] = [
    {
        groupKey: 'individual_donors.detailView.identity',
        color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
        columns: ['donor', 'donorType', 'status', 'country'],
    },
    {
        groupKey: 'individual_donors.detailView.relationshipOwnership',
        color: 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
        columns: ['pipelineStage', 'owner', 'lastContact'],
    },
    {
        groupKey: 'individual_donors.detailView.givingHistory',
        color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
        columns: ['totalDonations', 'lastGift'],
    },
    {
        groupKey: 'individual_donors.detailView.tasksNextActions',
        color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
        columns: ['nextAction', 'openTasks'],
    },
    {
        groupKey: 'individual_donors.columns.tags',
        color: 'bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400',
        columns: ['tags'],
    },
];

const COLUMN_META: Record<ColumnId, { labelKey: string; sortKey?: keyof IndividualDonor; width: string }> = {
    donor: { labelKey: 'individual_donors.columns.donor', sortKey: 'fullName', width: 'w-56' },
    donorType: { labelKey: 'individual_donors.columns.donorType', sortKey: 'donorType', width: 'w-32' },
    status: { labelKey: 'individual_donors.columns.status', sortKey: 'status', width: 'w-32' },
    country: { labelKey: 'individual_donors.columns.country', sortKey: 'country', width: 'w-28' },
    pipelineStage: { labelKey: 'individual_donors.columns.pipelineStage', width: 'w-32' },
    owner: { labelKey: 'individual_donors.columns.owner', sortKey: 'assignedManager', width: 'w-32' },
    lastContact: { labelKey: 'individual_donors.columns.lastContact', sortKey: 'lastContactDate', width: 'w-32' },
    totalDonations: { labelKey: 'individual_donors.columns.totalDonations', sortKey: 'totalDonations', width: 'w-32' },
    lastGift: { labelKey: 'individual_donors.columns.lastGift', sortKey: 'lastDonationDate', width: 'w-32' },
    nextAction: { labelKey: 'individual_donors.columns.nextAction', width: 'w-40' },
    openTasks: { labelKey: 'individual_donors.columns.openTasks', width: 'w-24' },
    tags: { labelKey: 'individual_donors.columns.tags', sortKey: 'tags', width: 'w-44' },
};

const ALL_COLUMN_IDS = COLUMN_GROUPS.flatMap(g => g.columns);
const ALWAYS_VISIBLE: ColumnId[] = ['donor'];
const DEFAULT_HIDDEN: ColumnId[] = ['country', 'tags'];

const DonorsTable: React.FC<DonorsTableProps> = ({ donors, onDonorSelect, sortColumn, sortDirection, onSort, stageByEmail }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const [selectedDonors, setSelectedDonors] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnId>>(new Set(DEFAULT_HIDDEN));
    const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const rowsPerPage = 10;

    const paginatedDonors = donors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(donors.length / rowsPerPage);

    const visibleColumns = ALL_COLUMN_IDS.filter(id => !hiddenColumns.has(id));
    const visibleCount = visibleColumns.length;
    const totalCount = ALL_COLUMN_IDS.length;

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        setCanScrollLeft(el.scrollLeft > 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        const observer = new ResizeObserver(checkScroll);
        observer.observe(el);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            observer.disconnect();
        };
    }, [checkScroll, hiddenColumns]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsColumnPickerOpen(false);
            }
        };
        if (isColumnPickerOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isColumnPickerOpen]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedDonors(new Set(donors.map(d => d.id)));
        } else {
            setSelectedDonors(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelection = new Set(selectedDonors);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedDonors(newSelection);
    };

    const toggleColumn = (colId: ColumnId) => {
        if (ALWAYS_VISIBLE.includes(colId)) return;
        const next = new Set(hiddenColumns);
        if (next.has(colId)) {
            next.delete(colId);
        } else {
            next.add(colId);
        }
        setHiddenColumns(next);
    };

    const showAllColumns = () => setHiddenColumns(new Set());
    const resetColumns = () => setHiddenColumns(new Set(DEFAULT_HIDDEN));

    const isColumnVisible = (colId: ColumnId) => !hiddenColumns.has(colId);

    const SortableHeader: React.FC<{ column: keyof IndividualDonor; labelKey: string }> = ({ column, labelKey }) => (
        <th scope="col" className="px-4 py-2.5">
            <div className="flex items-center gap-1 cursor-pointer whitespace-nowrap" onClick={() => onSort(column)}>
                {t(labelKey)}
                {sortColumn === column && (
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
            </div>
        </th>
    );

    const PlainHeader: React.FC<{ labelKey: string }> = ({ labelKey }) => (
        <th scope="col" className="px-4 py-2.5 whitespace-nowrap">{t(labelKey)}</th>
    );

    const StageBadge: React.FC<{ stage?: DonorStageId }> = ({ stage }) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {stage ? t(`donors.stages.${stage}`) : t('individual_donors.relationship.noStage')}
        </span>
    );

    const renderColumnHeader = (colId: ColumnId) => {
        const meta = COLUMN_META[colId];
        if (meta.sortKey) {
            return <SortableHeader key={colId} column={meta.sortKey} labelKey={meta.labelKey} />;
        }
        return <PlainHeader key={colId} labelKey={meta.labelKey} />;
    };

    const renderCell = (colId: ColumnId, donor: IndividualDonor, stage: DonorStageId | undefined, nextTask: any, openTasks: any[], overdueTasks: any[], today: string) => {
        switch (colId) {
            case 'donor':
                return (
                    <td key={colId} className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <img className="w-9 h-9 rounded-full flex-shrink-0" src={donor.avatar} alt={donor.fullName.en} loading="lazy" />
                            <div className="min-w-0">
                                <button onClick={() => onDonorSelect(donor)} className="block max-w-full truncate font-bold text-foreground dark:text-dark-foreground hover:underline text-start">{donor.fullName[language]}</button>
                                <div className="max-w-full truncate text-xs text-gray-500">{donor.email}</div>
                            </div>
                        </div>
                    </td>
                );
            case 'donorType':
                return (
                    <td key={colId} className="px-4 py-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {donor.donorType ? t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType) : 'N/A'}
                        </span>
                    </td>
                );
            case 'status':
                return <td key={colId} className="px-4 py-3"><StatusBadge status={donor.status} /></td>;
            case 'pipelineStage':
                return <td key={colId} className="px-4 py-3"><StageBadge stage={stage} /></td>;
            case 'owner':
                return <td key={colId} className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">{donor.assignedManager}</td>;
            case 'country':
                return <td key={colId} className="px-4 py-3">{donor.country}</td>;
            case 'totalDonations':
                return <td key={colId} className="px-4 py-3 font-semibold">{formatCurrency(donor.totalDonations, language)}</td>;
            case 'lastGift':
                return <td key={colId} className="px-4 py-3">{donor.lastDonationDate ? formatDate(donor.lastDonationDate, language) : 'N/A'}</td>;
            case 'lastContact':
                return <td key={colId} className="px-4 py-3">{donor.lastContactDate ? formatRelativeTime(donor.lastContactDate, language) : 'N/A'}</td>;
            case 'nextAction':
                return (
                    <td key={colId} className="px-4 py-3">
                        {nextTask ? (
                            <div>
                                <p className="truncate font-semibold text-gray-700 dark:text-gray-200">{nextTask.text}</p>
                                <p className={`text-xs ${nextTask.dueDate < today ? 'text-red-600 dark:text-red-300' : 'text-gray-500'}`}>{formatDate(nextTask.dueDate, language, 'short')}</p>
                            </div>
                        ) : (
                            <span className="text-xs text-amber-700 dark:text-amber-300">{t('donors.kanban.noNextAction')}</span>
                        )}
                    </td>
                );
            case 'openTasks':
                return (
                    <td key={colId} className="px-4 py-3">
                        <span className="font-bold">{formatNumber(openTasks.length, language)}</span>
                        {overdueTasks.length > 0 && <span className="ms-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-300">{formatNumber(overdueTasks.length, language)} {t('donors.card.overdue')}</span>}
                    </td>
                );
            case 'tags':
                return (
                    <td key={colId} className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 min-w-28">
                            {donor.tags.slice(0, 2).map(tag => <span key={tag} className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-slate-700 rounded-full">{tag}</span>)}
                            {donor.tags.length > 2 && <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-800 rounded-full">+{donor.tags.length - 2}</span>}
                            {donor.tags.length === 0 && <span className="text-xs text-gray-400">{t('individual_donors.relationship.noTags')}</span>}
                        </div>
                    </td>
                );
            default:
                return null;
        }
    };

    const visibleGroups = COLUMN_GROUPS.map(group => ({
        ...group,
        visibleColumns: group.columns.filter(col => isColumnVisible(col)),
    })).filter(group => group.visibleColumns.length > 0);

    return (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
            {/* Toolbar: column picker */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {canScrollRight && (
                        <span className="flex items-center gap-1 text-primary dark:text-secondary animate-pulse">
                            <ChevronRight size={14} />
                            {t('individual_donors.table.scrollForMore')}
                        </span>
                    )}
                </div>
                <div className="relative" ref={pickerRef}>
                    <button
                        onClick={() => setIsColumnPickerOpen(prev => !prev)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            isColumnPickerOpen
                                ? 'border-primary bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary'
                                : 'border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        <Columns3 size={14} />
                        {t('individual_donors.table.columns')} ({visibleCount}/{totalCount})
                    </button>
                    {isColumnPickerOpen && (
                        <div className="absolute end-0 top-full mt-1 z-50 w-72 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground dark:text-dark-foreground">{t('individual_donors.table.visibleColumns')}</span>
                                <div className="flex gap-2">
                                    <button onClick={showAllColumns} className="text-xs text-primary dark:text-secondary hover:underline">{t('individual_donors.table.showAll')}</button>
                                    <button onClick={resetColumns} className="text-xs text-gray-500 hover:underline">{t('individual_donors.table.reset')}</button>
                                </div>
                            </div>
                            {COLUMN_GROUPS.map(group => (
                                <div key={group.groupKey}>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1 py-0.5 rounded ${group.color}`}>
                                        {t(group.groupKey)}
                                    </p>
                                    <div className="space-y-0.5">
                                        {group.columns.map(colId => {
                                            const isLocked = ALWAYS_VISIBLE.includes(colId);
                                            const visible = isColumnVisible(colId);
                                            return (
                                                <button
                                                    key={colId}
                                                    onClick={() => toggleColumn(colId)}
                                                    disabled={isLocked}
                                                    className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors ${
                                                        isLocked
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : visible
                                                                ? 'text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-slate-700'
                                                                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    {visible ? <Eye size={13} /> : <EyeOff size={13} />}
                                                    {t(COLUMN_META[colId].labelKey)}
                                                    {isLocked && <span className="ms-auto text-[10px] text-gray-400">{t('individual_donors.table.locked')}</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table with scroll indicators */}
            <div className="relative">
                {canScrollLeft && (
                    <div className="absolute inset-y-0 start-0 w-8 z-10 pointer-events-none bg-gradient-to-e from-card dark:from-dark-card to-transparent" />
                )}
                {canScrollRight && (
                    <div className="absolute inset-y-0 end-0 w-8 z-10 pointer-events-none bg-gradient-to-s from-transparent to-card dark:to-dark-card ltr:bg-gradient-to-l rtl:bg-gradient-to-r" />
                )}
                <div ref={scrollRef} className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-start text-gray-500 dark:text-gray-400">
                        <thead>
                            {/* Group header row */}
                            <tr className="border-b border-gray-100 dark:border-slate-700/50">
                                <th className="w-10" />
                                {visibleGroups.map(group => (
                                    <th
                                        key={group.groupKey}
                                        colSpan={group.visibleColumns.length}
                                        className="px-2 pt-2 pb-1"
                                    >
                                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${group.color}`}>
                                            {t(group.groupKey)}
                                        </span>
                                    </th>
                                ))}
                                <th className="w-12" />
                            </tr>
                            {/* Column header row */}
                            <tr className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-dark-card/50 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                                <th scope="col" className="p-3 w-10"><input type="checkbox" onChange={handleSelectAll} /></th>
                                {visibleColumns.map(colId => renderColumnHeader(colId))}
                                <th scope="col" className="px-3 py-2 w-12" />
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDonors.map(donor => {
                                const stage = stageByEmail?.get(donor.email.toLowerCase()) || donor.relationshipStage;
                                const openTasks = donor.relationshipTasks?.filter(task => !task.completed) || [];
                                const today = new Date().toISOString().split('T')[0];
                                const overdueTasks = openTasks.filter(task => task.dueDate < today);
                                const nextTask = openTasks.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
                                return (
                                    <tr key={donor.id} className="bg-card dark:bg-dark-card border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                                        <td className="p-3 w-10"><input type="checkbox" checked={selectedDonors.has(donor.id)} onChange={() => handleSelectRow(donor.id)} /></td>
                                        {visibleColumns.map(colId => renderCell(colId, donor, stage, nextTask, openTasks, overdueTasks, today))}
                                        <td className="px-3 py-3 text-end w-12"><button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label="More options"><MoreHorizontalIcon /></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {donors.length === 0 && <div className="text-center py-16 text-gray-500">{t('individual_donors.noResults')}</div>}
                </div>
            </div>
            <nav className="flex items-center justify-between p-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {t('common.pagination_summary', {
                        start: Math.min((currentPage - 1) * rowsPerPage + 1, donors.length),
                        end: Math.min(currentPage * rowsPerPage, donors.length),
                        total: donors.length
                    })}
                </span>
                <ul className="inline-flex items-center -space-x-px rtl:space-x-reverse">
                    <li><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-2 ms-0 leading-tight border rounded-s-lg disabled:opacity-50">{t('common.previous')}</button></li>
                    <li><button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight border rounded-e-lg disabled:opacity-50">{t('common.next')}</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default DonorsTable;
