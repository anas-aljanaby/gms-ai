import React, { useState } from 'react';
import type { Beneficiary } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatDate, formatNumber } from '../../../../lib/utils';
import { Pencil, Check, X, User, Phone, MapPin, Mail, Award } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Section wrapper — matches donor module's <Section> pattern          */
/* ------------------------------------------------------------------ */
const Section: React.FC<{
    title: string;
    icon?: React.ReactNode;
    accent?: string;
    onEdit?: () => void;
    editLabel?: string;
    children: React.ReactNode;
}> = ({ title, icon, accent = 'bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary', onEdit, editLabel, children }) => (
    <section className="min-w-0 rounded-xl border border-gray-200/80 bg-card p-5 shadow-sm dark:border-slate-700/70 dark:bg-dark-card">
        <div className="mb-4 flex min-w-0 items-center justify-between">
            <div className="flex items-center gap-3">
                {icon && <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${accent}`}>{icon}</div>}
                <h3 className="truncate text-base font-bold text-foreground dark:text-dark-foreground">{title}</h3>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-dark-foreground"
                    aria-label={editLabel}
                    title={editLabel}
                >
                    <Pencil size={14} />
                </button>
            )}
        </div>
        {children}
    </section>
);

/* ------------------------------------------------------------------ */
/* Info row                                                            */
/* ------------------------------------------------------------------ */
const InfoRow: React.FC<{ label: string; value?: string | number | null; muted?: boolean }> = ({ label, value, muted }) => (
    <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`mt-1 break-words text-sm font-bold leading-6 ${muted ? 'text-gray-400 dark:text-gray-500' : 'text-foreground dark:text-dark-foreground'}`}>
            {value ?? '—'}
        </div>
    </div>
);

/* ------------------------------------------------------------------ */
/* Editable input                                                      */
/* ------------------------------------------------------------------ */
const EditableInput: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}> = ({ label, value, onChange, type = 'text' }) => (
    <label className="block min-w-0">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</span>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
        />
    </label>
);

/* ------------------------------------------------------------------ */
/* Main OverviewTab                                                    */
/* ------------------------------------------------------------------ */
interface OverviewTabProps {
    beneficiary: Beneficiary;
    onUpdate?: (updated: Beneficiary) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ beneficiary, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const p = beneficiary.profile;

    // ---- Contact editing state ----
    const [isContactEditing, setIsContactEditing] = useState(false);
    const [contactForm, setContactForm] = useState({
        email: p.contact?.email || '',
        phone: p.contact?.phone || '',
        address: p.contact?.address || '',
    });

    // ---- Details editing state ----
    const [isDetailsEditing, setIsDetailsEditing] = useState(false);
    const [detailsForm, setDetailsForm] = useState(() => getDetailsFormDefaults(beneficiary));

    const handleContactSave = () => {
        if (!onUpdate) return;
        const updated: Beneficiary = {
            ...beneficiary,
            profile: {
                ...beneficiary.profile,
                contact: {
                    ...beneficiary.profile.contact,
                    email: contactForm.email,
                    phone: contactForm.phone,
                    address: contactForm.address,
                },
            } as typeof beneficiary.profile,
        };
        onUpdate(updated);
        setIsContactEditing(false);
    };

    const handleDetailsSave = () => {
        if (!onUpdate) return;
        const updated = applyDetailsForm(beneficiary, detailsForm);
        onUpdate(updated);
        setIsDetailsEditing(false);
    };

    const handleContactCancel = () => {
        setContactForm({
            email: p.contact?.email || '',
            phone: p.contact?.phone || '',
            address: p.contact?.address || '',
        });
        setIsContactEditing(false);
    };

    const handleDetailsCancel = () => {
        setDetailsForm(getDetailsFormDefaults(beneficiary));
        setIsDetailsEditing(false);
    };

    /* ---------- Contact Section ---------- */
    const renderContactSection = () => {
        if (isContactEditing) {
            return (
                <Section title={t('beneficiaries.sections.contactInfo')} icon={<Phone size={18} />}>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableInput label={t('beneficiaries.fields.email')} value={contactForm.email} onChange={v => setContactForm(f => ({ ...f, email: v }))} type="email" />
                            <EditableInput label={t('beneficiaries.fields.phone')} value={contactForm.phone} onChange={v => setContactForm(f => ({ ...f, phone: v }))} type="tel" />
                        </div>
                        <EditableInput label={t('beneficiaries.fields.address')} value={contactForm.address} onChange={v => setContactForm(f => ({ ...f, address: v }))} />
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
                    <InfoRow label={t('beneficiaries.fields.id')} value={beneficiary.id} muted />
                    <InfoRow label={t('beneficiaries.fields.country')} value={beneficiary.country} />
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

    /* ---------- Details Section ---------- */
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

    /* ---------- Type-specific read-only fields ---------- */
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
                        <InfoRow label={t('beneficiaries.fields.academicYear')} value={p.academicInfo?.level?.[language]} />
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

    /* ---------- Type-specific editable fields ---------- */
    const renderEditableDetailsFields = () => {
        const set = (key: string, val: string) => setDetailsForm(f => ({ ...f, [key]: val }));

        switch (p.type) {
            case 'student':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        <EditableInput label={t('beneficiaries.fields.gender')} value={detailsForm.gender || ''} onChange={v => set('gender', v)} />
                        <EditableInput label={t('beneficiaries.fields.university')} value={detailsForm.university || ''} onChange={v => set('university', v)} />
                        <EditableInput label={t('beneficiaries.fields.major')} value={detailsForm.field || ''} onChange={v => set('field', v)} />
                        <EditableInput label={t('beneficiaries.fields.gpa')} value={detailsForm.gpa || ''} onChange={v => set('gpa', v)} type="number" />
                    </>
                );
            case 'orphan':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        <EditableInput label={t('beneficiaries.fields.gender')} value={detailsForm.gender || ''} onChange={v => set('gender', v)} />
                        <EditableInput label={t('beneficiaries.fields.school')} value={detailsForm.school || ''} onChange={v => set('school', v)} />
                        <EditableInput label={t('beneficiaries.fields.grade')} value={detailsForm.grade || ''} onChange={v => set('grade', v)} />
                        <EditableInput label={t('beneficiaries.fields.attendance')} value={detailsForm.attendance || ''} onChange={v => set('attendance', v)} />
                    </>
                );
            case 'hafiz':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.dob')} value={detailsForm.dob || ''} onChange={v => set('dob', v)} type="date" />
                        <EditableInput label={t('beneficiaries.fields.gender')} value={detailsForm.gender || ''} onChange={v => set('gender', v)} />
                        <EditableInput label={t('beneficiaries.fields.circle')} value={detailsForm.circle || ''} onChange={v => set('circle', v)} />
                        <EditableInput label={t('beneficiaries.fields.juzCompleted')} value={detailsForm.juzCompleted || ''} onChange={v => set('juzCompleted', v)} type="number" />
                    </>
                );
            case 'family':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.headOfHousehold')} value={detailsForm.headOfHousehold || ''} onChange={v => set('headOfHousehold', v)} />
                        <EditableInput label={t('beneficiaries.fields.memberCount')} value={detailsForm.memberCount || ''} onChange={v => set('memberCount', v)} type="number" />
                        <EditableInput label={t('beneficiaries.fields.monthlyIncome')} value={detailsForm.monthlyIncome || ''} onChange={v => set('monthlyIncome', v)} />
                        <EditableInput label={t('beneficiaries.fields.housingType')} value={detailsForm.housingType || ''} onChange={v => set('housingType', v)} />
                    </>
                );
            case 'institution':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.directorName')} value={detailsForm.directorName || ''} onChange={v => set('directorName', v)} />
                        <EditableInput label={t('beneficiaries.fields.capacity')} value={detailsForm.capacity || ''} onChange={v => set('capacity', v)} type="number" />
                        <EditableInput label={t('beneficiaries.fields.institutionType')} value={detailsForm.institutionType || ''} onChange={v => set('institutionType', v)} />
                    </>
                );
            case 'community':
                return (
                    <>
                        <EditableInput label={t('beneficiaries.fields.populationEstimate')} value={detailsForm.populationEstimate || ''} onChange={v => set('populationEstimate', v)} type="number" />
                        <EditableInput label={t('beneficiaries.fields.fieldOfficer')} value={detailsForm.fieldOfficer || ''} onChange={v => set('fieldOfficer', v)} />
                        <EditableInput label={t('beneficiaries.fields.areaType')} value={detailsForm.areaType || ''} onChange={v => set('areaType', v)} />
                    </>
                );
            default:
                return null;
        }
    };

    /* ---------- Milestones ---------- */
    const renderMilestones = () => {
        if (beneficiary.milestones.length === 0) return null;

        return (
            <Section title={t('beneficiaries.sections.milestones')} icon={<Award size={18} />} accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
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
                                        {m.title[language] || m.title.en}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{cfg.label}</p>
                                </div>
                                {m.date && (
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                                        {formatDate(m.date, language, { year: 'numeric', month: 'short' })}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Section>
        );
    };

    return (
        <div className="space-y-5">
            {renderContactSection()}
            {renderDetailsSection()}
            {renderMilestones()}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Helpers — extract form defaults & apply form back                   */
/* ------------------------------------------------------------------ */
function getDetailsFormDefaults(b: Beneficiary): Record<string, string> {
    const p = b.profile;
    switch (p.type) {
        case 'student':
            return {
                dob: p.dob || '', gender: p.gender || '',
                university: p.academicInfo?.university || '', field: p.academicInfo?.field || '',
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
                circle: form.circle || p.memorization?.circle,
                juzCompleted: form.juzCompleted ? parseInt(form.juzCompleted) : p.memorization?.juzCompleted,
            };
            break;
        case 'family':
            p.headOfHousehold = form.headOfHousehold || p.headOfHousehold;
            p.memberCount = form.memberCount ? parseInt(form.memberCount) : p.memberCount;
            p.monthlyIncome = form.monthlyIncome || p.monthlyIncome;
            p.housingType = form.housingType || p.housingType;
            break;
        case 'institution':
            p.directorName = form.directorName || p.directorName;
            p.capacity = form.capacity ? parseInt(form.capacity) : p.capacity;
            p.institutionType = form.institutionType || p.institutionType;
            break;
        case 'community':
            p.populationEstimate = form.populationEstimate ? parseInt(form.populationEstimate) : p.populationEstimate;
            p.fieldOfficer = form.fieldOfficer || p.fieldOfficer;
            p.areaType = form.areaType || p.areaType;
            break;
    }

    return { ...b, profile: p };
}

export default OverviewTab;
