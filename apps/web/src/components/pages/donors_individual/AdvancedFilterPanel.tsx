
import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { DonorPipelineType, DonorStageId, DonorStatus, DonorTier } from '../../../types';

export interface DonorFilters {
    status: DonorStatus | 'all';
    tier: DonorTier | 'all';
    country: string;
    tag: string;
    owner: string;
    stage: DonorStageId | 'all';
    donorType: DonorPipelineType | 'all';
    actionState: 'all' | 'overdue' | 'noNextAction';
}

interface AdvancedFilterPanelProps {
    isOpen: boolean;
    filters: DonorFilters;
    countries: string[];
    tags: string[];
    owners: string[];
    donorTypes: DonorPipelineType[];
    stages: DonorStageId[];
    onApply: (filters: DonorFilters) => void;
    onClear: () => void;
}

const STATUS_OPTIONS: DonorStatus[] = ['Active', 'Lapsed', 'On Hold', 'Deceased', 'Disqualified'];
const TIER_OPTIONS: DonorTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Major Donor'];
const emptyFilters: DonorFilters = {
    status: 'all',
    tier: 'all',
    country: 'all',
    tag: 'all',
    owner: 'all',
    stage: 'all',
    donorType: 'all',
    actionState: 'all',
};

const translationKey = (value: string) => value.replace(/\s+/g, '');

const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
    isOpen,
    filters,
    countries,
    tags,
    owners,
    donorTypes,
    stages,
    onApply,
    onClear,
}) => {
    const { t, dir } = useLocalization(['common', 'individual_donors', 'donors']);
    const [draftFilters, setDraftFilters] = useState<DonorFilters>(filters);

    useEffect(() => {
        setDraftFilters(filters);
    }, [filters]);

    const updateFilter = <Key extends keyof DonorFilters>(key: Key, value: DonorFilters[Key]) => {
        setDraftFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClear = () => {
        setDraftFilters(emptyFilters);
        onClear();
    };

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-4 mb-4 bg-gray-50 dark:bg-dark-card/50 rounded-xl border dark:border-slate-700">
                <h3 className="font-semibold mb-4">{t('individual_donors.filters')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-status-filter">{t('individual_donors.columns.status')}</label>
                        <select
                            id="donor-status-filter"
                            value={draftFilters.status}
                            onChange={(event) => updateFilter('status', event.target.value as DonorFilters['status'])}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allStatuses')}</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{t(`individual_donors.statuses.${translationKey(status)}`)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-tier-filter">{t('individual_donors.columns.tier')}</label>
                        <select
                            id="donor-tier-filter"
                            value={draftFilters.tier}
                            onChange={(event) => updateFilter('tier', event.target.value as DonorFilters['tier'])}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allTiers')}</option>
                            {TIER_OPTIONS.map(tier => (
                                <option key={tier} value={tier}>{t(`individual_donors.tiers.${translationKey(tier)}`)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-country-filter">{t('individual_donors.modal.country')}</label>
                        <select
                            id="donor-country-filter"
                            value={draftFilters.country}
                            onChange={(event) => updateFilter('country', event.target.value)}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allCountries')}</option>
                            {countries.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-tag-filter">{t('individual_donors.columns.tags')}</label>
                        <select
                            id="donor-tag-filter"
                            value={draftFilters.tag}
                            onChange={(event) => updateFilter('tag', event.target.value)}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.anyTag')}</option>
                            {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-owner-filter">{t('individual_donors.columns.owner')}</label>
                        <select
                            id="donor-owner-filter"
                            value={draftFilters.owner}
                            onChange={(event) => updateFilter('owner', event.target.value)}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allOwners')}</option>
                            {owners.map(owner => <option key={owner} value={owner}>{owner}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-stage-filter">{t('individual_donors.columns.pipelineStage')}</label>
                        <select
                            id="donor-stage-filter"
                            value={draftFilters.stage}
                            onChange={(event) => updateFilter('stage', event.target.value as DonorFilters['stage'])}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allStages')}</option>
                            {stages.map(stage => <option key={stage} value={stage}>{t(`donors.stages.${stage}`)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-type-filter">{t('individual_donors.columns.donorType')}</label>
                        <select
                            id="donor-type-filter"
                            value={draftFilters.donorType}
                            onChange={(event) => updateFilter('donorType', event.target.value as DonorFilters['donorType'])}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allDonorTypes')}</option>
                            {donorTypes.map(type => <option key={type} value={type}>{t(`donors.types.${type.replace(/ /g, '')}`, type)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="donor-action-filter">{t('individual_donors.columns.actionState')}</label>
                        <select
                            id="donor-action-filter"
                            value={draftFilters.actionState}
                            onChange={(event) => updateFilter('actionState', event.target.value as DonorFilters['actionState'])}
                            className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">{t('individual_donors.filterOptions.allActionStates')}</option>
                            <option value="overdue">{t('individual_donors.filterOptions.overdue')}</option>
                            <option value="noNextAction">{t('individual_donors.filterOptions.noNextAction')}</option>
                        </select>
                    </div>
                </div>
                <div className={`flex gap-2 mt-4 ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    <button onClick={handleClear} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                        {t('common.clearFilters')}
                    </button>
                    <button onClick={() => onApply(draftFilters)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark">
                        {t('individual_donors.filterOptions.applyFilters')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilterPanel;
