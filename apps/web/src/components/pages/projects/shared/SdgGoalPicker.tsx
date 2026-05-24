import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { MOCK_SDGS } from '../../../../data/programData';
import type { Language } from '../../../../types';
import Tooltip from '../../../common/Tooltip';
import { Check } from 'lucide-react';

export const getSdgIconUrl = (id: number) =>
    `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(id).padStart(2, '0')}.jpg`;

const sdgShortNames: Record<number, Record<Language, string>> = {
    1: { en: 'No Poverty', ar: 'القضاء على الفقر' },
    2: { en: 'Zero Hunger', ar: 'القضاء على الجوع' },
    3: { en: 'Good Health', ar: 'الصحة الجيدة' },
    4: { en: 'Quality Education', ar: 'التعليم الجيد' },
    5: { en: 'Gender Equality', ar: 'المساواة بين الجنسين' },
    6: { en: 'Clean Water', ar: 'المياه النظيفة' },
    7: { en: 'Clean Energy', ar: 'طاقة نظيفة' },
    8: { en: 'Decent Work', ar: 'العمل اللائق' },
    9: { en: 'Innovation', ar: 'الابتكار' },
    10: { en: 'Reduced Inequality', ar: 'الحد من عدم المساواة' },
    11: { en: 'Sustainable Cities', ar: 'مدن مستدامة' },
    12: { en: 'Responsible Use', ar: 'الاستهلاك المسؤول' },
    13: { en: 'Climate Action', ar: 'العمل المناخي' },
    14: { en: 'Life Below Water', ar: 'الحياة تحت الماء' },
    15: { en: 'Life on Land', ar: 'الحياة في البر' },
    16: { en: 'Peace & Justice', ar: 'السلام والعدل' },
    17: { en: 'Partnerships', ar: 'الشراكات' },
};

interface SdgGoalPickerProps {
    value: number[];
    onChange: (ids: number[]) => void;
}

const SdgGoalPicker: React.FC<SdgGoalPickerProps> = ({ value, onChange }) => {
    const { t, language } = useLocalization(['projects']);

    const toggle = (id: number) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id].sort((a, b) => a - b));
        }
    };

    return (
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t('projects.sdgPicker.selectedCount', { count: value.length })}
            </p>
            <div
                className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2"
                role="group"
                aria-label={t('projects.wizard.form.sdgGoals')}
            >
                {MOCK_SDGS.map((sdg) => {
                    const selected = value.includes(sdg.id);
                    const name = sdgShortNames[sdg.id]?.[language] ?? sdg.name;
                    const tooltip = t('projects.sdgAnalytics.sdgTooltip', { id: sdg.id, name });
                    const ariaLabel = selected
                        ? t('projects.sdgPicker.deselect', { id: sdg.id, name })
                        : t('projects.sdgPicker.select', { id: sdg.id, name });

                    return (
                        <Tooltip key={sdg.id} text={tooltip}>
                            <button
                                type="button"
                                onClick={() => toggle(sdg.id)}
                                aria-pressed={selected}
                                aria-label={ariaLabel}
                                className={`relative rounded-lg overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${
                                    selected
                                        ? 'ring-2 ring-primary ring-offset-1 scale-105 shadow-md'
                                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                                } ${!sdg.isEnabled && !selected ? 'grayscale-[25%]' : ''}`}
                            >
                                <img
                                    src={getSdgIconUrl(sdg.id)}
                                    alt=""
                                    className="w-full aspect-square object-cover"
                                    loading="lazy"
                                />
                                {selected && (
                                    <span className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                                    </span>
                                )}
                            </button>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default SdgGoalPicker;
