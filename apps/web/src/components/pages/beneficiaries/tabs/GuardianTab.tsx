import React, { useState } from 'react';
import type { OrphanProfile } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { Users, Check, X, ShieldCheck } from 'lucide-react';
import Section from '../shared/Section';
import InfoRow from '../shared/InfoRow';
import EditableField from '../shared/EditableField';

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
interface GuardianTabProps {
    profile: OrphanProfile;
    onUpdate?: (updated: Partial<OrphanProfile>) => void;
}

const GuardianTab: React.FC<GuardianTabProps> = ({ profile, onUpdate }) => {
    const { t } = useLocalization(['common', 'beneficiaries']);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: profile.guardian?.name || '',
        relation: profile.guardian?.relation || '',
        phone: profile.guardian?.phone || '',
    });

    const handleSave = () => {
        if (!onUpdate) return;
        onUpdate({
            ...profile,
            guardian: { ...profile.guardian!, name: form.name, relation: form.relation, phone: form.phone },
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            name: profile.guardian?.name || '',
            relation: profile.guardian?.relation || '',
            phone: profile.guardian?.phone || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-5">
            {/* Guardian info */}
            {profile.guardian && (
                <Section
                    title={t('beneficiaries.sections.guardian')}
                    icon={<ShieldCheck size={18} />}
                    accent="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300"
                    onEdit={onUpdate && !isEditing ? () => setIsEditing(true) : undefined}
                    editLabel={t('beneficiaries.actions.editGuardian')}
                >
                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <EditableField label={t('beneficiaries.fields.guardianName')} value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                                <EditableField label={t('beneficiaries.fields.relation')} value={form.relation} onChange={v => setForm(f => ({ ...f, relation: v }))} />
                                <EditableField label={t('beneficiaries.fields.phone')} value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} type="tel" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InfoRow label={t('beneficiaries.fields.guardianName')} value={profile.guardian.name} />
                            <InfoRow label={t('beneficiaries.fields.relation')} value={profile.guardian.relation} />
                            {profile.guardian.phone && <InfoRow label={t('beneficiaries.fields.phone')} value={profile.guardian.phone} />}
                        </div>
                    )}
                </Section>
            )}

            {/* Family members */}
            {profile.familyMembers && profile.familyMembers.length > 0 && (
                <Section title={t('beneficiaries.sections.familyMembers')} icon={<Users size={18} />} accent="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300">
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                        <table className="w-full text-sm">
                            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-slate-800/80">
                                <tr>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.name')}</th>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.relation')}</th>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.age')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {profile.familyMembers.map((member, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-foreground dark:text-dark-foreground">{member.name}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{member.relation}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{member.age ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default GuardianTab;
