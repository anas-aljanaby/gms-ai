
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import type { Project, InstitutionalDonor } from '../../../types';
import { MOCK_PROJECTS } from '../../../data/projectData';
import AiCard from '../ai/AiCard';
import Spinner from '../../common/Spinner';
import { Lightbulb, Search } from 'lucide-react';
import MatchCard from './MatchCard';
import DraftApplicationModal from './DraftApplicationModal';

interface PartnershipOpportunitiesTabProps {
    donors: InstitutionalDonor[];
    onSelectDonor: (donor: InstitutionalDonor) => void;
}

interface Match {
    donorId: string;
    alignmentScore: number;
    matchingCriteria: string[];
}

const PartnershipOpportunitiesTab: React.FC<PartnershipOpportunitiesTabProps> = ({ donors, onSelectDonor }) => {
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
            
            const systemInstruction = `You are an expert grant matching AI for a non-profit. Your task is to analyze a single project and a list of institutional donors. You must return a JSON object containing a list of the top 5 most suitable donors.

For each match, you MUST provide:
- 'donorId': The ID of the matched donor.
- 'alignmentScore': A number from 0 to 100 representing how well the donor's focus aligns with the project. A score of 90+ is excellent, 70-89 is good, 50-69 is fair.
- 'matchingCriteria': An array of short strings explaining WHY they match (e.g., "Focus Area: Education", "Geographic Focus: Global").

Base your matching primarily on 'focusAreas' and 'geographicFocus'. Consider the donor 'type' as a secondary factor.`;

            const prompt = `
            Project Details:
            - Type: ${project.type}
            - Location: ${project.location.country}, ${project.location.city}
            - Goal: ${project.goal}

            List of Potential Donors:
            ${JSON.stringify(donors.map(d => ({ id: d.id, name: d.organizationName.en, type: d.type, focusAreas: d.focusAreas, geographicFocus: d.geographicFocus })))}
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

export default PartnershipOpportunitiesTab;
