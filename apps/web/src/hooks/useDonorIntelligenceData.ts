import { useQuery } from '@tanstack/react-query';
import type { IndividualDonor } from '../types';
import { MOCK_INDIVIDUAL_DONORS } from '../data/individualDonorsData';
import { MOCK_DONATIONS } from '../data/donationsData';
import { classifyAndEnrichDonor } from '../lib/donorIntelligence';
import { api } from '../lib/api';
import type { IndividualDonor as ApiDonor } from '@gms/shared';

function apiDonorToFrontend(d: ApiDonor): IndividualDonor {
    return {
        id: d.id,
        fullName: { en: d.full_name_en, ar: d.full_name_ar || d.full_name_en },
        email: d.email,
        phone: d.phone || '',
        totalDonations: Number(d.total_donations),
        lastDonationDate: d.last_donation_date || '',
        status: d.status as IndividualDonor['status'],
        tier: d.tier as IndividualDonor['tier'],
        country: d.country || '',
        tags: (d.tags as string[]) || [],
        assignedManager: d.assigned_manager || '',
        avatar: d.avatar || '',
        donorSince: d.donor_since || '',
        donorCategory: d.donor_category as IndividualDonor['donorCategory'],
        donationsCount: d.donations_count,
        avgGift: d.avg_gift ?? undefined,
        averageDaysBetweenDonations: d.avg_days_between_donations ?? undefined,
        primaryProgramInterest: d.primary_program_interest ?? undefined,
    };
}

async function fetchDonors(): Promise<IndividualDonor[]> {
    try {
        const apiDonors = await api.get<ApiDonor[]>('/donors');
        if (apiDonors.length > 0) {
            return apiDonors.map(apiDonorToFrontend);
        }
    } catch {
        // API unavailable or user not authenticated — fall through to mock
    }

    return MOCK_INDIVIDUAL_DONORS.map(donor =>
        classifyAndEnrichDonor(donor, MOCK_DONATIONS)
    );
}

export const useDonorIntelligenceData = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['donors'],
        queryFn: fetchDonors,
    });

    return {
        donors: data || [],
        isLoading,
        updateClassifications: refetch,
    };
};
