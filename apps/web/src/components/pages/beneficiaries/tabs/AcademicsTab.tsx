import React, { useState } from 'react';
import type { StudentProfile } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { GraduationCap, Check, X, TrendingUp } from 'lucide-react';
import Section from '../shared/Section';
import InfoRow from '../shared/InfoRow';
import EditableField from '../shared/EditableField';

/* ------------------------------------------------------------------ */
/* GPA visual card                                                     */
/* ------------------------------------------------------------------ */
const GpaCard: React.FC<{ gpa: number; label: string; progressLabel: string }> = ({ gpa, label, progressLabel }) => {
    const pct = Math.min((gpa / 4.0) * 100, 100);
    const color = gpa >= 3.5 ? 'text-emerald-600 dark:text-emerald-400' : gpa >= 2.5 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400';
    const barColor = gpa >= 3.5 ? 'bg-emerald-500' : gpa >= 2.5 ? 'bg-blue-500' : 'bg-amber-500';

    return (
        <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm dark:border-slate-700/70 dark:from-slate-800/50 dark:to-dark-card">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{gpa.toFixed(2)} <span className="text-sm font-medium text-gray-400">/ 4.0</span></p>
                </div>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{progressLabel}</p>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div className={`${barColor} h-3 rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
interface AcademicsTabProps {
    profile: StudentProfile;
    onUpdate?: (updated: Partial<StudentProfile>) => void;
}

const AcademicsTab: React.FC<AcademicsTabProps> = ({ profile, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const info = profile.academicInfo;
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        university: info?.university || '',
        field: info?.field || '',
        gpa: info?.gpa?.toString() || '',
    });

    if (!info) {
        return <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('beneficiaries.noData')}</p>;
    }

    const handleSave = () => {
        if (!onUpdate) return;
        onUpdate({
            ...profile,
            academicInfo: {
                ...info,
                university: form.university,
                field: form.field,
                gpa: form.gpa ? parseFloat(form.gpa) : info.gpa,
            },
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            university: info?.university || '',
            field: info?.field || '',
            gpa: info?.gpa?.toString() || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-5">
            <Section
                title={t('beneficiaries.tabs.academics')}
                icon={<GraduationCap size={18} />}
                onEdit={onUpdate && !isEditing ? () => setIsEditing(true) : undefined}
                editLabel={t('beneficiaries.actions.editAcademics')}
            >
                {isEditing ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableField label={t('beneficiaries.fields.university')} value={form.university} onChange={v => setForm(f => ({ ...f, university: v }))} />
                            <EditableField label={t('beneficiaries.fields.major')} value={form.field} onChange={v => setForm(f => ({ ...f, field: v }))} />
                            <InfoRow label={t('beneficiaries.fields.academicYear')} value={info.level?.[language] || '—'} />
                            <EditableField label={t('beneficiaries.fields.gpa')} value={form.gpa} onChange={v => setForm(f => ({ ...f, gpa: v }))} type="number" />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                                <Check size={14} /> {t('common.save')}
                            </button>
                            <button onClick={handleCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label={t('beneficiaries.fields.university')} value={info.university} />
                        <InfoRow label={t('beneficiaries.fields.major')} value={info.field} />
                        <InfoRow label={t('beneficiaries.fields.academicYear')} value={info.level?.[language]} />
                    </div>
                )}
            </Section>

            {/* GPA card */}
            {info.gpa !== undefined && (
                <GpaCard gpa={info.gpa} label={t('beneficiaries.fields.gpa')} progressLabel={t('beneficiaries.fields.gpaProgress')} />
            )}
        </div>
    );
};

export default AcademicsTab;
