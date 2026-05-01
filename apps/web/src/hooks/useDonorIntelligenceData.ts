import { useCachedData } from './useCachedData';
import type { IndividualDonor } from '../types';
import { MOCK_INDIVIDUAL_DONORS } from '../data/individualDonorsData';
import { MOCK_DONATIONS } from '../data/donationsData';
import { classifyAndEnrichDonor } from '../lib/donorIntelligence';

const intelligenceFetcher = async (): Promise<IndividualDonor[]> => {
    // This is the async data-fetching/processing logic
    return new Promise(resolve => {
        setTimeout(() => {
            const classifiedDonors = MOCK_INDIVIDUAL_DONORS.map(donor => 
                classifyAndEnrichDonor(donor, MOCK_DONATIONS)
            );
            resolve(classifiedDonors);
        }, 500); // Simulate processing delay
    });
};

export const useDonorIntelligenceData = () => {
    const { data, loading, refetch } = useCachedData<IndividualDonor[]>('donor-intelligence-data', intelligenceFetcher);

    return {
        donors: data || [], // Return empty array while loading for the first time
        isLoading: loading,
        updateClassifications: refetch, // Map refetch to the existing API
    };
};
