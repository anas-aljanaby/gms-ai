import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { IndividualDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import { useDonorProfileDonations, useDonorProfileInteractions, useDonorProfileSummary, useDonorProfileTasks } from '../../../hooks/useDonorProfileSummary';
import { api } from '../../../lib/api';
import { formatCurrency, formatDate, formatRelativeTime } from '../../../lib/utils';
import Tabs from '../../common/Tabs';
import { ArrowLeft, Check, FileText, Mail, MapPin, MessageSquare, Pencil, X } from 'lucide-react';
import LogInteractionModal from './LogInteractionModal';
import SendEmailModal from './SendEmailModal';
import DonorGivingTab from './tabs/DonorGivingTab';
import DonorOverviewTab from './tabs/DonorOverviewTab';
import DonorRelationshipActivityTab from './tabs/DonorRelationshipActivityTab';
import { Chip, EmptyPanel, InfoRow, RelationshipHealthChip, Section } from './tabs/profileUi';

interface DonorDetailViewProps {
    donor: IndividualDonor;
    onBack: () => void;
    onDonorUpdated?: (donor: IndividualDonor) => void;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DONOR_STATUSES: IndividualDonor['status'][] = ['Active', 'Lapsed', 'On Hold', 'Deceased', 'Disqualified'];
const DONOR_TIERS: IndividualDonor['tier'][] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Major Donor'];

interface HeaderFormState {
    fullNameEn: string;
    fullNameAr: string;
    country: string;
    tagsText: string;
    status: IndividualDonor['status'];
    tier: IndividualDonor['tier'];
    assignedManager: string;
}

const buildHeaderFormState = (donor: IndividualDonor): HeaderFormState => ({
    fullNameEn: donor.fullName.en || '',
    fullNameAr: donor.fullName.ar || '',
    country: donor.country || '',
    tagsText: (donor.tags || []).join(', '),
    status: donor.status,
    tier: donor.tier,
    assignedManager: donor.assignedManager || '',
});

const parseTags = (value: string) => Array.from(new Set(value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)));

const StatusBadge: React.FC<{ status: IndividualDonor['status']; label: string }> = ({ status, label }) => {
    const styles: Record<IndividualDonor['status'], string> = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Lapsed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        Deceased: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        Disqualified: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[status]}`}>{label}</span>;
};

const TierBadge: React.FC<{ tier: IndividualDonor['tier']; label: string }> = ({ tier, label }) => {
    const styles: Record<string, string> = {
        Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        Silver: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Platinum: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        MajorDonor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    };

    return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[tier.replace(/ /g, '')] || styles.Bronze}`}>{label}</span>;
};

const LoadingProfile = () => (
    <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
    </div>
);

const DonorDocumentsTab: React.FC<{ donor: IndividualDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    return (
        <Section title={t('individual_donors.detailView.documents')} icon={<FileText size={18} />}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {donor.documents && donor.documents.length > 0 ? donor.documents.map((document) => (
                    <div key={document.id} className="flex min-w-0 items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
                        <FileText size={18} className="mt-1 flex-shrink-0 text-primary dark:text-secondary" />
                        <div className="min-w-0">
                            <p className="break-words font-bold text-foreground dark:text-dark-foreground">{document.title}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{document.type} / {formatDate(document.date, language)}</p>
                        </div>
                    </div>
                )) : <div className="md:col-span-2 xl:col-span-3"><EmptyPanel text={t('individual_donors.detailView.noDocuments')} /></div>}
            </div>
        </Section>
    );
};

const DonorDetailView: React.FC<DonorDetailViewProps> = ({ donor, onBack, onDonorUpdated }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors', 'misc']);
    const toast = useToast();
    const queryClient = useQueryClient();
    const [editableDonor, setEditableDonor] = useState(donor);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isHeaderEditing, setIsHeaderEditing] = useState(false);
    const [isSavingHeader, setIsSavingHeader] = useState(false);
    const [headerForm, setHeaderForm] = useState<HeaderFormState>(() => buildHeaderFormState(donor));

    const summaryQuery = useDonorProfileSummary(editableDonor.id, editableDonor);
    const donationsQuery = useDonorProfileDonations(editableDonor.id);
    const tasksQuery = useDonorProfileTasks(editableDonor.id, editableDonor);
    const interactionsQuery = useDonorProfileInteractions(editableDonor.id);

    const summary = summaryQuery.data;
    const donorName = summary ? (language === 'ar' && summary.donor.full_name_ar ? summary.donor.full_name_ar : summary.donor.full_name_en) : (editableDonor.fullName[language] || editableDonor.fullName.en);
    const statusKey = (summary?.donor.status || editableDonor.status).replace(/ /g, '');
    const tierKey = (summary?.donor.tier || editableDonor.tier).replace(/ /g, '');
    const isApiBackedDonor = UUID_RE.test(editableDonor.id);
    const visibleTags = useMemo(() => (summary?.donor.tags || editableDonor.tags || []).filter(Boolean).slice(0, 6), [editableDonor.tags, summary?.donor.tags]);

    const invalidateProfile = () => {
        void queryClient.invalidateQueries({ queryKey: ['donor-profile-summary', editableDonor.id] });
        void queryClient.invalidateQueries({ queryKey: ['donor-profile-interactions', editableDonor.id] });
        void queryClient.invalidateQueries({ queryKey: ['donors'] });
    };

    const startHeaderEdit = () => {
        setHeaderForm(buildHeaderFormState({
            ...editableDonor,
            fullName: {
                en: summary?.donor.full_name_en || editableDonor.fullName.en,
                ar: summary?.donor.full_name_ar || editableDonor.fullName.ar,
            },
            country: summary?.donor.country || editableDonor.country,
            tags: summary?.donor.tags || editableDonor.tags,
            status: summary?.donor.status || editableDonor.status,
            tier: summary?.donor.tier || editableDonor.tier,
            assignedManager: summary?.donor.assigned_manager || editableDonor.assignedManager,
        }));
        setIsHeaderEditing(true);
    };

    const updateHeaderForm = <K extends keyof HeaderFormState>(key: K, value: HeaderFormState[K]) => {
        setHeaderForm((current) => ({ ...current, [key]: value }));
    };

    const handleHeaderSave = async (event: React.FormEvent) => {
        event.preventDefault();
        const fullNameEn = headerForm.fullNameEn.trim();
        if (!fullNameEn) {
            toast.showError(t('individual_donors.modal.requiredFields'));
            return;
        }

        const tags = parseTags(headerForm.tagsText);
        const payload = {
            full_name_en: fullNameEn,
            full_name_ar: headerForm.fullNameAr.trim(),
            country: headerForm.country.trim(),
            tags,
            status: headerForm.status,
            tier: headerForm.tier,
            assigned_manager: headerForm.assignedManager.trim(),
        };

        setIsSavingHeader(true);
        try {
            if (isApiBackedDonor) {
                await api.patch(`/donors/${editableDonor.id}`, payload);
            }

            const updatedDonor: IndividualDonor = {
                ...editableDonor,
                fullName: {
                    en: payload.full_name_en,
                    ar: payload.full_name_ar || payload.full_name_en,
                },
                country: payload.country,
                tags,
                status: payload.status,
                tier: payload.tier,
                assignedManager: payload.assigned_manager,
            };

            setEditableDonor(updatedDonor);
            onDonorUpdated?.(updatedDonor);
            queryClient.setQueryData(['donor-profile-summary', editableDonor.id], summary ? {
                ...summary,
                donor: {
                    ...summary.donor,
                    full_name_en: payload.full_name_en,
                    full_name_ar: payload.full_name_ar || payload.full_name_en,
                    country: payload.country,
                    tags,
                    status: payload.status,
                    tier: payload.tier,
                    assigned_manager: payload.assigned_manager,
                },
                relationship: {
                    ...summary.relationship,
                    owner: payload.assigned_manager,
                },
            } : summary);
            invalidateProfile();
            setIsHeaderEditing(false);
            toast.showSuccess(t('individual_donors.detailView.headerSaved', 'Donor profile updated.'));
        } catch (error) {
            toast.showError(error instanceof Error ? error.message : t('individual_donors.detailView.headerSaveFailed', 'Unable to update donor profile.'));
        } finally {
            setIsSavingHeader(false);
        }
    };

    const handleLogInteraction = async (interaction: { type: string; date: string; subject: string; notes: string }) => {
        if (isApiBackedDonor) {
            try {
                await api.post(`/donors/${editableDonor.id}/interactions`, {
                    interaction_type: interaction.type.toLowerCase(),
                    occurred_at: new Date(interaction.date).toISOString(),
                    subject: interaction.subject || interaction.type,
                    notes: interaction.notes,
                    status: 'logged',
                });
                invalidateProfile();
            } catch (error) {
                toast.showError(error instanceof Error ? error.message : 'Unable to log interaction.');
                return;
            }
        }

        toast.showSuccess('Interaction logged successfully.');
        setIsLogModalOpen(false);
    };

    const handleSendEmail = async (emailData: { to: string; subject: string; body: string }) => {
        if (isApiBackedDonor) {
            try {
                await api.post(`/donors/${editableDonor.id}/interactions`, {
                    interaction_type: 'email',
                    occurred_at: new Date().toISOString(),
                    subject: emailData.subject || 'Email sent',
                    notes: emailData.body,
                    status: 'sent',
                });
                invalidateProfile();
            } catch {
                // Sending email is still a UI-only workflow in this MVP; keep the user moving.
            }
        }

        toast.showSuccess(`Email sent to ${emailData.to}.`);
        setIsEmailModalOpen(false);
    };

    const tabs = [
        { id: 'overview', label: t('individual_donors.detailView.overview') },
        { id: 'giving', label: t('individual_donors.detailView.giving', 'Giving') },
        { id: 'relationship', label: t('individual_donors.detailView.relationshipActivity', 'Relationship / Activity') },
        { id: 'documents', label: t('individual_donors.detailView.documents') },
    ];

    const renderTabContent = () => {
        if (!summary) return <LoadingProfile />;

        switch (activeTab) {
            case 'overview':
                return <DonorOverviewTab summary={summary} onLogInteraction={() => setIsLogModalOpen(true)} />;
            case 'giving':
                return <DonorGivingTab summary={summary} donations={donationsQuery.data || []} isLoading={donationsQuery.isLoading} />;
            case 'relationship':
                return (
                    <DonorRelationshipActivityTab
                        donor={editableDonor}
                        summary={summary}
                        tasks={tasksQuery.data || []}
                        interactions={interactionsQuery.data || []}
                        isLoading={tasksQuery.isLoading || interactionsQuery.isLoading}
                    />
                );
            case 'documents':
                return <DonorDocumentsTab donor={editableDonor} />;
            default:
                return <div className="p-8 text-center">{t('placeholder.underConstruction')}</div>;
        }
    };

    if (summaryQuery.isLoading && !summary) {
        return <LoadingProfile />;
    }

    const status = summary?.donor.status || editableDonor.status;
    const tier = summary?.donor.tier || editableDonor.tier;
    const location = [editableDonor.city, summary?.donor.country || editableDonor.country].filter(Boolean).join(', ');

    return (
        <>
            <div className="animate-fade-in space-y-4 pb-24 md:pb-0">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('individual_donors.backToList')}
                </button>

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-card shadow-soft dark:border-slate-700/60 dark:bg-dark-card">
                    <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                            <img src={summary?.donor.avatar || editableDonor.avatar} alt={donorName} className="h-20 w-20 flex-shrink-0 rounded-2xl border-4 border-primary-light object-cover dark:border-primary/20 sm:h-24 sm:w-24" />
                            <div className="min-w-0 flex-1">
                                {isHeaderEditing ? (
                                    <form id="donor-header-form" onSubmit={handleHeaderSave} className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.modal.fullNameEN')}</span>
                                            <input value={headerForm.fullNameEn} onChange={(event) => updateHeaderForm('fullNameEn', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900" />
                                        </label>
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.modal.fullNameAR')}</span>
                                            <input value={headerForm.fullNameAr} onChange={(event) => updateHeaderForm('fullNameAr', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900" dir="auto" />
                                        </label>
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.country')}</span>
                                            <input value={headerForm.country} onChange={(event) => updateHeaderForm('country', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900" />
                                        </label>
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.owner')}</span>
                                            <input value={headerForm.assignedManager} onChange={(event) => updateHeaderForm('assignedManager', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900" />
                                        </label>
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.status')}</span>
                                            <select value={headerForm.status} onChange={(event) => updateHeaderForm('status', event.target.value as IndividualDonor['status'])} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900">
                                                {DONOR_STATUSES.map((option) => <option key={option} value={option}>{t(`individual_donors.statuses.${option.replace(/ /g, '')}`, option)}</option>)}
                                            </select>
                                        </label>
                                        <label className="min-w-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.tier')}</span>
                                            <select value={headerForm.tier} onChange={(event) => updateHeaderForm('tier', event.target.value as IndividualDonor['tier'])} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900">
                                                {DONOR_TIERS.map((option) => <option key={option} value={option}>{t(`individual_donors.tiers.${option.replace(/ /g, '')}`, option)}</option>)}
                                            </select>
                                        </label>
                                        <label className="min-w-0 lg:col-span-2">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.tags')}</span>
                                            <input value={headerForm.tagsText} onChange={(event) => updateHeaderForm('tagsText', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900" placeholder="major donor, qurbani, newsletter" />
                                        </label>
                                    </form>
                                ) : (
                                    <>
                                        <h1 className="break-words text-2xl font-bold leading-tight text-foreground dark:text-dark-foreground sm:text-3xl">{donorName}</h1>
                                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            <MapPin size={15} /> {location || 'N/A'}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <TierBadge tier={tier} label={t(`individual_donors.tiers.${tierKey}`, tier)} />
                                            <StatusBadge status={status} label={t(`individual_donors.statuses.${statusKey}`, status)} />
                                            {summary?.relationship.pipelineStage && <Chip tone="blue">{t(`donors.stages.${summary.relationship.pipelineStage}`, summary.relationship.pipelineStage)}</Chip>}
                                            <RelationshipHealthChip health={summary?.relationship.health || null} />
                                            {visibleTags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-80 xl:grid-cols-1">
                            {isHeaderEditing ? (
                                <div className="grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-1">
                                    <button type="submit" form="donor-header-form" disabled={isSavingHeader} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
                                        <Check size={16} /> {isSavingHeader ? t('common.loading') : t('common.save')}
                                    </button>
                                    <button type="button" onClick={() => setIsHeaderEditing(false)} disabled={isSavingHeader} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:hover:bg-slate-700">
                                        <X size={16} /> {t('common.cancel')}
                                    </button>
                                </div>
                            ) : (
                                <button onClick={startHeaderEdit} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                                    <Pencil size={16} /> {t('common.edit', 'Edit')}
                                </button>
                            )}
                            <button onClick={() => setIsEmailModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-dark">
                                <Mail size={16} /> {t('individual_donors.detailView.sendEmail')}
                            </button>
                            <button onClick={() => setIsLogModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                                <MessageSquare size={16} /> {t('individual_donors.detailView.logInteraction')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-gray-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/20 xl:grid-cols-4">
                        <InfoRow label={t('individual_donors.columns.totalDonations')} value={summary ? formatCurrency(summary.giving.lifetimeGiving, language) : 'N/A'} muted />
                        <InfoRow label={t('individual_donors.columns.owner')} value={summary?.relationship.owner || 'Unassigned'} />
                        <InfoRow label={t('individual_donors.columns.lastContact')} value={summary?.relationship.lastContact?.occurred_at ? formatRelativeTime(summary.relationship.lastContact.occurred_at, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.nextAction')} value={summary?.nextAction?.text || t('donors.kanban.noNextAction')} />
                    </div>
                </section>

                {summaryQuery.isError && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-200">
                        {t('individual_donors.detailView.summaryFallback', 'Profile summary is using local fallback data because the API summary is unavailable.')}
                    </div>
                )}

                <section className="rounded-2xl border border-gray-200 bg-card shadow-sm dark:border-slate-700/60 dark:bg-dark-card">
                    <div className="px-4 pt-2 sm:px-6">
                        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                    </div>
                    <div className="rounded-b-2xl bg-gray-50/70 p-4 dark:bg-dark-background/30 sm:p-6">
                        {renderTabContent()}
                    </div>
                </section>
            </div>

            <LogInteractionModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onLog={handleLogInteraction} />
            <SendEmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSend={handleSendEmail} donorEmail={summary?.donor.email || editableDonor.email} />
        </>
    );
};

export default DonorDetailView;
