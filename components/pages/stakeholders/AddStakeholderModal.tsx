

import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { XIcon } from '../../icons/GenericIcons';
import type { StakeholderType, StakeholderCategoryKey, Language } from '../../../types';

interface AddStakeholderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => void;
}

const AddStakeholderModal: React.FC<AddStakeholderModalProps> = ({ isOpen, onClose, onAdd }) => {
    const { t } = useLocalization();
    const [name, setName] = useState({ en: '', ar: '', tr: '' });
    const [type, setType] = useState<StakeholderType>('donor');
    const [category, setCategory] = useState<StakeholderCategoryKey>('foundation');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.en && !name.ar) {
            alert('Name is required in at least one language.');
            return;
        }
        onAdd({
            name: {
                en: name.en || name.ar,
                ar: name.ar || name.en,
                tr: name.tr || name.en,
            },
            type,
            category,
            country,
            email,
            phone,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('stakeholder_management.add_modal.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.name_ar')}</label><input dir="rtl" type="text" value={name.ar} onChange={e => setName(n => ({...n, ar: e.target.value}))} className="w-full p-2 mt-1 border rounded-md"/></div>
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.name_en')}</label><input type="text" value={name.en} onChange={e => setName(n => ({...n, en: e.target.value}))} className="w-full p-2 mt-1 border rounded-md"/></div>
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.name_tr')}</label><input type="text" value={name.tr} onChange={e => setName(n => ({...n, tr: e.target.value}))} className="w-full p-2 mt-1 border rounded-md"/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.type')}</label><select value={type} onChange={e => setType(e.target.value as StakeholderType)} className="w-full p-2 mt-1 border rounded-md">
                                <option value="donor">Donor</option>
                                <option value="beneficiary">Beneficiary</option>
                                <option value="partner">Partner</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="mentor">Mentor</option>
                                <option value="expert">Expert/Trainer</option>
                                <option value="investor">Investor</option>
                                <option value="board_member">Board Member</option>
                                <option value="government">Government</option>
                                <option value="supplier">Supplier</option>
                                <option value="community">Community</option>
                                <option value="media">Media</option>
                            </select></div>
                            <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.category')}</label><select value={category} onChange={e => setCategory(e.target.value as StakeholderCategoryKey)} className="w-full p-2 mt-1 border rounded-md"><option value="foundation">Foundation</option><option value="family">Family</option><option value="company">Company</option></select></div>
                        </div>
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.country')}</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 mt-1 border rounded-md"/></div>
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.email')}</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md"/></div>
                        <div><label className="block text-sm font-medium">{t('stakeholder_management.add_modal.phone')}</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 mt-1 border rounded-md"/></div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold">{t('common.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStakeholderModal;