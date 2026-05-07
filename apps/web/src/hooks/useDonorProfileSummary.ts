import { useQuery } from '@tanstack/react-query';
import { MOCK_COMMUNICATIONS } from '../data/communicationsData';
import { MOCK_DONATIONS } from '../data/donationsData';
import { api } from '../lib/api';
import type {
    Communication,
    DonorProfileActivity,
    DonorProfileDocument,
    DonorProfileInteraction,
    DonorProfileSummary,
    DonorProfileTask,
    Donation,
    IndividualDonor,
    ProfileDonation,
} from '../types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: string) => UUID_RE.test(value);

interface ApiIndividualDonor {
    id: string;
    full_name_en: string;
    full_name_ar?: string | null;
    email: string;
    phone?: string | null;
    total_donations?: string | number | null;
    last_donation_date?: string | null;
    status: IndividualDonor['status'];
    tier: IndividualDonor['tier'];
    country?: string | null;
    tags?: unknown;
    assigned_manager?: string | null;
    avatar?: string | null;
    donor_since?: string | null;
    donor_category?: string | null;
    donations_count?: number | null;
    avg_gift?: string | number | null;
    avg_days_between_donations?: string | number | null;
    primary_program_interest?: string | null;
    custom_fields?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

const asNumber = (value: unknown): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const asOptionalNumber = (value: unknown): number | undefined => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const asString = (value: unknown): string | undefined => typeof value === 'string' && value.trim() ? value : undefined;

const normalizeDonorCategory = (value: string | null | undefined): IndividualDonor['donorCategory'] | undefined => {
    if (!value) return undefined;
    const aliases: Record<string, IndividualDonor['donorCategory']> = {
        Hero: 'Hero Donor',
        Recurring: 'Recurring Donor',
        Seasonal: 'Seasonal Donor',
        Event: 'Event Donor',
        Dormant: 'Dormant Donor',
        General: 'General Donor',
        New: 'New Donor',
    };
    return aliases[value] || (value as IndividualDonor['donorCategory']);
};

export const mapApiDonorToIndividualDonor = (row: ApiIndividualDonor): IndividualDonor => {
    const customFields = isRecord(row.custom_fields) ? row.custom_fields : {};
    const fullNameEn = row.full_name_en || 'Unnamed donor';
    const tags = Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === 'string') : [];
    const donorType = asString(customFields.donor_type) as IndividualDonor['donorType'] | undefined;
    const donorCategory = normalizeDonorCategory(row.donor_category);
    const inferredDonorType: IndividualDonor['donorType'] = row.tier === 'Major Donor'
        ? 'Major Donor'
        : donorCategory === 'Recurring Donor'
            ? 'Recurring'
            : 'Individual';
    const pipelineStage = asString(customFields.pipeline_stage) as IndividualDonor['relationshipStage'] | undefined;
    const askAmount = asOptionalNumber(customFields.ask_amount) ?? asOptionalNumber(customFields.suggested_ask_amount);

    return {
        id: row.id,
        fullName: {
            en: fullNameEn,
            ar: row.full_name_ar || fullNameEn,
        },
        email: row.email,
        phone: row.phone || '',
        totalDonations: asNumber(row.total_donations),
        lastDonationDate: row.last_donation_date || '',
        status: row.status,
        tier: row.tier,
        country: row.country || '',
        tags,
        assignedManager: row.assigned_manager || '',
        avatar: row.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(row.email)}`,
        donorSince: row.donor_since || '',
        donorCategory,
        donationsCount: row.donations_count || 0,
        avgGift: asOptionalNumber(row.avg_gift),
        averageDaysBetweenDonations: asOptionalNumber(row.avg_days_between_donations),
        primaryProgramInterest: row.primary_program_interest || undefined,
        donorType: donorType || inferredDonorType,
        relationshipStage: pipelineStage,
        relationshipHealth: asString(customFields.relationship_health) as IndividualDonor['relationshipHealth'] | undefined,
        relationshipLikelihood: asString(customFields.relationship_likelihood) as IndividualDonor['relationshipLikelihood'] | undefined,
        stageEnteredAt: asString(customFields.stage_entered_at),
        potentialGift: asOptionalNumber(customFields.potential_gift),
        suggestedAskAmount: askAmount,
        currentProposal: asString(customFields.current_proposal),
        askDate: asString(customFields.ask_date),
        pledgeAmount: asOptionalNumber(customFields.pledge_amount),
        pledgeStatus: asString(customFields.pledge_status) as IndividualDonor['pledgeStatus'] | undefined,
        expectedCloseDate: asString(customFields.expected_close_date),
        lostReason: asString(customFields.lost_reason),
        relationshipNotes: asString(customFields.relationship_notes),
    };
};

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

async function fetchProfileRecord(donorId: string): Promise<IndividualDonor> {
    return mapApiDonorToIndividualDonor(await api.get<ApiIndividualDonor>(`/donors/${donorId}`));
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

const toFallbackProfileDocument = (document: NonNullable<IndividualDonor['documents']>[number]): DonorProfileDocument => ({
    id: document.id,
    donor_id: '',
    filename: document.title,
    file_url: '#',
    label: document.type,
    uploaded_at: document.date,
    custom_fields: {},
});

async function fetchProfileDocuments(donorId: string, fallbackDonor?: IndividualDonor): Promise<DonorProfileDocument[]> {
    if (!isUuid(donorId)) {
        return (fallbackDonor?.documents || []).map(toFallbackProfileDocument);
    }

    try {
        return await api.get<DonorProfileDocument[]>(`/donors/${donorId}/documents`);
    } catch {
        return (fallbackDonor?.documents || []).map(toFallbackProfileDocument);
    }
}

export async function uploadDonorProfileDocument(donorId: string, file: File, label: string): Promise<DonorProfileDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('label', label);
    return api.upload<DonorProfileDocument>(`/donors/${donorId}/documents`, formData);
}

export async function deleteDonorProfileDocument(donorId: string, documentId: string): Promise<{ ok: true }> {
    return api.delete<{ ok: true }>(`/donors/${donorId}/documents/${documentId}`);
}

export const useDonorProfileRecord = (donorId: string, fallbackDonor?: IndividualDonor) => useQuery({
    queryKey: ['donor-profile-record', donorId],
    queryFn: () => fetchProfileRecord(donorId),
    enabled: isUuid(donorId),
    initialData: fallbackDonor,
});

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

export const useDonorProfileDocuments = (donorId: string, fallbackDonor?: IndividualDonor) => useQuery({
    queryKey: ['donor-profile-documents', donorId],
    queryFn: () => fetchProfileDocuments(donorId, fallbackDonor),
});
