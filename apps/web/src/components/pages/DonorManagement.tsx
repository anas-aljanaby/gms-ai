




import React, { useState, useReducer, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { useDonorIntelligenceData } from '../../hooks/useDonorIntelligenceData';
import { MOCK_DONORS } from '../../data/mockData';
import { MOCK_INDIVIDUAL_DONORS } from '../../data/individualDonorsData';
import { MOCK_DONATIONS } from '../../data/donationsData';
import { classifyAndEnrichDonor } from '../../lib/donorIntelligence';

import type { Donor, DonorStageId, IndividualDonor, Role, SortDirection, Project } from '../../types';
import DashboardControls from './donors/DashboardControls';
import KanbanBoard from './donors/KanbanBoard';
import AddDonorModal from './donors/AddDonorModal';
import FunnelChart from '../common/FunnelChart';
import DonorsTable from './donors_individual/DonorsTable';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getDonorCategoryLabel } from '../../lib/utils';
import Tabs from '../common/Tabs';
import { Briefcase, Map, Users, Filter, Lightbulb, Search, Eye, FileText, Copy, Save, List } from 'lucide-react';
import { SearchIcon, XIcon, SparklesIcon } from '../icons/GenericIcons';
import DonorCard from './donors_individual/DonorCard';
import { MOCK_PROJECTS } from '../../data/projectData';
import Spinner from '../common/Spinner';
import ProgressRing from '../common/ProgressRing';
import DonorDetailView from './donors_individual/DonorDetailView';
import { MicrophoneIcon } from '../icons/AiIcons';


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


// --- REDUCER FOR KANBAN/PIPELINE ---
type DonorsState = { donors: Donor[] };
type DonorsAction =
    | { type: 'MOVE_DONOR'; payload: { donorId: number; targetStageId: DonorStageId } }
    | { type: 'ADD_DONOR'; payload: Omit<Donor, 'id' | 'tasks' | 'totalDonated' | 'donationCount' | 'firstDonation' | 'lastDonation' | 'lastContact' | 'relationshipHealth' | 'stage'> }
    | { type: 'SET_TASK_COMPLETED'; payload: { donorId: number; taskId: string; completed: boolean } };

const LOCAL_STORAGE_KEY = 'mss2-erp-donors-data';

const getInitialState = (): DonorsState => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { donors: MOCK_DONORS };
  } catch (error) {
    console.error("Failed to load donors data from localStorage:", error);
    return { donors: MOCK_DONORS };
  }
};

const donorsReducer = (state: DonorsState, action: DonorsAction): DonorsState => {
    switch (action.type) {
        case 'MOVE_DONOR':
            return { ...state, donors: state.donors.map(d => d.id === action.payload.donorId ? { ...d, stage: action.payload.targetStageId } : d) };
        case 'ADD_DONOR':
            const newDonor: Donor = { ...action.payload, id: Math.max(0, ...state.donors.map(d => d.id)) + 1, stage: 'prospect', totalDonated: 0, donationCount: 0, firstDonation: '', lastDonation: '', lastContact: '', relationshipHealth: 'Moderate', tasks: [] };
            return { ...state, donors: [newDonor, ...state.donors] };
        case 'SET_TASK_COMPLETED':
            return { ...state, donors: state.donors.map(donor => donor.id === action.payload.donorId ? { ...donor, tasks: donor.tasks.map(task => task.id === action.payload.taskId ? { ...task, completed: action.payload.completed } : task) } : donor) };
        default: return state;
    }
};

// --- COMPONENTS FOR PARTNERSHIP OPPORTUNITIES ---

interface Match {
    donorId: string;
    alignmentScore: number;
    matchingCriteria: string[];
}

const AiCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

const CategoryCard: React.FC<{ category: string; count: number }> = ({ category, count }) => {
    const { t } = useLocalization();
    return (
        <div className="rounded-xl border dark:border-slate-700 bg-card dark:bg-dark-card p-4">
            <p className="text-sm text-gray-500">{getDonorCategoryLabel(category, t)}</p>
            <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
    );
};

const DraftApplicationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    donor: IndividualDonor;
}> = ({ isOpen, onClose, project, donor }) => {
    const { t, language } = useLocalization();
    const toast = useToast();
    const [draft, setDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const generateDraft = async () => {
                setIsGenerating(true);
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                    
                    const systemInstruction = `You are an expert grant writer for a non-profit. Your task is to write a concise, compelling, and professional initial grant proposal draft to an **individual donor**. The tone should be warm and personal. The response MUST be only the text of the proposal, with no extra explanations. The proposal should be in ${language}.`;
                    const prompt = `
                        Write an initial grant proposal draft to "${donor.fullName[language] || donor.fullName.en}" for the project "${project.name[language] || project.name.en}".

                        **Key Information to Include:**
                        - **Project Goal:** ${project.goal}
                        - **Project Objectives:** ${project.objectives.join(', ')}
                        - **Target Beneficiaries:** ${project.stakeholders.targetBeneficiaries}
                        - **Donor's Interests (for alignment):** ${donor.primaryProgramInterest}, ${donor.tags.join(', ')}

                        **Structure the proposal as follows:**
                        1. A warm, personal introduction acknowledging the donor's past interests and support.
                        2. A concise summary of the project, highlighting the problem it addresses and how it aligns with their interests.
                        3. A clear statement of the project's goal.
                        4. A concluding paragraph expressing hope for their continued partnership.
                        `;
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: { systemInstruction },
                    });

                    setDraft(response.text);

                } catch (error) {
                    console.error("Error generating draft:", error);
                    toast.showError(t('institutional_donors.opportunities.draftError'));
                    setDraft(t('institutional_donors.opportunities.draftError'));
                } finally {
                    setIsGenerating(false);
                }
            };
            generateDraft();
        }
    }, [isOpen, project, donor, language, t, toast]);

    const handleCopy = () => {
        navigator.clipboard.writeText(draft);
        toast.showSuccess(t('institutional_donors.opportunities.draftCopied'));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-3xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-primary" />
                        {t('institutional_donors.opportunities.draftTitle')}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Spinner text={t('institutional_donors.opportunities.generatingDraft')} />
                        </div>
                    ) : (
                        <textarea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            className="w-full h-96 p-3 border rounded-md bg-gray-50 dark:bg-slate-800/50 dark:border-slate-600 text-sm"
                            readOnly={isGenerating}
                        />
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-between items-center">
                    <p className="text-xs text-gray-500">{t('institutional_donors.opportunities.draftDisclaimer')}</p>
                    <div className="flex gap-3">
                        <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-slate-600 text-sm font-semibold">
                            <Copy size={16} /> {t('common.copy')}
                        </button>
                        <button onClick={() => toast.showInfo(t('donorManagement.messages.saveComingSoon'))} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark">
                            <Save size={16} /> {t('common.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MatchCard: React.FC<{
    donor: IndividualDonor;
    match: Match;
    onViewProfile: () => void;
    onPrepareDraft: () => void;
}> = ({ donor, match, onViewProfile, onPrepareDraft }) => {
    const { t, language } = useLocalization();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 flex flex-col"
        >
            <div className="p-4 flex items-center gap-4 border-b dark:border-slate-700/50">
                <img src={donor.avatar} alt={donor.fullName.en} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                <div>
                    <h4 className="font-bold text-foreground dark:text-dark-foreground">{donor.fullName[language] || donor.fullName.en}</h4>
                    <p className="text-xs text-gray-500">{donor.country}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-center items-center">
                <ProgressRing 
                    percentage={match.alignmentScore} 
                    label={t('institutional_donors.opportunities.alignmentScore')}
                    color={match.alignmentScore > 89 ? '#10B981' : match.alignmentScore > 69 ? '#F59E0B' : '#6B7280'}
                    size={120}
                />
                <div className="mt-4 text-center">
                    <h5 className="text-sm font-semibold mb-1">{t('institutional_donors.opportunities.matchingCriteria')}</h5>
                    <div className="flex flex-wrap justify-center gap-1">
                        {match.matchingCriteria.map((crit, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full">{crit}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl border-t dark:border-slate-700/50 flex gap-2">
                <button onClick={onViewProfile} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <Eye size={16} /> {t('institutional_donors.card.viewProfile')}
                </button>
                <button onClick={onPrepareDraft} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark">
                    <FileText size={16} /> {t('institutional_donors.opportunities.prepareDraft')}
                </button>
            </div>
        </motion.div>
    );
};

const PartnershipOpportunitiesTab: React.FC<{
    donors: IndividualDonor[];
    onSelectDonor: (donor: IndividualDonor) => void;
}> = ({ donors, onSelectDonor }) => {
    const { t, language } = useLocalization();
    const toast = useToast();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [draftingForMatch, setDraftingForMatch] = useState<Match | null>(null);

    const handleFindMatches = async () => {
        if (!selectedProjectId) {
            toast.showWarning(t('institutional_donors.opportunities.selectProjectWarning'));
            return;
        }
        setIsLoading(true);
        setMatches([]);
        
        const project = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
        if (!project) {
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const systemInstruction = `You are an expert grant matching AI for a non-profit. Your task is to analyze a single project and a list of **individual donors**. You must return a JSON object containing a list of the top 5 most suitable donors.

            For each match, you MUST provide:
            - 'donorId': The ID of the matched donor.
            - 'alignmentScore': A number from 0 to 100 representing how well the donor's interests align with the project.
            - 'matchingCriteria': An array of short strings explaining WHY they match (e.g., "Interest: Education", "Country: Turkey").

            Base your matching primarily on 'primaryProgramInterest' and 'tags'. Consider the donor's 'country' as a secondary factor.`;
            
            const prompt = `
            Project Details:
            - Type: ${project.type}
            - Location: ${project.location.country}
            - Goal: ${project.goal}

            List of Potential Donors:
            ${JSON.stringify(donors.map(d => ({ id: d.id, name: d.fullName.en, primaryProgramInterest: d.primaryProgramInterest, tags: d.tags, country: d.country })))}
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            matches: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        donorId: { type: Type.STRING },
                                        alignmentScore: { type: Type.NUMBER },
                                        matchingCriteria: { type: Type.ARRAY, items: { type: Type.STRING } }
                                    },
                                    required: ['donorId', 'alignmentScore', 'matchingCriteria']
                                }
                            }
                        }
                    }
                }
            });

            const result = JSON.parse(response.text.trim());
            setMatches(result.matches || []);

        } catch (error) {
            console.error("AI Matching Error:", error);
            toast.showError(t('institutional_donors.opportunities.matchError'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
    const draftingDonor = donors.find(d => d.id === draftingForMatch?.donorId);

    return (
        <>
            <div className="space-y-6">
                <AiCard title={t('institutional_donors.opportunities.title')} icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}>
                    <p className="text-sm text-gray-500 mb-4">{t('institutional_donors.opportunities.description')}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={selectedProjectId || ''}
                            onChange={e => setSelectedProjectId(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                        >
                            <option value="" disabled>{t('institutional_donors.opportunities.selectProject')}</option>
                            {MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name[language] || p.name.en}</option>)}
                        </select>
                        <button
                            onClick={handleFindMatches}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-400"
                        >
                            {isLoading ? <Spinner size="w-5 h-5" /> : <Search size={16} />}
                            {isLoading ? t('institutional_donors.opportunities.searching') : t('institutional_donors.opportunities.findMatches')}
                        </button>
                    </div>
                </AiCard>

                {isLoading && (
                    <div className="text-center py-10">
                        <Spinner text={t('institutional_donors.opportunities.aiWorking')} />
                    </div>
                )}

                {matches.length > 0 && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map(match => {
                            const donor = donors.find(d => d.id === match.donorId);
                            if (!donor) return null;
                            return (
                                <MatchCard 
                                    key={donor.id} 
                                    donor={donor} 
                                    match={match} 
                                    onViewProfile={() => onSelectDonor(donor)}
                                    onPrepareDraft={() => setDraftingForMatch(match)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {draftingForMatch && selectedProject && draftingDonor && (
                <DraftApplicationModal
                    isOpen={!!draftingForMatch}
                    onClose={() => setDraftingForMatch(null)}
                    project={selectedProject}
                    donor={draftingDonor}
                />
            )}
        </>
    );
};


// --- TAB COMPONENTS (contents of old pages) ---

const PipelineTab: React.FC<{
    donors: Donor[];
    dispatch: React.Dispatch<DonorsAction>;
    onAddDonor: () => void;
}> = ({ donors, dispatch, onAddDonor }) => {
    const { t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('All');
    
    const stages: { id: DonorStageId; titleKey: string; color: string; border: string; }[] = [
        { id: 'prospect', titleKey: 'donors.stages.prospect', color: 'bg-gray-100 dark:bg-slate-800/50', border: 'border-gray-400' },
        { id: 'contacted', titleKey: 'donors.stages.contacted', color: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-500' },
        { id: 'cultivating', titleKey: 'donors.stages.cultivating', color: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-500' },
        { id: 'solicited', titleKey: 'donors.stages.solicited', color: 'bg-purple-100 dark:bg-purple-900/20', border: 'border-purple-500' },
        { id: 'stewardship', titleKey: 'donors.stages.stewardship', color: 'bg-green-100 dark:bg-green-900/20', border: 'border-green-500' },
    ];
    
    const countryOptions = useMemo(() => ['All', ...Array.from(new Set(donors.map(d => d.country)))], [donors]);

    const filteredDonors = useMemo(() => {
        return donors.filter(donor => {
            const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = countryFilter === 'All' || donor.country === countryFilter;
            return matchesSearch && matchesCountry;
        });
    }, [donors, searchTerm, countryFilter]);

    const handleDragEnd = useCallback((donorId: number, targetStageId: DonorStageId) => {
        dispatch({ type: 'MOVE_DONOR', payload: { donorId, targetStageId } });
    }, [dispatch]);
    
    return (
        <div className="flex flex-col h-full">
            <DashboardControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                countryFilter={countryFilter}
                onCountryChange={setCountryFilter}
                countryOptions={countryOptions}
                onAddDonor={onAddDonor}
                view={'kanban'} // This is always kanban view
                onViewChange={() => {}} // No view change within this tab
            />
            <KanbanBoard
                donors={filteredDonors}
                stages={stages}
                onDragEnd={handleDragEnd}
                dispatch={dispatch}
            />
        </div>
    );
};

const DirectoryTab: React.FC = () => {
    const { t, language, dir } = useLocalization();
    const enrichedDonors = useMemo(() =>
        MOCK_INDIVIDUAL_DONORS.map(donor => classifyAndEnrichDonor(donor, MOCK_DONATIONS)),
    []);
    const [donors, setDonors] = useState<IndividualDonor[]>(enrichedDonors);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof IndividualDonor | null>('lastDonationDate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [view, setView] = useState<'list' | 'map' | 'card' | 'opportunities'>('list');
    const [selectedDonor, setSelectedDonor] = useState<IndividualDonor | null>(null);

    // Voice Search State
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const toast = useToast();

    // Speech Recognition Setup Effect
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setMicError(t('donorManagement.voice.notSupported'));
            return;
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                const errorMsg = t('donorManagement.voice.permissionDenied');
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
            const errorMsg = t('donorManagement.voice.startError');
            setMicError(errorMsg);
            toast.showError(errorMsg);
        }
    }, [isListening, language, t, toast]);

    const filteredAndSortedDonors = useMemo(() => {
        let filtered = donors.filter(donor => (donor.fullName[language] || donor.fullName.en).toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (sortColumn) {
            filtered.sort((a, b) => {
                const aVal = a[sortColumn];
                const bVal = b[sortColumn];

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                     if (sortColumn === 'lastDonationDate' || sortColumn === 'donorSince') {
                         if (!aVal) return 1;
                         if (!bVal) return -1;
                        return sortDirection === 'asc' ? new Date(aVal).getTime() - new Date(bVal).getTime() : new Date(bVal).getTime() - new Date(aVal).getTime();
                    }
                    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }

                if (sortColumn === 'fullName') {
                     const aName = a.fullName[language] || a.fullName.en;
                     const bName = b.fullName[language] || b.fullName.en;
                     return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
                }

                return 0;
            });
        }
        
        return filtered;
    }, [donors, searchTerm, sortColumn, sortDirection, language]);

     const handleSort = useCallback((column: keyof IndividualDonor) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }, [sortColumn]);

    const getButtonClass = (buttonView: 'list' | 'map' | 'card' | 'opportunities') => {
        return view === buttonView
            ? "p-2 bg-primary text-white rounded-md"
            : "p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md";
    };

    if (selectedDonor) {
        return <DonorDetailView donor={selectedDonor} onBack={() => setSelectedDonor(null)} />;
    }

    return (
        <div className="space-y-4">
             <div className="p-2 bg-gray-100 dark:bg-dark-card/50 rounded-lg flex items-center gap-2">
                {/* View Toggles */}
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                    <button onClick={() => setView('card')} className={getButtonClass('card')} aria-label={t('individual_donors.cardView')}><Users size={20} /></button>
                    <button onClick={() => setView('map')} className={getButtonClass('map')} aria-label={t('individual_donors.mapView')}><Map size={20} /></button>
                    <button onClick={() => setView('list')} className={getButtonClass('list')} aria-label={t('individual_donors.listView')}><List size={20}/></button>
                    <button onClick={() => setView('opportunities')} className={getButtonClass('opportunities')} aria-label={t('institutional_donors.opportunities.title')}><Briefcase size={20} /></button>
                </div>

                {/* Advanced Filters Button */}
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
                    <Filter size={16} />
                    <span>{t('donors.directory.advancedFilters')}</span>
                </button>

                {/* Search Bar */}
                <div className="relative flex-grow">
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        placeholder={isListening ? t('common.listening') : t('donors.directory.searchPlaceholder')}
                        className="w-full p-3 pr-10 pl-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                    />
                     <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        <button
                            onClick={handleListen}
                            disabled={!!micError}
                            title={micError || t('common.voiceSearch')}
                            className={`p-2 rounded-full transition-colors disabled:text-gray-400 disabled:cursor-not-allowed ${
                                isListening
                                    ? 'text-red-500 bg-red-100 dark:bg-red-900/50 animate-pulse'
                                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            {view === 'list' && (
                <DonorsTable
                    donors={filteredAndSortedDonors}
                    onDonorSelect={setSelectedDonor}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />
            )}
            {view === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedDonors.map(donor => (
                        <DonorCard key={donor.id} donor={donor} onClick={() => setSelectedDonor(donor)} />
                    ))}
                </div>
            )}
            {view === 'map' && (
                <div className="flex items-center justify-center h-96 bg-card dark:bg-dark-card rounded-xl shadow-inner">
                    <p className="text-gray-500">{t('donorManagement.messages.mapUnderConstruction')}</p>
                </div>
            )}
            {view === 'opportunities' && (
                <PartnershipOpportunitiesTab donors={donors} onSelectDonor={setSelectedDonor} />
            )}
        </div>
    );
};

const AnalyticsTab: React.FC<{ role: Role }> = ({ role }) => {
    const { t, language, dir } = useLocalization();
    const { donors, isLoading } = useDonorIntelligenceData();
    const [filters, setFilters] = useState({ search: '', category: 'all', program: 'all' });
    
    const CATEGORY_COLORS: Record<string, string> = { 'Hero Donor': '#FFD700', 'Recurring Donor': '#10B981', 'Seasonal Donor': '#3B82F6', 'Event Donor': '#F59E0B', 'Dormant Donor': '#6B7280', 'General Donor': '#9CA3AF', 'New Donor': '#A1A1AA' };
    const categoryCounts = useMemo(() => donors.reduce((acc, donor) => { if(donor.donorCategory) { acc[donor.donorCategory] = (acc[donor.donorCategory] || 0) + 1; } return acc; }, {} as Record<string, number>), [donors]);
    const pieChartData = useMemo(() => Object.entries(categoryCounts).map(([name, value]) => ({ name: getDonorCategoryLabel(name, t), value })), [categoryCounts, t]);

    return (
         <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.keys(CATEGORY_COLORS).map((category) => (
                            <CategoryCard key={category} category={category} count={categoryCounts[category] || 0} />
                        ))}
                    </div>
                </div>
                <div className="xl:col-span-2 bg-card dark:bg-dark-card rounded-2xl shadow-soft p-4 border dark:border-slate-700/50">
                     <h3 className="text-lg font-bold mb-2 text-center">{t('donorIntelligence.distributionChart')}</h3>
                     <div className="h-64 w-full">
                        <ResponsiveContainer>
                             <PieChart><Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[Object.keys(CATEGORY_COLORS).find(key => getDonorCategoryLabel(key, t) === entry.name) || '']} />)}</Pie><Tooltip /><Legend /></PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN HUB COMPONENT ---

const DonorHub: React.FC<{ role: Role }> = ({ role }) => {
    const { t, language } = useLocalization();
    const [state, dispatch] = useReducer(donorsReducer, getInitialState());
    const [activeTab, setActiveTab] = useState('directory');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const handleAddDonor = useCallback((donorData: Omit<Donor, 'id' | 'tasks' | 'totalDonated' | 'donationCount' | 'firstDonation' | 'lastDonation' | 'lastContact' | 'relationshipHealth' | 'stage'>) => {
        dispatch({ type: 'ADD_DONOR', payload: donorData });
    }, []);

    const funnelData = useMemo(() => {
        // Funnel data calculation logic from original DonorManagement...
        return [];
    }, [state.donors]);
    
    const tabs = [
        { id: 'pipeline', label: t('donors.tabs.pipeline') },
        { id: 'directory', label: t('donors.tabs.directory') },
        { id: 'analytics', label: t('donors.tabs.analytics') },
    ];

    return (
        <>
            <AddDonorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddDonor={handleAddDonor}
            />
            <div className="flex flex-col h-full animate-fade-in">
                <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-4">
                    {t('donors.hubTitle')}
                </h1>

                <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                
                <div className="mt-6 flex-grow">
                    {activeTab === 'pipeline' && <PipelineTab donors={state.donors} dispatch={dispatch} onAddDonor={() => setIsModalOpen(true)} />}
                    {activeTab === 'directory' && <DirectoryTab />}
                    {activeTab === 'analytics' && <AnalyticsTab role={role} />}
                </div>
            </div>
        </>
    );
};

export default DonorHub;