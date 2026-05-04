




import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useBeneficiaryData } from '../../hooks/useBeneficiaryData';
import type { Beneficiary, ProgramProject, BeneficiaryType } from '../../types';
import BeneficiaryCard from './beneficiaries/BeneficiaryCard';
import BeneficiaryDetailView from './beneficiaries/BeneficiaryDetailView';
import { BeneficiaryIcon, IncubationIcon } from '../icons/ModuleIcons';
import { Users, BookOpen, Heart, Home, Building, Globe } from 'lucide-react';
import PortalModal from '../beneficiary-portal/PortalModal';
import { BeneficiaryStats } from './beneficiaries/BeneficiaryStats';
import BeneficiaryToolbar from './beneficiaries/BeneficiaryToolbar';
import AddBeneficiaryModal from './beneficiaries/AddBeneficiaryModal';
import { useToast } from '../../hooks/useToast';
import OrphanProfile from './beneficiaries/OrphanProfile';

// Add SpeechRecognition type definition
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
}
declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition; };
        webkitSpeechRecognition: { new(): SpeechRecognition; };
    }
}


const BeneficiariesModule: React.FC = () => {
    const { t, language } = useLocalization(['common', 'beneficiaries', 'leadership', 'misc']);
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

    // New states for voice search
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Speech Recognition Setup Effect
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setMicError("Speech recognition is not supported in this browser.");
            return;
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                const errorMsg = "Microphone permission was denied. Please enable it in your browser settings.";
                setMicError(errorMsg);
                toast.showError(errorMsg);
            }
            setIsListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setSearchTerm(transcript);
        };
        
        recognitionRef.current = recognition;
    }, [toast]);

    const handleListen = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            return;
        }
        setMicError(null); // Reset error on new attempt
        const langCode = { en: 'en-US', ar: 'ar-SA' }[language];
        recognitionRef.current.lang = langCode;
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Speech recognition start error:", e);
            const errorMsg = "Could not start listening. Please try again.";
            setMicError(errorMsg);
            toast.showError(errorMsg);
        }
    }, [isListening, language, toast]);


    const categories: { id: BeneficiaryType | 'all', name: string, icon: React.FC }[] = [
        { id: 'all', name: t('beneficiaries.types.all'), icon: Users },
        { id: 'student', name: t('beneficiaries.types.student'), icon: BookOpen },
        { id: 'orphan', name: t('beneficiaries.types.orphan'), icon: Heart },
        { id: 'hafiz', name: t('beneficiaries.types.hafiz'), icon: BookOpen },
        { id: 'family', name: t('beneficiaries.types.family'), icon: Home },
        { id: 'institution', name: t('beneficiaries.types.institution'), icon: Building },
        { id: 'community', name: t('beneficiaries.types.community'), icon: Globe },
        { id: 'incubation_beneficiary', name: t('beneficiaries.types.incubation_beneficiary'), icon: IncubationIcon },
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
        toast.showSuccess(`Beneficiary ${data.name} added.`);
        setIsAddModalOpen(false);
    };
    
    const filteredBeneficiaries = useMemo(() => {
        return beneficiaries.filter(b => {
            const matchesCategory = selectedCategory === 'all' || b.beneficiaryType === selectedCategory;
            
            if (!searchTerm) {
                return matchesCategory;
            }
    
            const searchTermLower = searchTerm.toLowerCase();
            
            let matchesSearch = 
                b.name.toLowerCase().includes(searchTermLower) ||
                b.country.toLowerCase().includes(searchTermLower);
    
            if (b.profile) {
                if (b.profile.contact?.email) {
                    matchesSearch ||= b.profile.contact.email.toLowerCase().includes(searchTermLower);
                }
                if (b.profile.contact?.phone) {
                    matchesSearch ||= b.profile.contact.phone.includes(searchTerm);
                }
                if (b.profile.academicInfo?.university) {
                    matchesSearch ||= b.profile.academicInfo.university.toLowerCase().includes(searchTermLower);
                }
                if (b.profile.academicInfo?.field) {
                    matchesSearch ||= b.profile.academicInfo.field.toLowerCase().includes(searchTermLower);
                }
                if (b.profile.city) {
                     matchesSearch ||= b.profile.city.toLowerCase().includes(searchTermLower);
                }
            }
            
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
                        <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">{view} view is under construction.</h3>
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground flex items-center gap-3">
                    <BeneficiaryIcon /> {t('beneficiaries.title')}
                </h1>

                <div>
                    <label htmlFor="beneficiary-category-select" className="sr-only">فئات المستفيدين</label>
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
                isListening={isListening}
                handleListen={handleListen}
                micError={micError}
            />
            
            {isAdvancedFiltersOpen && <div className="p-4 bg-gray-50 dark:bg-dark-card/50 rounded-xl border dark:border-slate-700 animate-fade-in-fast">Advanced filters panel placeholder.</div>}

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
