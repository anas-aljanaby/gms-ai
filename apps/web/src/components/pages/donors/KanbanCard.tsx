
import React from 'react';
import type { Donor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from '../../../lib/utils';
import { MoreHorizontalIcon } from '../../icons/GenericIcons';
import { CalendarClock, Mail, Phone, Plus } from 'lucide-react';

interface KanbanCardProps {
    donor: Donor;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'donors']);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('donorId', donor.id.toString());
    };

    const healthColors = {
        'Good': 'border-green-500',
        'Moderate': 'border-yellow-500',
        'At Risk': 'border-red-500',
    };

    const likelihoodStyles = {
        High: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800',
        Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800',
        Low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    };
    
    const openTasks = donor.tasks.filter(task => !task.completed);
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = openTasks.filter(task => task.dueDate < today);
    const nextTask = openTasks
        .slice()
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const stageEnteredAt = donor.stageEnteredAt || donor.lastContact || donor.firstDonation;
    const stageAgeDays = stageEnteredAt
        ? Math.max(0, Math.floor((Date.now() - new Date(stageEnteredAt).getTime()) / 86400000))
        : null;
    const needsNextAction = openTasks.length === 0 && !['donated', 'dormant'].includes(donor.stage);
    const owner = donor.assignedOwner || t('donors.kanban.unassigned');
    const askAmount = donor.suggestedAskAmount ?? donor.potentialGift;

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className={`flex flex-col space-y-3 bg-card dark:bg-dark-card rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow cursor-grab border-s-4 ${healthColors[donor.relationshipHealth]}`}
            aria-label={t('donors.card.ariaLabel', { name: donor.name })}
        >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={donor.avatar} alt={donor.name} className="w-10 h-10 rounded-full flex-shrink-0 object-cover bg-gray-100" loading="lazy" />
                        <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-base text-foreground dark:text-dark-foreground whitespace-normal">{donor.name}</h3>
                            <p className="text-xs text-gray-500 truncate">
                                {[donor.country, donor.donorType && t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType)].filter(Boolean).join(' / ')}
                            </p>
                        </div>
                    </div>
                    <button className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 flex-shrink-0" aria-label={t('donors.card.moreOptions')}>
                        <MoreHorizontalIcon />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-gray-50 dark:bg-slate-800/60 p-2">
                        <span className="block text-gray-500 dark:text-gray-400">{t('donors.kanban.owner')}</span>
                        <span className="mt-1 block truncate font-bold text-foreground dark:text-dark-foreground">
                            {owner}
                        </span>
                    </div>
                    <div className="rounded-md bg-gray-50 dark:bg-slate-800/60 p-2">
                        <span className="block text-gray-500 dark:text-gray-400">{t('donors.kanban.stageAge')}</span>
                        <span className={`mt-1 block font-bold ${stageAgeDays !== null && stageAgeDays > 30 ? 'text-amber-700 dark:text-amber-300' : 'text-foreground dark:text-dark-foreground'}`}>
                            {stageAgeDays !== null ? t('donors.kanban.daysInStage', { count: formatNumber(stageAgeDays, language) }) : t('common.notAvailable', 'N/A')}
                        </span>
                    </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div>
                        <span className="block text-gray-500 dark:text-gray-400">{t('donors.card.potential')}</span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.potentialGift, language)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 dark:text-gray-400">{t('donors.kanban.suggestedAsk')}</span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(askAmount, language)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 dark:text-gray-400">{t('donors.card.donated')}</span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonated, language)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {donor.likelihood && (
                        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${likelihoodStyles[donor.likelihood]}`}>
                            {t('donors.kanban.likelihood')}: {t(`donors.likelihood.${donor.likelihood}`)}
                        </span>
                    )}
                    {donor.interestTags?.slice(0, 2).map(tag => (
                        <span key={tag} className="rounded-full bg-primary-light/80 px-2 py-1 text-[11px] font-semibold text-primary dark:bg-primary/20 dark:text-secondary">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Task Summary */}
                {(openTasks.length > 0 || needsNextAction) && (
                    <div className={`rounded-lg border p-3 text-sm ${needsNextAction ? 'border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-900/20' : 'border-gray-200 dark:border-slate-700'}`}>
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold text-foreground dark:text-dark-foreground">
                                {needsNextAction ? t('donors.kanban.noNextAction') : `${t('donors.card.openTasks')}: ${formatNumber(openTasks.length, language)}`}
                            </span>
                            {overdueTasks.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-50 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-300">
                                    {t('donors.card.overdue')}: {formatNumber(overdueTasks.length, language)}
                                </span>
                            )}
                        </div>
                        {nextTask && (
                            <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <CalendarClock size={14} className="mt-0.5 shrink-0" />
                                <p className="min-w-0">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{nextTask.text}</span>
                                    <span className="block truncate">{formatDate(nextTask.dueDate, language)} ({formatRelativeTime(nextTask.dueDate, language)})</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {donor.lastContact && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('donors.kanban.lastContact')}: {formatRelativeTime(donor.lastContact, language)}
                    </p>
                )}

                <div className="grid grid-cols-3 gap-2 pt-1">
                    <button className="flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800" title={t('donors.kanban.quickCall')} aria-label={t('donors.kanban.quickCall')}>
                        <Phone size={15} />
                    </button>
                    <button className="flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800" title={t('donors.kanban.quickEmail')} aria-label={t('donors.kanban.quickEmail')}>
                        <Mail size={15} />
                    </button>
                    <button className="flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800" title={t('donors.card.addTask')} aria-label={t('donors.card.addTask')}>
                        <Plus size={15} />
                    </button>
                </div>
                
                {/* Spacer to push actions to bottom */}
                <div className="flex-grow min-h-[0.25rem]"></div>
        </div>
    );
};

export default KanbanCard;
