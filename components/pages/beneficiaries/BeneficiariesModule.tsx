

import React, { useState, useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useBeneficiaryData } from '../../../hooks/useBeneficiaryData';
import type { Beneficiary, ProgramProject, BeneficiaryType } from '../../../types';
import BeneficiaryCard from './beneficiaries/BeneficiaryCard';
import BeneficiaryDetailView from './beneficiaries/BeneficiaryDetailView';
import { BeneficiaryIcon } from '../icons/ModuleIcons';
import { Users, BookOpen, Heart, Home, Building, Globe } from 'lucide-react';
import PortalModal from '../beneficiary-portal/PortalModal';
import { BeneficiaryStats } from './beneficiaries/BeneficiaryStats';
import BeneficiaryToolbar from './beneficiaries/BeneficiaryToolbar';
import AddBeneficiaryModal from './beneficiaries/AddBeneficiaryModal';
import { useToast } from '../../hooks/useToast';
import OrphanProfile from './beneficiaries/OrphanProfile';

const BeneficiariesModule: React.FC = () => {
    const { t, language } = useLocalization();
    const { beneficiaryData } = useBeneficiaryData();
    const { projects } = beneficiaryData;
    const toast = useToast();
    
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(beneficiaryData.beneficiaries);
    const [selectedCategory, setSelectedCategory] = useState<BeneficiaryType | 'all'>('all');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const [isPortalOpen, setIsPortalOpen] = useState(false);
    
    // New states for toolbar
    const [view, setView] = useState<'card' | 'list' | 'map' | 'briefcase'>('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const categories: { id: BeneficiaryType | 'all', name: string, icon: React.FC }[] = [
        { id: 'all', name: t('beneficiaries.types.all'), icon: Users },
        { id: 'student', name: t('beneficiaries.types.student'), icon: BookOpen },
        { id: 'orphan', name: t('beneficiaries.types.orphan'), icon: Heart },
        { id: 'hafiz', name: t('beneficiaries.types.hafiz'), icon: BookOpen },
        { id: 'family', name: t('beneficiaries.types.family'), icon: Home },
        { id: 'institution', name: t('beneficiaries.types.institution'), icon: Building },
        { id: 'community', name: t('beneficiaries.types.community'), icon: Globe },
    ];
    
    const handleAddBeneficiary = (data: any) => {
        const newBeneficiary: Beneficiary = {
            id: `ben-${Date.now()}`,
            name: data.name,
            beneficiaryType: data.beneficiaryType,
            photo: `https://picsum.photos/seed/${encodeURIComponent(data.name)}/100/100`,
            type: 'direct-support',
            country: data.country,
            profile: data.profile,
            assessments: [],
            milestones: []
        };
        setBeneficiaries(prev => [newBeneficiary, ...prev]);
        toast.showSuccess(t('beneficiaries.addedSuccess', { name: data.name }));
        setIsAddModalOpen(false);
    };
    
    const filteredBeneficiaries = useMemo(() => {
        return beneficiaries.filter(b => {
            const matchesCategory = selectedCategory === 'all' || b.beneficiaryType === selectedCategory;
            const matchesSearch = searchTerm ? b.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [beneficiaries, selectedCategory, searchTerm]);
    
    const renderCurrentView = () => {
        switch (view) {
            case 'card':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredBeneficiaries.map(beneficiary => {
                            const project = projects.find(p => p.id === beneficiary.projectId);
                            return (
                                <BeneficiaryCard
                                    key={beneficiary.id}
                                    beneficiary={beneficiary}
                                    project={project}
                                    onClick={() => setSelectedBeneficiary(beneficiary)}
                                />
                            );
                        })}
                    </div>
                );
            case 'list':
            case 'map':
            case 'briefcase':
                return (
                    <div className="text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner mt-6">
                        <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">{t('beneficiaries.viewUnderConstruction', { view })}</h3>
                    </div>
                );
            default:
                return null;
        }
    };

    if (selectedBeneficiary) {
        if (selectedBeneficiary.id === 'ben-orp-001') {
            return <OrphanProfile orphanId={selectedBeneficiary.id} onBack={() => setSelectedBeneficiary(null)} />;
        }
        return <BeneficiaryDetailView 
                    beneficiary={selectedBeneficiary} 
                    onBack={() => setSelectedBeneficiary(null)} 
                    onOpenPortal={() => setIsPortalOpen(true)} 
                    onUpdate={(updated) => {
                        setBeneficiaries(prev => prev.map(b => b.id === updated.id ? updated : b));
                        setSelectedBeneficiary(updated);
                    }}
                />;
    }

    return (
        <>
        <AddBeneficiaryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddBeneficiary}
        />
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground flex items-center gap-3">
                    <BeneficiaryIcon /> {t('beneficiaries.title')}
                </h1>

                <div>
                    <label htmlFor="beneficiary-category-select" className="sr-only">{t('beneficiaries.categorySelectLabel')}</label>
                    <select 
                        id="beneficiary-category-select"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as any)}
                        className="p-2 border rounded-lg bg-card dark:bg-dark-card dark:border-slate-600 min-w-[200px] text-lg font-semibold"
                    >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <BeneficiaryStats beneficiaries={filteredBeneficiaries} />
            
            <BeneficiaryToolbar
                view={view}
                onViewChange={setView}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddBeneficiary={() => setIsAddModalOpen(true)}
                onToggleAdvancedFilters={() => setIsAdvancedFiltersOpen(prev => !prev)}
            />
            
            {isAdvancedFiltersOpen && <div className="p-4 bg-gray-50 dark:bg-dark-card/50 rounded-xl border dark:border-slate-700 animate-fade-in-fast">{t('beneficiaries.advancedFiltersPlaceholder')}</div>}

            {filteredBeneficiaries.length > 0 ? renderCurrentView() : (
                <div className="col-span-full text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner mt-6">
                    <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-2">{t('beneficiaries.noResults')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{t('beneficiaries.noResultsDescription')}</p>
                </div>
            )}
        </div>
         <PortalModal 
            isOpen={isPortalOpen} 
            onClose={() => setIsPortalOpen(false)} 
        />
        </>
    );
};

export default BeneficiariesModule;
