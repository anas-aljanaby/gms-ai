import React, { useEffect, useState } from 'react';
import type { AidItem, AidStatus, AidType, ProgramProject } from '../../../types';
import type { DisbursementStatus } from '../../../types/financials';
import { useLocalization } from '../../../hooks/useLocalization';
import ModalPortal from '../../common/ModalPortal';
import { XIcon } from '../../icons/GenericIcons';
import EditableField from './shared/EditableField';

export type AidItemFormInput = {
    type: AidType;
    date: string;
    descriptionEn: string;
    descriptionAr: string;
    value: string;
    unit: string;
    status: AidStatus;
    relatedProjectId: string;
};

interface AidItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AidItemFormInput) => void;
    initialItem?: AidItem | null;
    linkedDisbursementStatus?: DisbursementStatus;
    projects?: ProgramProject[];
}

const AID_TYPES: AidType[] = ['financial', 'in-kind', 'service'];
const AID_STATUSES: AidStatus[] = ['Delivered', 'Pending', 'Scheduled'];
const CURRENCIES = ['USD', 'SAR', 'AED', 'EUR'];

const defaultUnitForType = (type: AidType): string => {
    if (type === 'financial') return 'USD';
    if (type === 'in-kind') return 'pcs';
    return 'hours';
};

const toDateInput = (iso?: string): string => {
    if (!iso) return new Date().toISOString().slice(0, 10);
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
};

const emptyForm = (): AidItemFormInput => ({
    type: 'financial',
    date: new Date().toISOString().slice(0, 10),
    descriptionEn: '',
    descriptionAr: '',
    value: '',
    unit: 'USD',
    status: 'Pending',
    relatedProjectId: '',
});

const formFromItem = (item: AidItem): AidItemFormInput => ({
    type: item.type,
    date: toDateInput(item.date),
    descriptionEn: item.description.en || '',
    descriptionAr: item.description.ar || '',
    value: item.value?.toString() || '',
    unit: item.unit || defaultUnitForType(item.type),
    status: item.status,
    relatedProjectId: item.relatedProjectId || '',
});

type AidFormErrors = {
    description?: string;
    value?: string;
    unit?: string;
};

const AidItemModal: React.FC<AidItemModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialItem,
    linkedDisbursementStatus,
    projects = [],
}) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const isEdit = !!initialItem;
    const [form, setForm] = useState<AidItemFormInput>(emptyForm);
    const [errors, setErrors] = useState<AidFormErrors>({});
    const isFinancialType = form.type === 'financial';
    const hasLinkedDisbursement = isFinancialType && !!initialItem?.disbursementId;
    const isDisbursementLocked = hasLinkedDisbursement && linkedDisbursementStatus !== 'pending_approval';
    const isAmountLocked = hasLinkedDisbursement;

    useEffect(() => {
        if (isOpen) {
            setForm(initialItem ? formFromItem(initialItem) : emptyForm());
            setErrors({});
        }
    }, [isOpen, initialItem]);

    const clearError = (field: keyof AidFormErrors) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleTypeChange = (type: AidType) => {
        setForm((prev) => ({
            ...prev,
            type,
            status: type === 'financial' ? 'Pending' : prev.status,
            unit: prev.type === type ? (prev.unit || defaultUnitForType(type)) : defaultUnitForType(type),
        }));
        clearError('unit');
    };

    const validateForm = (): boolean => {
        const nextErrors: AidFormErrors = {};
        if (!form.descriptionEn.trim() && !form.descriptionAr.trim()) {
            nextErrors.description = t('beneficiaries.validation.descriptionRequired');
        }

        const rawValue = form.value.trim();
        if (!rawValue) {
            nextErrors.value = t(isFinancialType ? 'beneficiaries.validation.amountRequired' : 'beneficiaries.validation.quantityRequired');
        } else {
            const parsed = Number.parseFloat(rawValue);
            if (Number.isNaN(parsed) || parsed < 0) {
                nextErrors.value = t('beneficiaries.validation.invalidAmount');
            }
        }

        if (!form.unit.trim()) {
            nextErrors.unit = t(isFinancialType ? 'beneficiaries.validation.currencyRequired' : 'beneficiaries.validation.unitRequired');
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit({
            ...form,
            status: isFinancialType ? 'Pending' : form.status,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                        {isEdit ? t('beneficiaries.aidLog.editItem') : t('beneficiaries.aidLog.addItem')}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}>
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-gray-300">
                            <span className="text-red-500">*</span> {t('beneficiaries.aidLog.requiredHint')}
                        </div>
                        {isFinancialType && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-100">
                                {t('beneficiaries.aidLog.financialApprovalNotice')}
                            </div>
                        )}
                        {isDisbursementLocked && (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-gray-300">
                                {t('beneficiaries.aidLog.financialLockedNotice')}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.aidLog.type')}</span>
                                <select
                                    value={form.type}
                                    onChange={(e) => handleTypeChange(e.target.value as AidType)}
                                    disabled={isEdit && (hasLinkedDisbursement || initialItem?.type === 'financial')}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                >
                                    {AID_TYPES.map((type) => (
                                        <option key={type} value={type}>{t(`beneficiaries.aidLog.types.${type}`)}</option>
                                    ))}
                                </select>
                            </label>
                            <EditableField
                                label={t('beneficiaries.aidLog.date')}
                                value={form.date}
                                onChange={v => setForm(f => ({ ...f, date: v }))}
                                type="date"
                                disabled={isAmountLocked}
                            />
                            {!isFinancialType && (
                                <label className="block min-w-0">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.aidLog.statusLabel')}</span>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm(f => ({ ...f, status: e.target.value as AidStatus }))}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                    >
                                        {AID_STATUSES.map((status) => (
                                            <option key={status} value={status}>{t(`beneficiaries.aidLog.status.${status.toLowerCase()}`)}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.fields.project')}</span>
                                <select
                                    value={form.relatedProjectId}
                                    onChange={(e) => setForm(f => ({ ...f, relatedProjectId: e.target.value }))}
                                    disabled={isDisbursementLocked}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                >
                                    <option value="">{t('beneficiaries.fields.noProject')}</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>{proj.name[language] || proj.name.en}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                                label={t('beneficiaries.aidLog.descriptionEn')}
                                value={form.descriptionEn}
                                onChange={v => {
                                    setForm(f => ({ ...f, descriptionEn: v }));
                                    if (v.trim() || form.descriptionAr.trim()) clearError('description');
                                }}
                                required
                                error={errors.description}
                                disabled={isDisbursementLocked}
                            />
                            <EditableField
                                label={t('beneficiaries.aidLog.descriptionAr')}
                                value={form.descriptionAr}
                                onChange={v => {
                                    setForm(f => ({ ...f, descriptionAr: v }));
                                    if (v.trim() || form.descriptionEn.trim()) clearError('description');
                                }}
                                dir="rtl"
                                required
                                error={errors.description}
                                disabled={isDisbursementLocked}
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('beneficiaries.aidLog.descriptionHint')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                                label={t(isFinancialType ? 'beneficiaries.aidLog.amount' : 'beneficiaries.aidLog.quantity')}
                                value={form.value}
                                onChange={v => {
                                    setForm(f => ({ ...f, value: v }));
                                    clearError('value');
                                }}
                                type="number"
                                required
                                error={errors.value}
                                disabled={isAmountLocked}
                            />
                            {isFinancialType ? (
                                <label className="block min-w-0">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                        {t('beneficiaries.aidLog.currency')}
                                        <span className="text-red-500"> *</span>
                                    </span>
                                    <select
                                        value={form.unit}
                                        onChange={(e) => {
                                            setForm(f => ({ ...f, unit: e.target.value }));
                                            clearError('unit');
                                        }}
                                        disabled={isAmountLocked}
                                        aria-invalid={!!errors.unit}
                                        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm font-semibold outline-none disabled:opacity-60 dark:bg-slate-900 dark:text-dark-foreground ${
                                            errors.unit
                                                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 dark:border-red-500/70'
                                                : 'border-gray-300 dark:border-slate-600'
                                        }`}
                                    >
                                        {CURRENCIES.map((currency) => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                    {errors.unit && <p className="mt-1 text-xs text-red-500">{errors.unit}</p>}
                                </label>
                            ) : (
                                <EditableField
                                    label={t('beneficiaries.aidLog.unit')}
                                    value={form.unit}
                                    onChange={v => {
                                        setForm(f => ({ ...f, unit: v }));
                                        clearError('unit');
                                    }}
                                    required
                                    error={errors.unit}
                                />
                            )}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end gap-3 border-t dark:border-slate-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                        <button
                            type="submit"
                            disabled={isDisbursementLocked}
                            className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-60"
                        >
                            {isFinancialType && !isEdit ? t('beneficiaries.aidLog.submitForApproval') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
};

export default AidItemModal;
