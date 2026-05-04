
import React, { useMemo, useState } from 'react';
import type { Donor, DonorTask, AiSuggestion } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { MoreHorizontalIcon, SparklesIcon } from '../../icons/GenericIcons';
import { TaskIcon, DonationIcon } from '../../icons/ActionIcons';
import AiActionModal from './AiActionModal';

interface KanbanCardProps {
    donor: Donor;
    dispatch: React.Dispatch<any>;
}

const daysSince = (isoDate: string) => {
    if (!isoDate) return Number.POSITIVE_INFINITY;

    const timestamp = new Date(isoDate).getTime();
    if (Number.isNaN(timestamp)) return Number.POSITIVE_INFINITY;

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - timestamp) / msPerDay);
};

const buildSuggestion = (donor: Donor, language: string): AiSuggestion => {
    const isArabic = language === 'ar';
    const overdueTask = donor.tasks.find(task => !task.completed && task.dueDate < new Date().toISOString().split('T')[0]);
    const lastContactDays = daysSince(donor.lastContact);

    const copy = {
        overdue: {
            action: isArabic ? `أنهِ المهمة المتأخرة: ${overdueTask?.text ?? ''}` : `Resolve overdue task: ${overdueTask?.text ?? ''}`,
            rationale: isArabic
                ? 'توجد مهمة متابعة متأخرة، ومعالجتها أولاً هي أسرع خطوة لحماية العلاقة واستعادة الزخم.'
                : 'There is an overdue follow-up task, so clearing it first is the fastest way to protect momentum.',
        },
        atRisk: {
            action: isArabic ? 'رتّب مكالمة إعادة تواصل هذا الأسبوع' : 'Schedule a re-engagement call this week',
            rationale: isArabic
                ? 'صحة العلاقة مصنفة كمعرضة للخطر، لذا التواصل الشخصي السريع أفضل من الانتظار أو إرسال رسالة عامة.'
                : 'The relationship is marked at risk, so a personal touchpoint is more urgent than a generic update.',
        },
        stale: {
            action: isArabic ? 'أرسل رسالة متابعة شخصية' : 'Send a personalized check-in email',
            rationale: isArabic
                ? 'مر وقت طويل منذ آخر تواصل، ورسالة قصيرة مرتبطة باهتمامات المتبرع تساعد على إعادة فتح الحوار.'
                : 'It has been a while since the last contact, and a brief personalized note is the best way to reopen the conversation.',
        },
        prospect: {
            action: isArabic ? 'حدّد مكالمة تعريفية قصيرة' : 'Book a short introductory call',
            rationale: isArabic
                ? 'المتبرع ما يزال في مرحلة الاهتمام الأولي، لذا الخطوة التالية الأنسب هي تحويل الاهتمام إلى تواصل مباشر.'
                : 'The donor is still at the prospect stage, so the next best step is converting interest into a real conversation.',
        },
        contacted: {
            action: isArabic ? 'شارك قصة أثر مرتبطة باهتمامه' : 'Share a tailored impact story',
            rationale: isArabic
                ? 'بعد التواصل الأول، أفضل طريقة لتعميق الاهتمام هي إرسال مثال واضح يربط الدعم بالنتيجة.'
                : 'After first contact, a concrete impact story is the best way to deepen interest.',
        },
        cultivating: {
            action: isArabic ? 'ادعه إلى إحاطة أو لقاء قصير' : 'Invite them to a short briefing',
            rationale: isArabic
                ? 'العلاقة في مرحلة البناء، ودعوة موجزة تساعد على نقلها من الاهتمام إلى الالتزام.'
                : 'The relationship is being cultivated, and a short briefing helps move it from interest toward commitment.',
        },
        solicited: {
            action: isArabic ? 'تابع الطلب المفتوح بوضوح ولطف' : 'Follow up on the open ask',
            rationale: isArabic
                ? 'تم تقديم الطلب بالفعل، لذا المتابعة الواضحة وفي الوقت المناسب أهم من بدء محادثة جديدة.'
                : 'An ask is already in play, so a timely, clear follow-up is more useful than starting a new thread.',
        },
        stewardship: {
            action: isArabic ? 'أرسل تحديث أثر وشكر شخصي' : 'Send an impact update and thank-you',
            rationale: isArabic
                ? 'مرحلة الرعاية تحتاج إلى تعزيز الثقة وإظهار النتائج للحفاظ على العلاقة على المدى الطويل.'
                : 'Stewardship works best when it reinforces trust and shows the results of the donor’s support.',
        },
    };

    if (overdueTask) return copy.overdue;
    if (donor.relationshipHealth === 'At Risk') return copy.atRisk;
    if (lastContactDays >= 45) return copy.stale;

    switch (donor.stage) {
        case 'prospect':
            return copy.prospect;
        case 'contacted':
            return copy.contacted;
        case 'cultivating':
            return copy.cultivating;
        case 'solicited':
            return copy.solicited;
        case 'stewardship':
        default:
            return copy.stewardship;
    }
};

const KanbanCard: React.FC<KanbanCardProps> = ({ donor, dispatch }) => {
    const { t, language } = useLocalization(['common', 'donors']);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const aiSuggestion = useMemo(() => buildSuggestion(donor, language), [donor, language]);
    const isLoadingSuggestion = false;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('donorId', donor.id.toString());
    };

    const handleTaskToggle = (taskId: string, completed: boolean) => {
        dispatch({ type: 'SET_TASK_COMPLETED', payload: { donorId: donor.id, taskId, completed } });
    };

    const healthColors = {
        'Good': 'border-green-500',
        'Moderate': 'border-yellow-500',
        'At Risk': 'border-red-500',
    };
    
    const openTasks = donor.tasks.filter(task => !task.completed);
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <AiActionModal 
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                donor={donor}
                suggestion={aiSuggestion}
            />
            <div
                draggable
                onDragStart={handleDragStart}
                className={`flex flex-col space-y-3 bg-card dark:bg-dark-card rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow cursor-grab border-s-4 ${healthColors[donor.relationshipHealth]}`}
                aria-label={t('donors.card.ariaLabel', { name: donor.name })}
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                        <img src={donor.avatar} alt={donor.name} className="w-10 h-10 rounded-full flex-shrink-0" loading="lazy" />
                        <div className="flex-grow">
                            <h3 className="font-bold text-base text-foreground dark:text-dark-foreground whitespace-normal">{donor.name}</h3>
                            <p className="text-xs text-gray-500">{donor.country}</p>
                        </div>
                    </div>
                    <button className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 flex-shrink-0" aria-label={t('donors.card.moreOptions')}>
                        <MoreHorizontalIcon />
                    </button>
                </div>

                {/* Financials */}
                <div className="flex justify-between text-sm bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">{t('donors.card.potential')}: </span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.potentialGift, language)}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">{t('donors.card.donated')}: </span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonated, language)}</span>
                    </div>
                </div>

                {/* AI Suggestion */}
                <div className="p-3 rounded-lg bg-primary-light/50 dark:bg-primary/20 border-l-4 border-primary dark:border-secondary">
                    <h4 className="text-xs font-bold uppercase text-primary dark:text-secondary mb-2 flex items-center gap-1">
                        <SparklesIcon className="w-4 h-4" /> {t('donors.ai_suggestion.title')}
                    </h4>
                    {isLoadingSuggestion ? (
                        <div className="h-10 flex items-center text-xs">{t('donors.ai_suggestion.loading')}</div>
                    ) : aiSuggestion ? (
                        <div>
                            <p className="font-bold text-sm text-primary-dark dark:text-white">💡 {aiSuggestion.action}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t('donors.ai_suggestion.rationale')}: {aiSuggestion.rationale}</p>
                             <button onClick={() => setIsActionModalOpen(true)} className="mt-2 text-xs font-bold text-white bg-primary dark:bg-secondary px-3 py-1 rounded-full hover:bg-primary-dark">
                                {t('donors.ai_suggestion.start')}
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">{t('donors.ai_suggestion.error')}</p>
                    )}
                </div>

                {/* Tasks */}
                {openTasks.length > 0 && (
                    <div className="">
                        <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">{t('donors.card.openTasks')}</h4>
                        <ul className="space-y-2 text-sm">
                            {openTasks.map(task => {
                                 const isOverdue = task.dueDate < today;
                                 return (
                                    <li key={task.id} className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary mt-0.5 flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <p className={`leading-tight whitespace-normal ${isOverdue ? 'text-red-600 dark:text-red-500' : 'text-foreground dark:text-dark-foreground'}`}>{task.text}</p>
                                            <p className={`text-xs ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {isOverdue && <span className="font-extrabold">{t('donors.card.overdue')}! </span>}
                                                {t('donors.card.due')} {formatDate(task.dueDate, language)}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                
                {/* Spacer to push actions to bottom */}
                <div className="flex-grow min-h-[0.25rem]"></div>

                {/* Quick Actions */}
                 <div className="flex justify-end gap-1 border-t dark:border-slate-700 pt-2">
                     <button className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-slate-700" title={t('donors.card.addTask')}>
                         <TaskIcon />
                     </button>
                     <button className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-slate-700" title={t('donors.card.addDonation')}>
                         <DonationIcon />
                     </button>
                </div>
            </div>
        </>
    );
};

export default KanbanCard;
