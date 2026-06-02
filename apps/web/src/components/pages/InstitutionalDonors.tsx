
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { OPTIMISTIC_HIGHLIGHT_MS } from '../../lib/optimisticSubmit';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { useTabParam } from '../../hooks/useTabParam';
import type { InstitutionalDonor, SortDirection, InstitutionType } from '../../types';
import { useCreateInstitutionalDonor, useDeleteInstitutionalDonor, useInstitutionalDonors, useUpdateInstitutionalDonor } from '../../hooks/useInstitutionalDonors';
import InstitutionalDonorsControls from './donors_institutional/InstitutionalDonorsControls';
import AdvancedFilterPanelInstitutional, {
    DEFAULT_INSTITUTIONAL_DONOR_FILTERS,
    type InstitutionalDonorFilters,
} from './donors_institutional/AdvancedFilterPanelInstitutional';
import InstitutionalDonorsTable from './donors_institutional/InstitutionalDonorsTable';
import InstitutionalDonorCard from './donors_institutional/InstitutionalDonorCard';
import InstitutionalDonorDetailView from './donors_institutional/InstitutionalDonorDetailView';
import AddInstitutionModal from './donors_institutional/AddInstitutionModal';
import { InstitutionalDonorsMap } from './donors_institutional/InstitutionalDonorsMap';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { DollarSign, Filter, AlertTriangle, CalendarClock } from 'lucide-react';
import PartnershipOpportunitiesTab from './donors_institutional/PartnershipOpportunitiesTab';

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


const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string; }> = ({ title, value, icon, subtext }) => (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary dark:text-secondary rounded-lg">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
            <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
            {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
    </div>
);

const SmartAnalyticsDashboard: React.FC<{donors: InstitutionalDonor[]}> = ({donors}) => {
    const { t, language } = useLocalization(['common', 'donors', 'institutional_donors', 'misc']);

    const stats = useMemo(() => {
        const totalFunding = donors.reduce((sum, d) => sum + d.totalGrantsAwarded, 0);
        const pipelineValue = donors
            .filter(d => d.relationshipStatus === 'Prospect' || d.relationshipStatus === 'Cultivating')
            .reduce((sum, d) => sum + d.totalGrantsAwarded, 0);
        const highPriorityCount = donors.filter(d => d.priority === 'High').length;
        
        const now = new Date();
        const ninetyDaysFromNow = new Date(new Date().setDate(now.getDate() + 90));
        const upcomingDeadlines = donors.filter(d => d.nextDeadline && new Date(d.nextDeadline) <= ninetyDaysFromNow).length;

        return { totalFunding, pipelineValue, highPriorityCount, upcomingDeadlines };
    }, [donors]);

    const animatedFunding = useCountUp(stats.totalFunding);
    const animatedPipeline = useCountUp(stats.pipelineValue);
    const animatedHighPriority = useCountUp(stats.highPriorityCount);
    const animatedDeadlines = useCountUp(stats.upcomingDeadlines);
    
    return (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard 
                title={t('institutional_donors.analytics.totalFunding')}
                value={formatCurrency(animatedFunding, language)}
                icon={<DollarSign />}
            />
            <KpiCard 
                title={t('institutional_donors.analytics.pipelineValue')}
                value={formatCurrency(animatedPipeline, language)}
                icon={<Filter />}
            />
            <KpiCard 
                title={t('institutional_donors.analytics.highPriority')}
                value={formatNumber(animatedHighPriority, language)}
                icon={<AlertTriangle />}
            />
            <KpiCard 
                title={t('institutional_donors.analytics.upcomingDeadlines')}
                value={formatNumber(animatedDeadlines, language)}
                subtext={t('institutional_donors.analytics.next90days')}
                icon={<CalendarClock />}
            />
        </div>
    );
};

const INSTITUTIONAL_DONOR_VIEW_TABS = ['list', 'card', 'map', 'opportunities'] as const;

const InstitutionalDonors: React.FC = () => {
    const { t, language, pickLocalized } = useLocalization(['common', 'donors', 'institutional_donors', 'misc']);
    const toast = useToast();
    const { data: donors = [], isLoading, isError } = useInstitutionalDonors();
    const createInstitution = useCreateInstitutionalDonor();
    const updateInstitution = useUpdateInstitutionalDonor();
    const deleteInstitution = useDeleteInstitutionalDonor();
    const [view, setView] = useTabParam('tab', 'list', INSTITUTIONAL_DONOR_VIEW_TABS);
    const [selectedDonor, setSelectedDonor] = useState<InstitutionalDonor | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDraft, setFilterDraft] = useState<InstitutionalDonorFilters>(DEFAULT_INSTITUTIONAL_DONOR_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<InstitutionalDonorFilters>(DEFAULT_INSTITUTIONAL_DONOR_FILTERS);
    const [sortColumn, setSortColumn] = useState<keyof InstitutionalDonor | null>('nextDeadline');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    
    // Voice Search State
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Speech Recognition Setup Effect
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setMicError(t('institutional_donors.errors.speechNotSupported'));
            return;
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                const errorMsg = t('institutional_donors.errors.micDenied');
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
    }, [toast, language, t]);

    useEffect(() => {
        return () => {
            if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!selectedDonor) return;
        const latest = donors.find((donor) => donor.id === selectedDonor.id);
        if (!latest) return;
        if (latest !== selectedDonor) {
            setSelectedDonor(latest);
        }
    }, [donors, selectedDonor]);

    const flashHighlight = useCallback((id: string) => {
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        setHighlightedId(id);
        highlightTimerRef.current = setTimeout(() => setHighlightedId(null), OPTIMISTIC_HIGHLIGHT_MS);
    }, []);

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
            const errorMsg = t('institutional_donors.errors.speechStartFailed');
            setMicError(errorMsg);
            toast.showError(errorMsg);
        }
    }, [isListening, language, toast, t]);
    
    const getSortPriority = (type: InstitutionType) => {
        if (type === 'Multilateral') return 1;
        if (type === 'Government') return 2;
        return 3;
    };

    const existingCountries = useMemo(
        () => Array.from(new Set(donors.map((d) => d.country).filter(Boolean))).sort(),
        [donors],
    );

    const filteredAndSortedDonors = useMemo(() => {
        const focusQuery = appliedFilters.grantFocusArea.trim().toLowerCase();

        let filtered = donors.filter(donor => {
            const searchLower = searchTerm.toLowerCase();
            const orgName = pickLocalized(donor.organizationName);
            const matchesSearch = orgName.toLowerCase().includes(searchLower) ||
                   donor.primaryContact.name.toLowerCase().includes(searchLower) ||
                   donor.focusAreas.some(area => area.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;

            if (appliedFilters.institutionType !== 'all' && donor.type !== appliedFilters.institutionType) {
                return false;
            }
            if (appliedFilters.relationshipStatus !== 'all' && donor.relationshipStatus !== appliedFilters.relationshipStatus) {
                return false;
            }
            if (appliedFilters.priority !== 'all' && donor.priority !== appliedFilters.priority) {
                return false;
            }
            if (focusQuery && !donor.focusAreas.some((area) => area.toLowerCase().includes(focusQuery))) {
                return false;
            }

            return true;
        });

        filtered.sort((a, b) => {
            const priorityA = getSortPriority(a.type);
            const priorityB = getSortPriority(b.type);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            if (sortColumn) {
                const aVal = a[sortColumn];
                const bVal = b[sortColumn];

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                     if (sortColumn === 'nextDeadline' || sortColumn === 'lastContactDate' || sortColumn === 'createdDate') {
                         if (!aVal) return 1;
                         if (!bVal) return -1;
                        return sortDirection === 'asc' ? new Date(aVal).getTime() - new Date(bVal).getTime() : new Date(bVal).getTime() - new Date(aVal).getTime();
                    }
                    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }

                if (sortColumn === 'organizationName') {
                     const aName = pickLocalized(a.organizationName);
                     const bName = pickLocalized(b.organizationName);
                     return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
                }
            }
            
            return 0;
        });

        return filtered;
    }, [donors, searchTerm, appliedFilters, sortColumn, sortDirection, language]);

    const handleSort = useCallback((column: keyof InstitutionalDonor) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }, [sortColumn]);

    const handleAddInstitution = async (newDonorData: Omit<InstitutionalDonor, 'id' | 'logo' | 'totalGrantsAwarded' | 'activeGrants' | 'nextDeadline' | 'lastContactDate' | 'assignedManager' | 'createdDate'>) => {
        try {
            const created = await createInstitution.mutateAsync({
                name_en: newDonorData.organizationName.en.trim(),
                name_ar: (newDonorData.organizationName.ar || newDonorData.organizationName.en).trim(),
                type: newDonorData.type,
                relationship_status: newDonorData.relationshipStatus,
                priority: newDonorData.priority,
                assigned_manager: 'Unassigned',
                primary_contact_name: newDonorData.primaryContact.name.trim(),
                primary_contact_email: newDonorData.primaryContact.email.trim(),
                focus_areas: newDonorData.focusAreas,
                geographic_focus: newDonorData.geographicFocus,
                country: newDonorData.country.trim(),
                custom_fields: {
                    city: newDonorData.city || '',
                    registration_number: newDonorData.registrationNumber || '',
                    establishment_date: newDonorData.establishmentDate || null,
                },
            });
            flashHighlight(created.id);
            toast.showSuccess(t('institutional_donors.addInstitutionSuccess'));
        } catch {
            toast.showError(t('institutional_donors.errors.generic'));
            throw new Error('add institution failed');
        }
    };

    const handleDonorUpdated = useCallback((updated: InstitutionalDonor) => {
        void updateInstitution.mutateAsync({
            donorId: updated.id,
            payload: {
                relationship_status: updated.relationshipStatus,
                priority: updated.priority,
                assigned_manager: updated.assignedManager,
                primary_contact_name: updated.primaryContact.name,
                primary_contact_email: updated.primaryContact.email,
                focus_areas: updated.focusAreas,
                geographic_focus: updated.geographicFocus,
                country: updated.country,
                custom_fields: {
                    city: updated.city || '',
                    registration_number: updated.registrationNumber || '',
                    establishment_date: updated.establishmentDate || null,
                    phone: updated.phone || '',
                    website: updated.website || '',
                    address: updated.address || '',
                    social_media: updated.socialMedia || {},
                    coordinates: updated.coordinates || null,
                    logo: updated.logo || '',
                    last_contact_date: updated.lastContactDate || null,
                },
            },
        }).then(() => {
            setSelectedDonor(updated);
        }).catch(() => {
            toast.showError(t('institutional_donors.errors.generic'));
        });
    }, [t, toast, updateInstitution]);

    const handleDeleteInstitution = useCallback((donor: InstitutionalDonor) => {
        const orgName = pickLocalized(donor.organizationName);
        if (!window.confirm(t('institutional_donors.deleteInstitutionConfirm', { name: orgName }))) {
            return;
        }
        void deleteInstitution.mutateAsync(donor.id).then(() => {
            if (selectedDonor?.id === donor.id) {
                setSelectedDonor(null);
            }
            toast.showInfo(t('institutional_donors.institutionDeleted'));
        }).catch(() => {
            toast.showError(t('institutional_donors.errors.generic'));
        });
    }, [deleteInstitution, selectedDonor?.id, t, toast]);

    if (isLoading) {
        return <div className="py-8 text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</div>;
    }

    if (isError) {
        return <div className="py-8 text-sm text-red-500">{t('institutional_donors.errors.generic')}</div>;
    }

    if (selectedDonor) {
        return (
            <InstitutionalDonorDetailView
                donor={selectedDonor}
                onBack={() => setSelectedDonor(null)}
                onDonorUpdated={handleDonorUpdated}
                onDeleteDonor={handleDeleteInstitution}
                existingCountries={existingCountries}
            />
        );
    }

    return (
        <>
            <AddInstitutionModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddInstitution}
                existingCountries={existingCountries}
            />
            <div className="flex flex-col h-full animate-fade-in">
                <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-4">
                    {t('institutional_donors.title')}
                </h1>

                <SmartAnalyticsDashboard donors={donors} />
                
                <InstitutionalDonorsControls
                    view={view}
                    onViewChange={setView}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAddInstitution={() => setIsAddModalOpen(true)}
                    onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
                    isListening={isListening}
                    handleListen={handleListen}
                    micError={micError}
                />

                <AdvancedFilterPanelInstitutional
                    isOpen={filtersOpen}
                    filters={filterDraft}
                    onFiltersChange={setFilterDraft}
                    onApply={() => setAppliedFilters(filterDraft)}
                    onClear={() => {
                        setFilterDraft(DEFAULT_INSTITUTIONAL_DONOR_FILTERS);
                        setAppliedFilters(DEFAULT_INSTITUTIONAL_DONOR_FILTERS);
                    }}
                />

                <div className="flex-grow overflow-auto">
                     {view === 'list' && (
                         <InstitutionalDonorsTable
                            donors={filteredAndSortedDonors}
                            highlightedId={highlightedId}
                            onDonorSelect={(donor) => {
                                setSelectedDonor(donor);
                            }}
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                         />
                     )}
                     {view === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAndSortedDonors.map(donor => (
                                <InstitutionalDonorCard
                                    key={donor.id}
                                    donor={donor}
                                    highlighted={highlightedId === donor.id}
                                    onSelect={(d) => {
                                        setSelectedDonor(d);
                                    }}
                                    onDelete={handleDeleteInstitution}
                                />
                            ))}
                        </div>
                     )}
                     {view === 'map' && (
                        <InstitutionalDonorsMap donors={filteredAndSortedDonors} />
                     )}
                     {view === 'opportunities' && (
                        <PartnershipOpportunitiesTab donors={donors} onSelectDonor={setSelectedDonor} />
                     )}
                     {filteredAndSortedDonors.length === 0 && !['map', 'opportunities'].includes(view) && (
                        <div className="text-center py-16 px-6">
                            <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-2">{t('institutional_donors.noResults')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{t('institutional_donors.noResultsDescription')}</p>
                        </div>
                     )}
                </div>
            </div>
        </>
    );
};

export default InstitutionalDonors;
