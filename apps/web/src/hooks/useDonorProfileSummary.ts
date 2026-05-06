import { useQuery } from '@tanstack/react-query';
import { MOCK_COMMUNICATIONS } from '../data/communicationsData';
import { MOCK_DONATIONS } from '../data/donationsData';
import { api } from '../lib/api';
import type {
    Communication,
    DonorProfileActivity,
    DonorProfileInteraction,
    DonorProfileSummary,
    DonorProfileTask,
    Donation,
    IndividualDonor,
    ProfileDonation,
} from '../types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: string) => UUID_RE.test(value);

const toProfileDonation = (donation: Donation): ProfileDonation => ({
    id: donation.id,
    donor_id: donation.donorId,
    amount: donation.amount,
    date: donation.date,
    program: donation.program,
    designation: donation.program,
    status: 'posted',
    receipt_state: 'not_sent',
    refund_state: 'none',
});

const toProfileInteraction = (communication: Communication): DonorProfileInteraction => ({
    id: communication.communication_id,
    donor_id: communication.donor_id,
    interaction_type: communication.communication_type,
    occurred_at: communication.sent_at,
    subject: communication.subject,
    status: communication.status,
});

const buildFallbackSummary = (donor: IndividualDonor): DonorProfileSummary => {
    const donations = MOCK_DONATIONS.filter((donation) => donation.donorId === donor.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const communications = MOCK_COMMUNICATIONS.filter((communication) => communication.donor_id === donor.id).sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
    const lifetimeGiving = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalGifts = donations.length;
    const programsSupported = Array.from(new Set(donations.map((donation) => donation.program).filter(Boolean)));
    const openTasks = donor.relationshipTasks?.filter((task) => !task.completed) || [];
    const nextAction = openTasks
        .slice()
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const lastGift = donations[0];
    const lastContact = communications[0];
    const recentActivity: DonorProfileActivity[] = [
        ...donations.map((donation) => ({
            id: donation.id,
            type: 'donation' as const,
            occurred_at: donation.date,
            title: donation.program || 'Donation',
            amount: donation.amount,
            status: 'posted',
        })),
        ...communications.map((communication) => ({
            id: communication.communication_id,
            type: 'interaction' as const,
            occurred_at: communication.sent_at,
            title: communication.subject,
            channel: communication.communication_type,
            status: communication.status,
        })),
        ...(donor.relationshipTasks || []).map((task) => ({
            id: task.id,
            type: task.completed ? 'task_completed' as const : 'task_created' as const,
            occurred_at: task.dueDate,
            title: task.text,
            status: task.completed ? 'completed' : 'open',
        })),
    ]
        .filter((activity) => !!activity.occurred_at)
        .sort((a, b) => new Date(b.occurred_at || '').getTime() - new Date(a.occurred_at || '').getTime())
        .slice(0, 8);

    return {
        donor: {
            id: donor.id,
            full_name_en: donor.fullName.en,
            full_name_ar: donor.fullName.ar,
            email: donor.email,
            phone: donor.phone,
            status: donor.status,
            tier: donor.tier,
            country: donor.country,
            tags: donor.tags || [],
            assigned_manager: donor.assignedManager,
            avatar: donor.avatar,
            donor_since: donor.donorSince || null,
            donor_category: donor.donorCategory || null,
            primary_program_interest: donor.primaryProgramInterest || null,
            custom_fields: {},
        },
        giving: {
            lifetimeGiving,
            totalGifts,
            lastGiftAmount: lastGift?.amount ?? null,
            lastGiftDate: lastGift?.date ?? donor.lastDonationDate ?? null,
            averageGift: totalGifts > 0 ? lifetimeGiving / totalGifts : null,
            largestGift: totalGifts > 0 ? Math.max(...donations.map((donation) => donation.amount)) : null,
            programsSupported,
            currentGivingStatus: totalGifts === 0 ? 'no_gifts' : donor.status === 'Lapsed' ? 'lapsed' : donor.recurringGiftStatus === 'Active' ? 'recurring' : 'active',
        },
        relationship: {
            owner: donor.assignedManager,
            pipelineStage: donor.relationshipStage || 'prospect',
            stageEnteredAt: donor.stageEnteredAt || donor.donorSince || null,
            health: donor.relationshipHealth || null,
            likelihood: donor.relationshipLikelihood || null,
            lastContact: lastContact ? toProfileInteraction(lastContact) : null,
            openTaskCount: openTasks.length,
        },
        nextAction: nextAction ? {
            id: nextAction.id,
            donor_id: donor.id,
            text: nextAction.text,
            type: nextAction.type,
            assigned_to: nextAction.assignedTo,
            due_date: nextAction.dueDate,
            completed: nextAction.completed,
        } : null,
        recentActivity,
        computed: {
            suggestedAskAmount: donor.suggestedAskAmount ?? null,
            suggestedAskSource: donor.suggestedAskAmount ? 'manual_override' : 'unavailable',
            suggestedAskConfidence: donor.suggestedAskAmount ? 'manager' : 'not_enough_data',
            relationshipHealthSource: donor.relationshipHealth ? 'manual_override' : 'unavailable',
        },
        sourceMeta: {
            giving: 'fallback_donations',
            tasks: 'fallback_tasks',
            lastContact: 'fallback_communications',
            pipeline: 'fallback_profile',
        },
    };
};

async function fetchProfileSummary(donorId: string, fallbackDonor: IndividualDonor): Promise<DonorProfileSummary> {
    if (!isUuid(donorId)) return buildFallbackSummary(fallbackDonor);

    try {
        return await api.get<DonorProfileSummary>(`/donors/${donorId}/profile-summary`);
    } catch {
        return buildFallbackSummary(fallbackDonor);
    }
}

async function fetchProfileDonations(donorId: string): Promise<ProfileDonation[]> {
    if (!isUuid(donorId)) {
        return MOCK_DONATIONS.filter((donation) => donation.donorId === donorId).map(toProfileDonation);
    }

    try {
        return await api.get<ProfileDonation[]>(`/donors/${donorId}/donations`);
    } catch {
        return MOCK_DONATIONS.filter((donation) => donation.donorId === donorId).map(toProfileDonation);
    }
}

async function fetchProfileTasks(donorId: string, fallbackDonor: IndividualDonor): Promise<DonorProfileTask[]> {
    if (!isUuid(donorId)) {
        return (fallbackDonor.relationshipTasks || []).map((task) => ({
            id: task.id,
            donor_id: donorId,
            text: task.text,
            type: task.type,
            assigned_to: task.assignedTo,
            due_date: task.dueDate,
            completed: task.completed,
        }));
    }

    try {
        return await api.get<DonorProfileTask[]>(`/donors/${donorId}/tasks`);
    } catch {
        return [];
    }
}

async function fetchProfileInteractions(donorId: string): Promise<DonorProfileInteraction[]> {
    if (!isUuid(donorId)) {
        return MOCK_COMMUNICATIONS.filter((communication) => communication.donor_id === donorId).map(toProfileInteraction);
    }

    try {
        return await api.get<DonorProfileInteraction[]>(`/donors/${donorId}/interactions`);
    } catch {
        return MOCK_COMMUNICATIONS.filter((communication) => communication.donor_id === donorId).map(toProfileInteraction);
    }
}

export const useDonorProfileSummary = (donorId: string, fallbackDonor: IndividualDonor) => useQuery({
    queryKey: ['donor-profile-summary', donorId],
    queryFn: () => fetchProfileSummary(donorId, fallbackDonor),
});

export const useDonorProfileDonations = (donorId: string) => useQuery({
    queryKey: ['donor-profile-donations', donorId],
    queryFn: () => fetchProfileDonations(donorId),
});

export const useDonorProfileTasks = (donorId: string, fallbackDonor: IndividualDonor) => useQuery({
    queryKey: ['donor-profile-tasks', donorId],
    queryFn: () => fetchProfileTasks(donorId, fallbackDonor),
});

export const useDonorProfileInteractions = (donorId: string) => useQuery({
    queryKey: ['donor-profile-interactions', donorId],
    queryFn: () => fetchProfileInteractions(donorId),
});
