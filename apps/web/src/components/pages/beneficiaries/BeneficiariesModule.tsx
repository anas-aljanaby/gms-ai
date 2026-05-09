import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useBeneficiaryData } from '../../../hooks/useBeneficiaryData';
import type { Beneficiary, BeneficiaryStatus, BeneficiaryType } from '../../../types';
import AddBeneficiaryModal from './AddBeneficiaryModal';
import { useToast } from '../../../hooks/useToast';
import BeneficiaryStatsStrip from './BeneficiaryStatsStrip';
import FilterBar, { type FilterDef } from '../financials/shared/FilterBar';
import BeneficiaryDataTable from './BeneficiaryDataTable';
import BeneficiaryDrawer from './BeneficiaryDrawer';
import EmptyState from '../../common/EmptyState';
import SkeletonLoader from '../../common/SkeletonLoader';

const BeneficiariesModule: React.FC = () => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const { beneficiaryData, isLoading } = useBeneficiaryData();
    const toast = useToast();

    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(beneficiaryData.beneficiaries);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<BeneficiaryType | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<BeneficiaryStatus | ''>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        setBeneficiaries(beneficiaryData.beneficiaries);
    }, [beneficiaryData.beneficiaries]);

    // Derived data for filters
    const countries = useMemo(() => {
        const set = new Set(beneficiaries.map(b => b.country));
        return Array.from(set).sort();
    }, [beneficiaries]);

    // Filtering
    const filteredBeneficiaries = useMemo(() => {
        return beneficiaries.filter(b => {
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
    }, [beneficiaries, selectedType, selectedStatus, selectedCountry, searchTerm, language]);

    const handleAddBeneficiary = (data: Partial<Beneficiary>) => {
        const newBeneficiary: Beneficiary = {
            id: `ben-${Date.now()}`,
            name: data.name || { en: '', ar: '' },
            beneficiaryType: data.beneficiaryType || 'student',
            photo: `https://picsum.photos/seed/${Date.now()}/200/200`,
            status: 'active',
            supportType: data.supportType || 'direct-support',
            country: data.country || '',
            profile: data.profile || { type: 'student' },
            aidLog: [],
            assessments: [],
            milestones: [],
            documents: [],
        };
        setBeneficiaries(prev => [newBeneficiary, ...prev]);
        toast.showSuccess(t('beneficiaries.addedSuccess', { name: newBeneficiary.name[language] }));
        setIsAddModalOpen(false);
    };

    const handleUpdate = (updated: Beneficiary) => {
        setBeneficiaries(prev => prev.map(b => b.id === updated.id ? updated : b));
        setSelectedBeneficiary(updated);
    };

    const handleStatusChange = (beneficiary: Beneficiary, status: BeneficiaryStatus) => {
        const updated = { ...beneficiary, status };
        setBeneficiaries((prev) => prev.map((b) => (b.id === beneficiary.id ? updated : b)));
        if (selectedBeneficiary?.id === beneficiary.id) {
            setSelectedBeneficiary(updated);
        }
    };

    const handleRemove = (beneficiary: Beneficiary) => {
        setBeneficiaries((prev) => prev.filter((b) => b.id !== beneficiary.id));
        if (selectedBeneficiary?.id === beneficiary.id) {
            setSelectedBeneficiary(null);
        }
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

    return (
        <>
            <AddBeneficiaryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddBeneficiary}
            />

            <BeneficiaryDrawer
                beneficiary={selectedBeneficiary}
                isOpen={Boolean(selectedBeneficiary)}
                onClose={() => setSelectedBeneficiary(null)}
                onUpdate={handleUpdate}
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
                                projects={beneficiaryData.projects}
                                onSelect={setSelectedBeneficiary}
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
