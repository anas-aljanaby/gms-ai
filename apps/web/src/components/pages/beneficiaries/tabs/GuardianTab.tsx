import React, { useEffect, useState } from 'react';
import type { OrphanProfile } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useToast } from '../../../../hooks/useToast';
import { Users, Check, X, ShieldCheck, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import Section from '../shared/Section';
import InfoRow from '../shared/InfoRow';
import EditableField from '../shared/EditableField';
import ConfirmationModal from '../../../common/ConfirmationModal';

type FamilyMember = NonNullable<OrphanProfile['familyMembers']>[number];

type MemberFormState = { name: string; relation: string; age: string };

interface GuardianTabProps {
    profile: OrphanProfile;
    onUpdate?: (updated: Partial<OrphanProfile>) => void;
}

const emptyGuardianForm = () => ({ name: '', relation: '', phone: '' });

const guardianFormFromProfile = (profile: OrphanProfile) => ({
    name: profile.guardian?.name || '',
    relation: profile.guardian?.relation || '',
    phone: profile.guardian?.phone || '',
});

const emptyMemberForm = (): MemberFormState => ({ name: '', relation: '', age: '' });

const GuardianTab: React.FC<GuardianTabProps> = ({ profile, onUpdate }) => {
    const { t } = useLocalization(['common', 'beneficiaries']);
    const toast = useToast();

    const [isGuardianEditing, setIsGuardianEditing] = useState(false);
    const [guardianForm, setGuardianForm] = useState(() => guardianFormFromProfile(profile));

    const [memberMode, setMemberMode] = useState<'none' | 'add' | 'edit'>('none');
    const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
    const [memberForm, setMemberForm] = useState<MemberFormState>(emptyMemberForm());
    const [memberToRemoveIndex, setMemberToRemoveIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!isGuardianEditing) {
            setGuardianForm(guardianFormFromProfile(profile));
        }
    }, [profile, isGuardianEditing]);

    const familyMembers = profile.familyMembers || [];

    const handleGuardianSave = () => {
        if (!onUpdate) return;
        if (!guardianForm.name.trim()) {
            toast.showError(t('beneficiaries.validation.guardianNameRequired'));
            return;
        }

        onUpdate({
            ...profile,
            guardian: {
                name: guardianForm.name.trim(),
                relation: guardianForm.relation.trim(),
                phone: guardianForm.phone.trim() || undefined,
            },
        });
        setIsGuardianEditing(false);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleGuardianCancel = () => {
        setGuardianForm(guardianFormFromProfile(profile));
        setIsGuardianEditing(false);
    };

    const handleMemberSave = () => {
        if (!onUpdate || !memberForm.name.trim()) {
            toast.showError(t('beneficiaries.validation.memberNameRequired'));
            return;
        }

        const member: FamilyMember = {
            name: memberForm.name.trim(),
            relation: memberForm.relation.trim(),
            age: memberForm.age ? Number(memberForm.age) : undefined,
        };

        let nextMembers: FamilyMember[];
        if (memberMode === 'edit' && editingMemberIndex != null) {
            nextMembers = familyMembers.map((m, i) => (i === editingMemberIndex ? member : m));
        } else {
            nextMembers = [...familyMembers, member];
        }

        onUpdate({ ...profile, familyMembers: nextMembers });
        setMemberMode('none');
        setEditingMemberIndex(null);
        setMemberForm(emptyMemberForm());
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleMemberCancel = () => {
        setMemberMode('none');
        setEditingMemberIndex(null);
        setMemberForm(emptyMemberForm());
    };

    const startEditMember = (index: number) => {
        const member = familyMembers[index];
        setMemberForm({
            name: member.name,
            relation: member.relation,
            age: member.age?.toString() || '',
        });
        setEditingMemberIndex(index);
        setMemberMode('edit');
    };

    const confirmRemoveMember = () => {
        if (!onUpdate || memberToRemoveIndex == null) return;
        onUpdate({
            ...profile,
            familyMembers: familyMembers.filter((_, i) => i !== memberToRemoveIndex),
        });
        setMemberToRemoveIndex(null);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const renderGuardianSection = () => {
        if (!profile.guardian && !isGuardianEditing) {
            return (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
                    <ShieldCheck className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-3 text-lg font-semibold text-foreground dark:text-dark-foreground">{t('beneficiaries.guardian.empty')}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('beneficiaries.guardian.emptyDesc')}</p>
                    {onUpdate && (
                        <button
                            onClick={() => {
                                setGuardianForm(emptyGuardianForm());
                                setIsGuardianEditing(true);
                            }}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-dark transition-colors"
                        >
                            <PlusCircle size={16} /> {t('beneficiaries.guardian.add')}
                        </button>
                    )}
                </div>
            );
        }

        return (
            <Section
                title={t('beneficiaries.sections.guardian')}
                icon={<ShieldCheck size={18} />}
                accent="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300"
                onEdit={onUpdate && !isGuardianEditing ? () => setIsGuardianEditing(true) : undefined}
                editLabel={t('beneficiaries.actions.editGuardian')}
            >
                {isGuardianEditing ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableField label={t('beneficiaries.fields.guardianName')} value={guardianForm.name} onChange={v => setGuardianForm(f => ({ ...f, name: v }))} />
                            <EditableField label={t('beneficiaries.fields.relation')} value={guardianForm.relation} onChange={v => setGuardianForm(f => ({ ...f, relation: v }))} />
                            <EditableField label={t('beneficiaries.fields.phone')} value={guardianForm.phone} onChange={v => setGuardianForm(f => ({ ...f, phone: v }))} type="tel" />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button onClick={handleGuardianSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                                <Check size={14} /> {t('common.save')}
                            </button>
                            <button onClick={handleGuardianCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                ) : profile.guardian ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoRow label={t('beneficiaries.fields.guardianName')} value={profile.guardian.name} />
                        <InfoRow label={t('beneficiaries.fields.relation')} value={profile.guardian.relation} />
                        <InfoRow label={t('beneficiaries.fields.phone')} value={profile.guardian.phone} />
                    </div>
                ) : null}
            </Section>
        );
    };

    return (
        <div className="space-y-5">
            {renderGuardianSection()}

            <Section title={t('beneficiaries.sections.familyMembers')} icon={<Users size={18} />} accent="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300">
                {onUpdate && memberMode === 'none' && (
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => {
                                setMemberForm(emptyMemberForm());
                                setMemberMode('add');
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark transition-colors"
                        >
                            <PlusCircle size={14} /> {t('beneficiaries.guardian.addMember')}
                        </button>
                    </div>
                )}

                {memberMode !== 'none' && (
                    <div className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/30">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <EditableField label={t('beneficiaries.fields.name')} value={memberForm.name} onChange={v => setMemberForm(f => ({ ...f, name: v }))} />
                            <EditableField label={t('beneficiaries.fields.relation')} value={memberForm.relation} onChange={v => setMemberForm(f => ({ ...f, relation: v }))} />
                            <EditableField label={t('beneficiaries.fields.age')} value={memberForm.age} onChange={v => setMemberForm(f => ({ ...f, age: v }))} type="number" />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                            <button onClick={handleMemberSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
                                <Check size={14} /> {t('common.save')}
                            </button>
                            <button onClick={handleMemberCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                )}

                {familyMembers.length === 0 ? (
                    <div className="py-6 text-center">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('beneficiaries.guardian.noMembers')}</p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('beneficiaries.guardian.noMembersDesc')}</p>
                    </div>
                ) : (
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                        <table className="w-full text-sm">
                            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-slate-800/80">
                                <tr>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.name')}</th>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.relation')}</th>
                                    <th className="px-4 py-3 text-start font-bold">{t('beneficiaries.fields.age')}</th>
                                    {onUpdate && <th className="px-4 py-3 text-end font-bold">{t('beneficiaries.guardian.actions')}</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {familyMembers.map((member, index) => (
                                    <tr key={`${member.name}-${index}`} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-foreground dark:text-dark-foreground">{member.name}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{member.relation}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{member.age ?? '—'}</td>
                                        {onUpdate && (
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => startEditMember(index)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                        aria-label={t('beneficiaries.guardian.editMember')}
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => setMemberToRemoveIndex(index)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        aria-label={t('beneficiaries.guardian.removeMember')}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>

            <ConfirmationModal
                isOpen={memberToRemoveIndex != null}
                onClose={() => setMemberToRemoveIndex(null)}
                onConfirm={confirmRemoveMember}
                title={t('beneficiaries.guardian.removeMember')}
                message={t('beneficiaries.guardian.removeMemberConfirm')}
            />
        </div>
    );
};

export default GuardianTab;
