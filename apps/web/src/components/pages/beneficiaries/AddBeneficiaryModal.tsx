import React, { useState } from 'react';
import { XIcon } from '../../icons/GenericIcons';
import type { BeneficiaryType } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';

interface AddBeneficiaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => void;
}

const AddBeneficiaryModal: React.FC<AddBeneficiaryModalProps> = ({ isOpen, onClose, onAdd }) => {
    const { t } = useLocalization();
    const [name, setName] = useState('');
    const [beneficiaryType, setBeneficiaryType] = useState<BeneficiaryType>('student');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert(t('beneficiaries.modal.add.validation.nameRequired'));
            return;
        }
        onAdd({
            name,
            beneficiaryType,
            country,
            profile: {
                contact: { email, phone }
            }
        });
        // Reset form
        setName('');
        setBeneficiaryType('student');
        setCountry('');
        setEmail('');
        setPhone('');
        onClose();
    };

    if (!isOpen) return null;

    const beneficiaryTypes: BeneficiaryType[] = ['student', 'family', 'orphan', 'hafiz', 'institution', 'community', 'incubation_beneficiary', 'individual-other'];

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('beneficiaries.modal.add.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}>
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium">{t('beneficiaries.modal.add.fullName')}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('beneficiaries.modal.add.beneficiaryType')}</label>
                            <select value={beneficiaryType} onChange={e => setBeneficiaryType(e.target.value as BeneficiaryType)} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                                {beneficiaryTypes.map(type => (
                                    <option key={type} value={type}>{t(`beneficiaries.types.${type}`)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('beneficiaries.modal.add.country')}</label>
                            <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('beneficiaries.modal.add.email')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('beneficiaries.modal.add.phone')}</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold">{t('beneficiaries.modal.add.addButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBeneficiaryModal;