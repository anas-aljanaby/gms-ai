import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { BENEFICIARY_MOCK_PROJECTS } from '../../../hooks/useBeneficiaryData';
import {
    isOptimisticBeneficiary,
    useBeneficiaries,
    useCreateBeneficiary,
    useDeleteBeneficiary,
    useUpdateBeneficiary,
} from '../../../hooks/useBeneficiaries';
import type { Beneficiary, BeneficiaryStatus, BeneficiaryType } from '../../../types';
import AddBeneficiaryModal from './AddBeneficiaryModal';
import { useToast } from '../../../hooks/useToast';
import BeneficiaryStatsStrip from './BeneficiaryStatsStrip';
import FilterBar, { type FilterDef } from '../financials/shared/FilterBar';
import BeneficiaryDataTable from './BeneficiaryDataTable';
import BeneficiaryDetailView, { BeneficiaryProfileRoute } from './BeneficiaryDetailView';
import EmptyState from '../../common/EmptyState';
import SkeletonLoader from '../../common/SkeletonLoader';
import { OPTIMISTIC_HIGHLIGHT_MS } from '../../../lib/optimisticSubmit';

interface BeneficiariesModuleProps {
    deepLinkTarget?: { id?: string; tab?: string } | null;
}

const BeneficiariesModule: React.FC<BeneficiariesModuleProps> = ({ deepLinkTarget }) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const { data: beneficiaries = [], isLoading, isError, refetch } = useBeneficiaries();
    const createBeneficiaryMutation = useCreateBeneficiary();
    const updateBeneficiaryMutation = useUpdateBeneficiary();
    const deleteBeneficiaryMutation = useDeleteBeneficiary();
    const toast = useToast();

    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<BeneficiaryType | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<BeneficiaryStatus | ''>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const selectedBeneficiary = useMemo(
        () => beneficiaries.find((b) => b.id === selectedBeneficiaryId) ?? null,
        [beneficiaries, selectedBeneficiaryId],
    );

    useEffect(() => {
        return () => {
            if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        };
    }, []);

    const handleBeneficiarySelect = useCallback((beneficiary: Beneficiary) => {
        setSelectedBeneficiaryId(beneficiary.id);
        window.location.hash = `beneficiaries/${beneficiary.id}`;
    }, []);

    const handleBeneficiaryBack = useCallback(() => {
        setSelectedBeneficiaryId(null);
        window.location.hash = 'beneficiaries';
    }, []);

    useEffect(() => {
        if (deepLinkTarget?.id && beneficiaries.length > 0) {
            setSelectedBeneficiaryId(deepLinkTarget.id);
        } else if (!deepLinkTarget?.id) {
            setSelectedBeneficiaryId(null);
        }
    }, [deepLinkTarget, beneficiaries.length]);

    const flashHighlight = useCallback((id: string) => {
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        setHighlightedId(id);
        highlightTimerRef.current = setTimeout(() => setHighlightedId(null), OPTIMISTIC_HIGHLIGHT_MS);
    }, []);

    const countries = useMemo(() => {
        const set = new Set(beneficiaries.map((b) => b.country));
        return Array.from(set).sort();
    }, [beneficiaries]);

    const filteredBeneficiaries = useMemo(() => {
        const optimistic = beneficiaries.filter((b) => isOptimisticBeneficiary(b.id));
        const rest = beneficiaries.filter((b) => !isOptimisticBeneficiary(b.id));

        const filtered = rest.filter((b) => {
            if (selectedType && b.beneficiaryType !== selectedType) return false;
            if (selectedStatus && b.status !== selectedStatus) return false;
            if (selectedCountry && b.country !== selectedCountry) return false;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const name = (b.name[language] || b.name.en || b.name.ar || '').toLowerCase();
                const country = b.country.toLowerCase();
                const contact = b.profile.contact;
                const matchesName = name.includes(term);
                const matchesCountry = country.includes(term);
                const matchesEmail = contact?.email?.toLowerCase().includes(term) ?? false;
                const matchesPhone = contact?.phone?.includes(term) ?? false;
                if (!matchesName && !matchesCountry && !matchesEmail && !matchesPhone) return false;
            }

            return true;
        });

        return [...optimistic, ...filtered];
    }, [beneficiaries, selectedType, selectedStatus, selectedCountry, searchTerm, language]);

    const handleAddBeneficiary = (data: Partial<Beneficiary>) => {
        createBeneficiaryMutation.mutate(data, {
            onSuccess: (created) => {
                flashHighlight(created.id);
                toast.showSuccess(t('beneficiaries.addedSuccess', { name: created.name[language] }));
            },
            onError: (error) => {
                toast.showError(error instanceof Error ? error.message : t('common.error', 'Error'));
            },
        });
    };

    const handleUpdate = (updated: Beneficiary) => {
        if (isOptimisticBeneficiary(updated.id)) return;
        updateBeneficiaryMutation.mutate(updated, {
            onError: (error) => {
                toast.showError(error instanceof Error ? error.message : t('common.error', 'Error'));
            },
        });
    };

    const handleStatusChange = (beneficiary: Beneficiary, status: BeneficiaryStatus) => {
        if (isOptimisticBeneficiary(beneficiary.id)) return;
        handleUpdate({ ...beneficiary, status });
    };

    const handleRemove = (beneficiary: Beneficiary) => {
        if (isOptimisticBeneficiary(beneficiary.id)) return;
        deleteBeneficiaryMutation.mutate(beneficiary.id, {
            onSuccess: () => {
                if (selectedBeneficiaryId === beneficiary.id) {
                    setSelectedBeneficiaryId(null);
                }
            },
            onError: (error) => {
                toast.showError(error instanceof Error ? error.message : t('common.error', 'Error'));
            },
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedStatus('');
        setSelectedCountry('');
    };

    const filterDefs: FilterDef[] = [
        {
            key: 'type',
            label: t('beneficiaries.types.all'),
            value: selectedType,
            onChange: (value) => setSelectedType(value as BeneficiaryType | ''),
            options: [
                { value: 'student', label: t('beneficiaries.types.student') },
                { value: 'orphan', label: t('beneficiaries.types.orphan') },
                { value: 'hafiz', label: t('beneficiaries.types.hafiz') },
                { value: 'family', label: t('beneficiaries.types.family') },
                { value: 'institution', label: t('beneficiaries.types.institution') },
                { value: 'community', label: t('beneficiaries.types.community') },
            ],
        },
        {
            key: 'status',
            label: t('beneficiaries.statuses.all'),
            value: selectedStatus,
            onChange: (value) => setSelectedStatus(value as BeneficiaryStatus | ''),
            options: [
                { value: 'active', label: t('beneficiaries.statuses.active') },
                { value: 'inactive', label: t('beneficiaries.statuses.inactive') },
                { value: 'graduated', label: t('beneficiaries.statuses.graduated') },
                { value: 'suspended', label: t('beneficiaries.statuses.suspended') },
                { value: 'on-hold', label: t('beneficiaries.statuses.on-hold') },
            ],
        },
        {
            key: 'country',
            label: t('beneficiaries.filters.allCountries'),
            value: selectedCountry,
            onChange: setSelectedCountry,
            options: countries.map((country) => ({ value: country, label: country })),
        },
    ];

    if (selectedBeneficiary) {
        return (
            <BeneficiaryDetailView
                beneficiary={selectedBeneficiary}
                onBack={handleBeneficiaryBack}
                onUpdate={handleUpdate}
                projects={BENEFICIARY_MOCK_PROJECTS}
                existingCountries={countries}
            />
        );
    }

    if (selectedBeneficiaryId) {
        return (
            <BeneficiaryProfileRoute
                beneficiaryId={selectedBeneficiaryId}
                beneficiaries={beneficiaries}
                isLoading={isLoading}
                onBack={handleBeneficiaryBack}
                onUpdate={handleUpdate}
                projects={BENEFICIARY_MOCK_PROJECTS}
                existingCountries={countries}
            />
        );
    }

    return (
        <>
            <AddBeneficiaryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddBeneficiary}
                existingCountries={countries}
            />

            <div className="space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                        {t('beneficiaries.title')}
                    </h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary-dark"
                    >
                        <Plus size={16} />
                        {t('beneficiaries.addBeneficiary')}
                    </button>
                </div>

                {isError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {t('common.error', 'Error loading data')}
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="ms-3 font-semibold underline"
                        >
                            {t('common.retry', 'Retry')}
                        </button>
                    </div>
                )}

                <BeneficiaryStatsStrip beneficiaries={filteredBeneficiaries} />

                <FilterBar
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder={t('beneficiaries.searchPlaceholder')}
                    filters={filterDefs}
                />

                {isLoading ? (
                    <SkeletonLoader type="table" rows={8} columns={7} />
                ) : (
                    <>
                        {beneficiaries.length === 0 ? (
                            <EmptyState type="NoData" onAction={() => setIsAddModalOpen(true)} />
                        ) : filteredBeneficiaries.length > 0 ? (
                            <BeneficiaryDataTable
                                beneficiaries={filteredBeneficiaries}
                                projects={BENEFICIARY_MOCK_PROJECTS}
                                highlightedId={highlightedId}
                                onSelect={(beneficiary) => {
                                    if (isOptimisticBeneficiary(beneficiary.id)) return;
                                    handleBeneficiarySelect(beneficiary);
                                }}
                                onStatusChange={handleStatusChange}
                                onRemove={handleRemove}
                            />
                        ) : (
                            <EmptyState type="NoResults" onAction={clearFilters} />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default BeneficiariesModule;
