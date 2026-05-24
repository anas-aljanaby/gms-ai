import React, { useState, useEffect } from 'react';
import ModalPortal from '../../common/ModalPortal';
import { useLocalization } from '../../../hooks/useLocalization';
import { X as XIcon } from 'lucide-react';

interface AddKpiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (kpiData: { title: string; value: number; target: number; unit: string; goalId: string; }) => void;
    goalId: string;
}

type FormErrors = {
    title?: string;
    unit?: string;
    value?: string;
    target?: string;
};

const AddKpiModal: React.FC<AddKpiModalProps> = ({ isOpen, onClose, onAdd, goalId }) => {
    const { t, dir } = useLocalization(['common', 'bousala']);
    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0);
    const [target, setTarget] = useState(0);
    const [unit, setUnit] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!isOpen) return;
        setTitle('');
        setValue(0);
        setTarget(0);
        setUnit('');
        setErrors({});
    }, [isOpen]);

    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!title.trim()) next.title = t('bousala.addKpiModal.titleRequired');
        if (!unit.trim()) next.unit = t('bousala.addKpiModal.unitRequired');
        if (value < 0) next.value = t('bousala.addKpiModal.invalidValue');
        if (target <= 0) next.target = t('bousala.addKpiModal.invalidTarget');
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onAdd({ title: title.trim(), value, target, unit: unit.trim(), goalId });
        onClose();
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose} dir={dir}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('bousala.addKpiModal.title')}</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium">{t('bousala.addKpiModal.kpiTitle')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })); }}
                                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800"
                                dir="auto"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium">{t('bousala.addKpiModal.currentValue')}</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={value}
                                    onChange={e => { setValue(Number(e.target.value)); if (errors.value) setErrors(prev => ({ ...prev, value: undefined })); }}
                                    className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800"
                                />
                                {errors.value && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.value}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium">{t('bousala.addKpiModal.targetValue')}</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={target}
                                    onChange={e => { setTarget(Number(e.target.value)); if (errors.target) setErrors(prev => ({ ...prev, target: undefined })); }}
                                    className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800"
                                />
                                {errors.target && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.target}</p>}
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">{t('bousala.addKpiModal.unit')}</label>
                            <input
                                type="text"
                                value={unit}
                                onChange={e => { setUnit(e.target.value); if (errors.unit) setErrors(prev => ({ ...prev, unit: undefined })); }}
                                placeholder={t('bousala.addKpiModal.unitPlaceholder')}
                                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800"
                                dir="auto"
                            />
                            {errors.unit && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.unit}</p>}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">{t('bousala.addKpiModal.save')}</button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
};

export default AddKpiModal;
