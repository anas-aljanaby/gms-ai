import React, { useEffect, useState } from 'react';
import type { Beneficiary, Milestone, ProgramProject } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useToast } from '../../../../hooks/useToast';
import { formatDate, formatNumber } from '../../../../lib/utils';
import { Check, X, User, Phone, Award, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import Section from '../shared/Section';
import InfoRow from '../shared/InfoRow';
import EditableField from '../shared/EditableField';
import CountryCombobox from '../../../common/CountryCombobox';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { getCountryDisplayName } from '../../../../lib/countryOptions';

interface OverviewTabProps {
    beneficiary: Beneficiary;
    onUpdate?: (updated: Beneficiary) => void;
    // TODO: Replace with real API when projects module is activated
    projects?: ProgramProject[];
    existingCountries?: string[];
}

type MilestoneFormState = {
    titleEn: string;
    titleAr: string;
    status: Milestone['status'];
    date: string;
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

const emptyMilestoneForm = (): MilestoneFormState => ({
    titleEn: '',
    titleAr: '',
    status: 'pending',
    date: '',
});

const milestoneToForm = (m: Milestone): MilestoneFormState => ({
    titleEn: m.title.en || '',
    titleAr: m.title.ar || '',
    status: m.status,
    date: m.date || '',
});

const OverviewTab: React.FC<OverviewTabProps> = ({ beneficiary, onUpdate, projects = [], existingCountries = [] }) => {
    const { t, language, pickLocalized } = useLocalization(['common', 'beneficiaries']);
    const toast = useToast();
    const p = beneficiary.profile;

    const [isContactEditing, setIsContactEditing] = useState(false);
    const [contactForm, setContactForm] = useState(() => ({
        email: p.contact?.email || '',
        phone: p.contact?.phone || '',
        address: p.contact?.address || '',
        country: beneficiary.country || '',
        projectId: beneficiary.projectId || '',
    }));

    const [isDetailsEditing, setIsDetailsEditing] = useState(false);
    const [detailsForm, setDetailsForm] = useState(() => getDetailsFormDefaults(beneficiary));

    const [milestoneMode, setMilestoneMode] = useState<'none' | 'add' | 'edit'>('none');
    const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
    const [milestoneForm, setMilestoneForm] = useState<MilestoneFormState>(emptyMilestoneForm);
    const [milestoneToRemove, setMilestoneToRemove] = useState<Milestone | null>(null);

    useEffect(() => {
        if (!isContactEditing) {
            setContactForm({
                email: p.contact?.email || '',
                phone: p.contact?.phone || '',
                address: p.contact?.address || '',
                country: beneficiary.country || '',
                projectId: beneficiary.projectId || '',
            });
        }
    }, [beneficiary, p.contact, isContactEditing]);

    useEffect(() => {
        if (!isDetailsEditing) {
            setDetailsForm(getDetailsFormDefaults(beneficiary));
        }
    }, [beneficiary, isDetailsEditing]);

    const validateEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateDetailsForm = (): boolean => {
        if (p.type === 'student' && detailsForm.gpa) {
            const gpa = parseFloat(detailsForm.gpa);
            if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
                toast.showError(t('beneficiaries.validation.invalidGpa'));
                return false;
            }
        }
        if (p.type === 'hafiz' && detailsForm.juzCompleted) {
            const juz = parseInt(detailsForm.juzCompleted, 10);
            if (Number.isNaN(juz) || juz < 0 || juz > 30) {
                toast.showError(t('beneficiaries.validation.invalidJuz'));
                return false;
            }
        }
        return true;
    };

    const handleContactSave = () => {
        if (!onUpdate) return;
        if (!validateEmail(contactForm.email)) {
            toast.showError(t('beneficiaries.validation.invalidEmail'));
            return;
        }

        onUpdate({
            ...beneficiary,
            country: contactForm.country.trim(),
            projectId: contactForm.projectId || undefined,
            profile: {
                ...beneficiary.profile,
                contact: {
                    ...beneficiary.profile.contact,
                    email: contactForm.email,
                    phone: contactForm.phone,
                    address: contactForm.address,
                },
            } as typeof beneficiary.profile,
        });
        setIsContactEditing(false);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleDetailsSave = () => {
        if (!onUpdate || !validateDetailsForm()) return;
        onUpdate(applyDetailsForm(beneficiary, detailsForm));
        setIsDetailsEditing(false);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleContactCancel = () => {
        setContactForm({
            email: p.contact?.email || '',
            phone: p.contact?.phone || '',
            address: p.contact?.address || '',
            country: beneficiary.country || '',
            projectId: beneficiary.projectId || '',
        });
        setIsContactEditing(false);
    };

    const handleDetailsCancel = () => {
        setDetailsForm(getDetailsFormDefaults(beneficiary));
        setIsDetailsEditing(false);
    };

    const handleMilestoneSave = () => {
        if (!onUpdate || !milestoneForm.titleEn.trim()) return;

        const milestone: Milestone = {
            id: editingMilestoneId || `m-${Date.now()}`,
            title: { en: milestoneForm.titleEn, ar: milestoneForm.titleAr || milestoneForm.titleEn },
            status: milestoneForm.status,
            date: milestoneForm.date || undefined,
        };

        const milestones =
            milestoneMode === 'edit' && editingMilestoneId
                ? beneficiary.milestones.map((m) => (m.id === editingMilestoneId ? milestone : m))
                : [milestone, ...beneficiary.milestones];

        onUpdate({ ...beneficiary, milestones });
        setMilestoneMode('none');
        setEditingMilestoneId(null);
        setMilestoneForm(emptyMilestoneForm());
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleMilestoneCancel = () => {
        setMilestoneMode('none');
        setEditingMilestoneId(null);
        setMilestoneForm(emptyMilestoneForm());
    };

    const startEditMilestone = (m: Milestone) => {
        setMilestoneMode('edit');
        setEditingMilestoneId(m.id);
        setMilestoneForm(milestoneToForm(m));
    };

    const confirmRemoveMilestone = () => {
        if (!onUpdate || !milestoneToRemove) return;
        onUpdate({
            ...beneficiary,
            milestones: beneficiary.milestones.filter((m) => m.id !== milestoneToRemove.id),
        });
        setMilestoneToRemove(null);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const linkedProject = projects.find((proj) => proj.id === beneficiary.projectId);
    const projectName = linkedProject?.name ? pickLocalized(linkedProject.name) : undefined;
    const localizedCountry = getCountryDisplayName(beneficiary.country, language === 'ar' ? 'ar' : 'en');

    const renderGenderField = (value: string, onChange: (v: string) => void) => (
        <label className="block min-w-0">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.gender')}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
            >
                <option value="">—</option>
                {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>{t(`beneficiaries.genderOptions.${option.toLowerCase()}`, option)}</option>
                ))}
            </select>
        </label>
    );

    const renderContactSection = () => {
        if (isContactEditing) {
            return (
                <Section title={t('beneficiaries.sections.contactInfo')} icon={<Phone size={18} />}>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableField label={t('beneficiaries.fields.email')} value={contactForm.email} onChange={v => setContactForm(f => ({ ...f, email: v }))} type="email" />
                            <EditableField label={t('beneficiaries.fields.phone')} value={contactForm.phone} onChange={v => setContactForm(f => ({ ...f, phone: v }))} type="tel" />
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.country')}</span>
                                <CountryCombobox
                                    value={contactForm.country}
                                    onChange={(v) => setContactForm((f) => ({ ...f, country: v }))}
                                    existingCountries={existingCountries}
                                    placeholder={t('common.countryField.placeholder')}
                                    noResultsText={t('common.countryField.noResults')}
                                    className="mt-1"
                                />
                            </label>
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.project')}</span>
                                <select
                                    value={contactForm.projectId}
                                    onChange={(e) => setContactForm(f => ({ ...f, projectId: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                >
                                    <option value="">{t('beneficiaries.fields.noProject')}</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>{pickLocalized(proj.name)}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <EditableField label={t('beneficiaries.fields.address')} value={contactForm.address} onChange={v => setContactForm(f => ({ ...f, address: v }))} />
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button onClick={handleContactSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                                <Check size={14} /> {t('common.save')}
                            </button>
                            <button onClick={handleContactCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </Section>
            );
        }

        return (
            <Section
                title={t('beneficiaries.sections.contactInfo')}
                icon={<Phone size={18} />}
                onEdit={onUpdate ? () => setIsContactEditing(true) : undefined}
                editLabel={t('beneficiaries.actions.editContact')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoRow label={t('beneficiaries.fields.country')} value={localizedCountry} />
                    <InfoRow label={t('beneficiaries.fields.project')} value={projectName} />
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.email')}</p>
                        <div className="mt-1 text-sm font-bold leading-6">
                            {p.contact?.email ? (
                                <a href={`mailto:${p.contact.email}`} className="text-primary hover:underline dark:text-secondary">{p.contact.email}</a>
                            ) : '—'}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.phone')}</p>
                        <div className="mt-1 text-sm font-bold leading-6">
                            {p.contact?.phone ? (
                                <a href={`tel:${p.contact.phone}`} className="text-primary hover:underline dark:text-secondary">{p.contact.phone}</a>
                            ) : '—'}
                        </div>
                    </div>
                    <InfoRow label={t('beneficiaries.fields.address')} value={p.contact?.address} />
                </div>
            </Section>
        );
    };

    const renderDetailsSection = () => {
        if (isDetailsEditing) {
            return (
                <Section title={t('beneficiaries.sections.details')} icon={<User size={18} />} accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {renderEditableDetailsFields()}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button onClick={handleDetailsSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                                <Check size={14} /> {t('common.save')}
                            </button>
                            <button onClick={handleDetailsCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </Section>
            );
        }

        return (
            <Section
                title={t('beneficiaries.sections.details')}
                icon={<User size={18} />}
                accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                onEdit={onUpdate ? () => setIsDetailsEditing(true) : undefined}
                editLabel={t('beneficiaries.actions.editDetails')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderTypeSpecificFields()}
                </div>
            </Section>
        );
    };

    const renderTypeSpecificFields = () => {
        switch (p.type) {
            case 'student':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.dob')} value={p.dob} />
                        <InfoRow label={t('beneficiaries.fields.gender')} value={p.gender} />
                        <InfoRow label={t('beneficiaries.fields.university')} value={p.academicInfo?.university} />
                        <InfoRow label={t('beneficiaries.fields.major')} value={p.academicInfo?.field} />
                        <InfoRow label={t('beneficiaries.fields.gpa')} value={p.academicInfo?.gpa} />
                        <InfoRow label={t('beneficiaries.fields.academicYear')} value={p.academicInfo?.level ? pickLocalized(p.academicInfo.level) : undefined} />
                    </>
                );
            case 'orphan':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.dob')} value={p.dob} />
                        <InfoRow label={t('beneficiaries.fields.gender')} value={p.gender} />
                        <InfoRow label={t('beneficiaries.fields.school')} value={p.academicInfo?.school} />
                        <InfoRow label={t('beneficiaries.fields.grade')} value={p.academicInfo?.grade} />
                        <InfoRow label={t('beneficiaries.fields.attendance')} value={p.academicInfo?.attendance} />
                    </>
                );
            case 'hafiz':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.dob')} value={p.dob} />
                        <InfoRow label={t('beneficiaries.fields.gender')} value={p.gender} />
                        <InfoRow label={t('beneficiaries.fields.memorizationLevel')} value={p.memorization?.level ? pickLocalized(p.memorization.level) : undefined} />
                        <InfoRow label={t('beneficiaries.fields.circle')} value={p.memorization?.circle} />
                        <InfoRow label={t('beneficiaries.fields.juzCompleted')} value={p.memorization?.juzCompleted ? `${p.memorization.juzCompleted} / 30` : null} />
                    </>
                );
            case 'family':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.headOfHousehold')} value={p.headOfHousehold} />
                        <InfoRow label={t('beneficiaries.fields.memberCount')} value={p.memberCount} />
                        <InfoRow label={t('beneficiaries.fields.monthlyIncome')} value={p.monthlyIncome} />
                        <InfoRow label={t('beneficiaries.fields.housingType')} value={p.housingType} />
                    </>
                );
            case 'institution':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.directorName')} value={p.directorName} />
                        <InfoRow label={t('beneficiaries.fields.capacity')} value={p.capacity} />
                        <InfoRow label={t('beneficiaries.fields.institutionType')} value={p.institutionType} />
                    </>
                );
            case 'community':
                return (
                    <>
                        <InfoRow label={t('beneficiaries.fields.populationEstimate')} value={p.populationEstimate != null ? formatNumber(p.populationEstimate, language) : undefined} />
                        <InfoRow label={t('beneficiaries.fields.fieldOfficer')} value={p.fieldOfficer} />
                        <InfoRow label={t('beneficiaries.fields.areaType')} value={p.areaType} />
                    </>
                );
            default:
                return null;
        }
    };

    const renderEditableDetailsFields = () => {
        const set = (key: string, val: string) => setDetailsForm(f => ({ ...f, [key]: val }));

        switch (p.type) {
            case 'student':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        {renderGenderField(detailsForm.gender || '', v => set('gender', v))}
                        <EditableField label={t('beneficiaries.fields.university')} value={detailsForm.university || ''} onChange={v => set('university', v)} />
                        <EditableField label={t('beneficiaries.fields.major')} value={detailsForm.field || ''} onChange={v => set('field', v)} />
                        <EditableField label={t('beneficiaries.fields.academicYearEn')} value={detailsForm.levelEn || ''} onChange={v => set('levelEn', v)} />
                        <EditableField label={t('beneficiaries.fields.academicYearAr')} value={detailsForm.levelAr || ''} onChange={v => set('levelAr', v)} dir="rtl" />
                        <EditableField label={t('beneficiaries.fields.gpa')} value={detailsForm.gpa || ''} onChange={v => set('gpa', v)} type="number" />
                    </>
                );
            case 'orphan':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        {renderGenderField(detailsForm.gender || '', v => set('gender', v))}
                        <EditableField label={t('beneficiaries.fields.school')} value={detailsForm.school || ''} onChange={v => set('school', v)} />
                        <EditableField label={t('beneficiaries.fields.grade')} value={detailsForm.grade || ''} onChange={v => set('grade', v)} />
                        <EditableField label={t('beneficiaries.fields.attendance')} value={detailsForm.attendance || ''} onChange={v => set('attendance', v)} />
                    </>
                );
            case 'hafiz':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        {renderGenderField(detailsForm.gender || '', v => set('gender', v))}
                        <EditableField label={t('beneficiaries.fields.memorizationLevelEn')} value={detailsForm.levelEn || ''} onChange={v => set('levelEn', v)} />
                        <EditableField label={t('beneficiaries.fields.memorizationLevelAr')} value={detailsForm.levelAr || ''} onChange={v => set('levelAr', v)} dir="rtl" />
                        <EditableField label={t('beneficiaries.fields.circle')} value={detailsForm.circle || ''} onChange={v => set('circle', v)} />
                        <EditableField label={t('beneficiaries.fields.juzCompleted')} value={detailsForm.juzCompleted || ''} onChange={v => set('juzCompleted', v)} type="number" />
                    </>
                );
            case 'family':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.headOfHousehold')} value={detailsForm.headOfHousehold || ''} onChange={v => set('headOfHousehold', v)} />
                        <EditableField label={t('beneficiaries.fields.memberCount')} value={detailsForm.memberCount || ''} onChange={v => set('memberCount', v)} type="number" />
                        <EditableField label={t('beneficiaries.fields.monthlyIncome')} value={detailsForm.monthlyIncome || ''} onChange={v => set('monthlyIncome', v)} />
                        <EditableField label={t('beneficiaries.fields.housingType')} value={detailsForm.housingType || ''} onChange={v => set('housingType', v)} />
                    </>
                );
            case 'institution':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.directorName')} value={detailsForm.directorName || ''} onChange={v => set('directorName', v)} />
                        <EditableField label={t('beneficiaries.fields.capacity')} value={detailsForm.capacity || ''} onChange={v => set('capacity', v)} type="number" />
                        <EditableField label={t('beneficiaries.fields.institutionType')} value={detailsForm.institutionType || ''} onChange={v => set('institutionType', v)} />
                    </>
                );
            case 'community':
                return (
                    <>
                        <EditableField label={t('beneficiaries.fields.populationEstimate')} value={detailsForm.populationEstimate || ''} onChange={v => set('populationEstimate', v)} type="number" />
                        <EditableField label={t('beneficiaries.fields.fieldOfficer')} value={detailsForm.fieldOfficer || ''} onChange={v => set('fieldOfficer', v)} />
                        <EditableField label={t('beneficiaries.fields.areaType')} value={detailsForm.areaType || ''} onChange={v => set('areaType', v)} />
                    </>
                );
            default:
                return null;
        }
    };

    const renderMilestones = () => (
        <Section title={t('beneficiaries.sections.milestones')} icon={<Award size={18} />} accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
            {onUpdate && milestoneMode === 'none' && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => {
                            setMilestoneMode('add');
                            setMilestoneForm(emptyMilestoneForm());
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark transition-colors"
                    >
                        <PlusCircle size={14} /> {t('beneficiaries.milestones.add')}
                    </button>
                </div>
            )}

            {milestoneMode !== 'none' && (
                <div className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <EditableField label={t('beneficiaries.milestones.titleEn')} value={milestoneForm.titleEn} onChange={v => setMilestoneForm(f => ({ ...f, titleEn: v }))} />
                        <EditableField label={t('beneficiaries.milestones.titleAr')} value={milestoneForm.titleAr} onChange={v => setMilestoneForm(f => ({ ...f, titleAr: v }))} dir="rtl" />
                        <label className="block min-w-0">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.milestones.status')}</span>
                            <select
                                value={milestoneForm.status}
                                onChange={(e) => setMilestoneForm(f => ({ ...f, status: e.target.value as Milestone['status'] }))}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                            >
                                {(['achieved', 'in-progress', 'pending'] as const).map((status) => (
                                    <option key={status} value={status}>{t(`beneficiaries.milestoneStatus.${status}`)}</option>
                                ))}
                            </select>
                        </label>
                        <EditableField label={t('beneficiaries.milestones.date')} value={milestoneForm.date} onChange={v => setMilestoneForm(f => ({ ...f, date: v }))} type="date" />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={handleMilestoneSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                            <Check size={14} /> {t('common.save')}
                        </button>
                        <button onClick={handleMilestoneCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                            <X size={14} /> {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}

            {beneficiary.milestones.length === 0 ? (
                <div className="py-6 text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('beneficiaries.milestones.empty')}</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('beneficiaries.milestones.emptyDesc')}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {beneficiary.milestones.map(m => {
                        const cfg = {
                            achieved: { dot: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/10', label: t('beneficiaries.milestoneStatus.achieved') },
                            'in-progress': { dot: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10', label: t('beneficiaries.milestoneStatus.in-progress') },
                            pending: { dot: 'bg-gray-300 dark:bg-slate-600', bg: 'bg-gray-50 dark:bg-slate-800/30', label: t('beneficiaries.milestoneStatus.pending') },
                        }[m.status];

                        return (
                            <div key={m.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${cfg.bg} transition-colors`}>
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground dark:text-dark-foreground">
                                        {pickLocalized(m.title)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{cfg.label}</p>
                                </div>
                                {m.date && (
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                                        {formatDate(m.date, language, { year: 'numeric', month: 'short' })}
                                    </span>
                                )}
                                {onUpdate && milestoneMode === 'none' && (
                                    <div className="flex flex-shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => startEditMilestone(m)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white/80 dark:hover:bg-slate-700"
                                            aria-label={t('beneficiaries.milestones.edit')}
                                        >
                                            <Pencil size={13} />
                                        </button>
                                        <button
                                            onClick={() => setMilestoneToRemove(m)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label={t('beneficiaries.milestones.remove')}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Section>
    );

    return (
        <div className="space-y-5">
            {renderContactSection()}
            {renderDetailsSection()}
            {renderMilestones()}
            <ConfirmationModal
                isOpen={!!milestoneToRemove}
                onClose={() => setMilestoneToRemove(null)}
                onConfirm={confirmRemoveMilestone}
                title={t('beneficiaries.milestones.remove')}
                message={t('beneficiaries.milestones.removeConfirm')}
            />
        </div>
    );
};

function getDetailsFormDefaults(b: Beneficiary): Record<string, string> {
    const p = b.profile;
    switch (p.type) {
        case 'student':
            return {
                dob: p.dob || '', gender: p.gender || '',
                university: p.academicInfo?.university || '', field: p.academicInfo?.field || '',
                levelEn: p.academicInfo?.level?.en || '', levelAr: p.academicInfo?.level?.ar || '',
                gpa: p.academicInfo?.gpa?.toString() || '',
            };
        case 'orphan':
            return {
                dob: p.dob || '', gender: p.gender || '',
                school: p.academicInfo?.school || '', grade: p.academicInfo?.grade || '',
                attendance: p.academicInfo?.attendance || '',
            };
        case 'hafiz':
            return {
                dob: p.dob || '', gender: p.gender || '',
                levelEn: p.memorization?.level?.en || '', levelAr: p.memorization?.level?.ar || '',
                circle: p.memorization?.circle || '',
                juzCompleted: p.memorization?.juzCompleted?.toString() || '',
            };
        case 'family':
            return {
                headOfHousehold: p.headOfHousehold || '',
                memberCount: p.memberCount?.toString() || '',
                monthlyIncome: p.monthlyIncome || '',
                housingType: p.housingType || '',
            };
        case 'institution':
            return {
                directorName: p.directorName || '',
                capacity: p.capacity?.toString() || '',
                institutionType: p.institutionType || '',
            };
        case 'community':
            return {
                populationEstimate: p.populationEstimate?.toString() || '',
                fieldOfficer: p.fieldOfficer || '',
                areaType: p.areaType || '',
            };
        default:
            return {};
    }
}

function applyDetailsForm(b: Beneficiary, form: Record<string, string>): Beneficiary {
    const p = { ...b.profile } as any;

    switch (p.type) {
        case 'student':
            p.dob = form.dob || p.dob;
            p.gender = form.gender || p.gender;
            p.academicInfo = {
                ...p.academicInfo,
                university: form.university || p.academicInfo?.university,
                field: form.field || p.academicInfo?.field,
                level: { en: form.levelEn, ar: form.levelAr || form.levelEn },
                gpa: form.gpa ? parseFloat(form.gpa) : p.academicInfo?.gpa,
            };
            break;
        case 'orphan':
            p.dob = form.dob || p.dob;
            p.gender = form.gender || p.gender;
            p.academicInfo = {
                ...p.academicInfo,
                school: form.school || p.academicInfo?.school,
                grade: form.grade || p.academicInfo?.grade,
                attendance: form.attendance || p.academicInfo?.attendance,
            };
            break;
        case 'hafiz':
            p.dob = form.dob || p.dob;
            p.gender = form.gender || p.gender;
            p.memorization = {
                ...p.memorization,
                level: { en: form.levelEn, ar: form.levelAr || form.levelEn },
                circle: form.circle || p.memorization?.circle,
                juzCompleted: form.juzCompleted ? parseInt(form.juzCompleted, 10) : p.memorization?.juzCompleted,
            };
            break;
        case 'family':
            p.headOfHousehold = form.headOfHousehold || p.headOfHousehold;
            p.memberCount = form.memberCount ? parseInt(form.memberCount, 10) : p.memberCount;
            p.monthlyIncome = form.monthlyIncome || p.monthlyIncome;
            p.housingType = form.housingType || p.housingType;
            break;
        case 'institution':
            p.directorName = form.directorName || p.directorName;
            p.capacity = form.capacity ? parseInt(form.capacity, 10) : p.capacity;
            p.institutionType = form.institutionType || p.institutionType;
            break;
        case 'community':
            p.populationEstimate = form.populationEstimate ? parseInt(form.populationEstimate, 10) : p.populationEstimate;
            p.fieldOfficer = form.fieldOfficer || p.fieldOfficer;
            p.areaType = form.areaType || p.areaType;
            break;
    }

    return { ...b, profile: p };
}

export default OverviewTab;
