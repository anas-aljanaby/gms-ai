import React, { useState } from 'react';
import type { Communication, Donation, DonorTask, IndividualDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import Tabs from '../../common/Tabs';
import DetailOverviewTab from './DetailOverviewTab';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime, getDonorCategoryLabel } from '../../../lib/utils';
import { ArrowLeft, CalendarClock, FileText, Mail, MessageSquare, Phone } from 'lucide-react';
import { MOCK_DONATIONS } from '../../../data/donationsData';
import { MOCK_COMMUNICATIONS } from '../../../data/communicationsData';
import LogInteractionModal from './LogInteractionModal';
import SendEmailModal from './SendEmailModal';

interface DonorDetailViewProps {
    donor: IndividualDonor;
    onBack: () => void;
}

const EmptyPanel: React.FC<{ text: string }> = ({ text }) => (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-slate-700 dark:text-gray-400">{text}</div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="rounded-lg border border-gray-200 bg-card p-5 shadow-soft dark:border-slate-700/60 dark:bg-dark-card">
        <h3 className="mb-4 text-base font-bold text-foreground dark:text-dark-foreground">{title}</h3>
        {children}
    </section>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <div className="mt-1 text-sm font-bold text-foreground dark:text-dark-foreground">{value || 'N/A'}</div>
    </div>
);

const DonationsTab: React.FC<{ donations: Donation[] }> = ({ donations }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    if (donations.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noDonations')} />;

    return (
        <Section title={t('individual_donors.detailView.donationHistory')}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-3 py-2 text-start">{t('individual_donors.detailView.date')}</th>
                            <th className="px-3 py-2 text-start">{t('individual_donors.detailView.program')}</th>
                            <th className="px-3 py-2 text-end">{t('individual_donors.detailView.amount')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {donations.map(donation => (
                            <tr key={donation.id}>
                                <td className="px-3 py-3">{formatDate(donation.date, language)}</td>
                                <td className="px-3 py-3 font-semibold">{donation.program}</td>
                                <td className="px-3 py-3 text-end font-bold">{formatCurrency(donation.amount, language)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
};

const CommunicationsTab: React.FC<{ communications: Communication[] }> = ({ communications }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    if (communications.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noCommunications')} />;

    return (
        <Section title={t('individual_donors.detailView.communicationHistory')}>
            <div className="space-y-3">
                {communications.map(communication => (
                    <div key={communication.communication_id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-md bg-primary-light p-2 text-primary dark:bg-primary/20 dark:text-secondary">
                                    {communication.communication_type === 'call' ? <Phone size={16} /> : communication.communication_type === 'email' ? <Mail size={16} /> : <MessageSquare size={16} />}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground dark:text-dark-foreground">{communication.subject}</p>
                                    <p className="text-xs text-gray-500">{communication.communication_type} / {communication.status}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500">{formatRelativeTime(communication.sent_at, language)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const TasksTab: React.FC<{ tasks: DonorTask[] }> = ({ tasks }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const openTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const today = new Date().toISOString().split('T')[0];

    if (tasks.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noTasks')} />;

    return (
        <div className="space-y-4">
            <Section title={t('individual_donors.detailView.openTasks')}>
                <div className="space-y-3">
                    {openTasks.map(task => (
                        <div key={task.id} className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                            <div>
                                <p className="font-bold">{task.text}</p>
                                <p className="text-xs text-gray-500">{task.type} / {task.assignedTo}</p>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs font-bold ${task.dueDate < today ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}>
                                {formatDate(task.dueDate, language)}
                            </span>
                        </div>
                    ))}
                    {openTasks.length === 0 && <EmptyPanel text={t('individual_donors.detailView.noOpenTasks')} />}
                </div>
            </Section>
            {completedTasks.length > 0 && (
                <Section title={t('individual_donors.detailView.completedTasks')}>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <div key={task.id} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-slate-800/60 dark:text-gray-300">{task.text}</div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

const ProfileTab: React.FC<{ donor: IndividualDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors', 'misc']);
    const donorName = donor.fullName[language] || donor.fullName.en;
    const openTasks = donor.relationshipTasks?.filter(task => !task.completed) || [];
    const nextTask = openTasks.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Section title={t('individual_donors.detailView.identity')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('individual_donors.detailView.fullName')} value={donorName} />
                        <InfoRow label={t('individual_donors.columns.donorType')} value={donor.donorType ? t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.country')} value={[donor.city, donor.country].filter(Boolean).join(', ')} />
                        <InfoRow label={t('individual_donors.detailView.preferredLanguage')} value={donor.preferred_language?.toUpperCase() || 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.status')} value={donor.status} />
                        <InfoRow label={t('individual_donors.columns.tags')} value={donor.tags.length > 0 ? donor.tags.join(', ') : t('individual_donors.relationship.noTags')} />
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.contactInfo')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('individual_donors.modal.email')} value={donor.email} />
                        <InfoRow label={t('individual_donors.modal.phone')} value={donor.phone} />
                        <InfoRow label="WhatsApp" value={donor.whatsapp || donor.phone} />
                        <InfoRow label={t('individual_donors.detailView.preferredChannel')} value={donor.preferred_contact_channel || 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.bestContact')} value={donor.best_contact_time ? `${donor.best_contact_day_of_week || ''} ${donor.best_contact_time}` : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.address')} value={donor.address || 'N/A'} />
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.relationshipOwnership')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('individual_donors.columns.owner')} value={donor.assignedManager} />
                        <InfoRow label={t('individual_donors.columns.pipelineStage')} value={donor.relationshipStage ? t(`donors.stages.${donor.relationshipStage}`) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.relationshipHealth')} value={donor.relationshipHealth || 'N/A'} />
                        <InfoRow label={t('donors.kanban.likelihood')} value={donor.relationshipLikelihood ? t(`donors.likelihood.${donor.relationshipLikelihood}`) : 'N/A'} />
                        <InfoRow label={t('donors.kanban.stageAge')} value={donor.stageEnteredAt ? formatRelativeTime(donor.stageEnteredAt, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.stageHistory')} value={formatNumber(donor.stageHistory?.length || 0, language)} />
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Section title={t('individual_donors.detailView.givingHistory')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('individual_donors.columns.totalDonations')} value={formatCurrency(donor.totalDonations, language)} />
                        <InfoRow label={t('individual_donors.kpi.totalGifts')} value={formatNumber(donor.donationsCount || 0, language)} />
                        <InfoRow label={t('individual_donors.kpi.avgGift')} value={formatCurrency(donor.avgGift || 0, language)} />
                        <InfoRow label={t('individual_donors.detailView.largestGift')} value={formatCurrency(donor.largestGift || 0, language)} />
                        <InfoRow label={t('individual_donors.columns.lastGift')} value={donor.lastDonationDate ? formatDate(donor.lastDonationDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.programsSupported')} value={donor.programsSupported?.join(', ') || 'N/A'} />
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.pipelineAsk')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('donors.card.potential')} value={formatCurrency(donor.potentialGift || 0, language)} />
                        <InfoRow label={t('donors.kanban.suggestedAsk')} value={formatCurrency(donor.suggestedAskAmount || 0, language)} />
                        <InfoRow label={t('individual_donors.detailView.currentProposal')} value={donor.currentProposal || 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.askDate')} value={donor.askDate ? formatDate(donor.askDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.pledgeStatus')} value={donor.pledgeStatus || 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.expectedClose')} value={donor.expectedCloseDate ? formatDate(donor.expectedCloseDate, language) : 'N/A'} />
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.tasksNextActions')}>
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.columns.nextAction')} value={nextTask ? nextTask.text : t('donors.kanban.noNextAction')} />
                        <InfoRow label={t('donors.card.due')} value={nextTask ? formatDate(nextTask.dueDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.openTasks')} value={formatNumber(openTasks.length, language)} />
                        <InfoRow label={t('individual_donors.columns.lastContact')} value={donor.lastContactDate ? formatRelativeTime(donor.lastContactDate, language) : 'N/A'} />
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Section title={t('individual_donors.detailView.notesIntelligence')}>
                    <div className="space-y-4 text-sm">
                        <InfoRow label={t('donorIntelligence.table.category')} value={getDonorCategoryLabel(donor.donorCategory || 'General Donor', t)} />
                        <InfoRow label={t('individual_donors.detailView.relationshipNotes')} value={donor.relationshipNotes} />
                        <InfoRow label={t('individual_donors.detailView.recommendedNextStep')} value={donor.recommendedNextStep} />
                        {donor.aiInsights?.map(insight => <p key={insight} className="rounded-md bg-primary-light/60 p-3 font-semibold text-primary dark:bg-primary/20 dark:text-secondary">{insight}</p>)}
                        {donor.riskSignals?.map(signal => <p key={signal} className="rounded-md bg-red-50 p-3 font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-200">{signal}</p>)}
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.documents')}>
                    <div className="space-y-3">
                        {donor.documents && donor.documents.length > 0 ? donor.documents.map(document => (
                            <div key={document.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-slate-700">
                                <FileText size={18} className="text-primary" />
                                <div>
                                    <p className="font-bold">{document.title}</p>
                                    <p className="text-xs text-gray-500">{document.type} / {formatDate(document.date, language)}</p>
                                </div>
                            </div>
                        )) : <EmptyPanel text={t('individual_donors.detailView.noDocuments')} />}
                    </div>
                </Section>
                <Section title={t('individual_donors.detailView.stageTimeline')}>
                    <div className="space-y-3">
                        {donor.stageHistory?.map((entry, index) => (
                            <div key={`${entry.stage}-${entry.enteredAt}-${index}`} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-7 w-7 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary flex items-center justify-center"><CalendarClock size={14} /></div>
                                    {index < (donor.stageHistory?.length || 0) - 1 && <div className="h-8 w-px bg-gray-200 dark:bg-slate-700" />}
                                </div>
                                <div>
                                    <p className="font-bold">{t(`donors.stages.${entry.stage}`)}</p>
                                    <p className="text-xs text-gray-500">{formatDate(entry.enteredAt, language)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};


const DonorDetailView: React.FC<DonorDetailViewProps> = ({ donor, onBack }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'misc']);
    const toast = useToast();
    const [activeTab, setActiveTab] = React.useState('profile');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleLogInteraction = (interaction: any) => {
        console.log('Logging interaction:', interaction);
        toast.showSuccess('Interaction logged successfully.');
        setIsLogModalOpen(false);
    };

    const handleSendEmail = (emailData: any) => {
        console.log('Sending email:', emailData);
        toast.showSuccess(`Email sent to ${emailData.to}.`);
        setIsEmailModalOpen(false);
    };

    const StatusBadge: React.FC<{ status: IndividualDonor['status'] }> = ({ status }) => {
        const statusKey = status.replace(/ /g, '');
        const styles: Record<IndividualDonor['status'], string> = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'Lapsed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Deceased': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            'Disqualified': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`individual_donors.statuses.${statusKey}`)}</span>;
    };
    
    const TierBadge: React.FC<{ tier: IndividualDonor['tier'] }> = ({ tier }) => {
        const tierKey = tier.replace(/ /g, '');
        const styles: Record<string, string> = {
            'Bronze': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
            'Silver': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'Gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'Platinum': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'MajorDonor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
        };
        const styleClass = styles[tierKey] || styles['Bronze'];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styleClass}`}>{t(`individual_donors.tiers.${tierKey}`)}</span>;
    };

    const tabs = [
        { id: 'overview', label: t('individual_donors.detailView.overview') },
        { id: 'donations', label: t('individual_donors.detailView.donations') },
        { id: 'communications', label: t('individual_donors.detailView.communications') },
        { id: 'tasks', label: t('individual_donors.detailView.tasks') },
        { id: 'profile', label: t('individual_donors.detailView.profile') },
    ];

    const renderTabContent = () => {
        // This data would normally be filtered by a hook, but for now we filter it here
        const donorDonations = MOCK_DONATIONS.filter(d => d.donorId === donor.id);
        const donorCommunications = MOCK_COMMUNICATIONS.filter(c => c.donor_id === donor.id);

        switch(activeTab) {
            case 'overview':
                return <DetailOverviewTab donor={donor} donations={donorDonations} communications={donorCommunications} />;
            case 'donations':
                return <DonationsTab donations={donorDonations} />;
            case 'communications':
                return <CommunicationsTab communications={donorCommunications} />;
            case 'tasks':
                return <TasksTab tasks={donor.relationshipTasks || []} />;
             case 'profile':
                return <ProfileTab donor={donor} />;
            default:
                return <div className="text-center p-8">{t('placeholder.underConstruction')}</div>
        }
    };

    return (
        <>
            <div className="animate-fade-in">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-4">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('individual_donors.backToList')}
                </button>

                <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border border-gray-200 dark:border-slate-700/50">
                    {/* Header */}
                    <div className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b dark:border-slate-700">
                        <img src={donor.avatar} alt={donor.fullName[language]} className="w-24 h-24 rounded-full border-4 border-primary-light dark:border-primary/20" />
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold">{donor.fullName[language]}</h1>
                            <p className="text-gray-500">{donor.country}</p>
                            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                                <TierBadge tier={donor.tier} />
                                <StatusBadge status={donor.status} />
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setIsEmailModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary-dark">{t('individual_donors.detailView.sendEmail')}</button>
                            <button onClick={() => setIsLogModalOpen(true)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">{t('individual_donors.detailView.logInteraction')}</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 pt-2">
                        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 bg-gray-50/50 dark:bg-dark-background/20 rounded-b-2xl">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            <LogInteractionModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onLog={handleLogInteraction}
            />
            <SendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                donorEmail={donor.email}
            />
        </>
    );
};

export default DonorDetailView;
