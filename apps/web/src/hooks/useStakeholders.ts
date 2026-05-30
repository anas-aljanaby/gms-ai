import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Stakeholder } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { buildOptimisticStakeholder } from '../lib/stakeholderOptimistic';

export const STAKEHOLDERS_QUERY_KEY = ['stakeholders'] as const;

export interface StakeholderFormInput {
    name: {
        en: string;
        ar: string;
    };
    type: Stakeholder['type'];
    category: Stakeholder['category'];
    country: string;
    email: string;
    phone: string;
}

export interface ApiStakeholder {
    id: string;
    name: {
        en: string;
        ar: string;
    };
    type: Stakeholder['type'];
    category: Stakeholder['category'];
    status: Stakeholder['status'];
    classification: Stakeholder['classification'];
    email: string;
    phone: string;
    country: string;
    healthScore: number;
    engagementScore: number;
    relationshipLevel: Stakeholder['relationshipLevel'];
    riskLevel: Stakeholder['riskLevel'];
    riskProfile: Stakeholder['riskProfile'];
    power: number;
    interest: number;
    aiInsights: string;
    lastContact: string;
    needs: string[];
    totalDonations?: number;
    supportReceived?: number;
    partnershipValue?: number;
}

function asNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function asName(value: unknown): Stakeholder['name'] {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { en: '', ar: '' };
    }
    const record = value as Record<string, unknown>;
    const en = typeof record.en === 'string' ? record.en : '';
    const ar = typeof record.ar === 'string' ? record.ar : en;
    return { en, ar };
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string');
}

export function mapApiStakeholderToStakeholder(row: ApiStakeholder): Stakeholder {
    return {
        id: row.id,
        name: asName(row.name),
        type: row.type,
        category: row.category,
        status: row.status,
        classification: row.classification,
        email: row.email || '',
        phone: row.phone || '',
        country: row.country || '',
        healthScore: asNumber(row.healthScore),
        engagementScore: asNumber(row.engagementScore),
        relationshipLevel: row.relationshipLevel,
        riskLevel: row.riskLevel,
        riskProfile: row.riskProfile,
        power: asNumber(row.power),
        interest: asNumber(row.interest),
        aiInsights: row.aiInsights || 'stakeholder_management.insights.newly_added',
        lastContact: row.lastContact || new Date().toISOString(),
        needs: asStringArray(row.needs),
        totalDonations: row.totalDonations,
        supportReceived: row.supportReceived,
        partnershipValue: row.partnershipValue,
    };
}

export async function fetchStakeholdersList(): Promise<Stakeholder[]> {
    const rows = await api.get<ApiStakeholder[]>('/stakeholders');
    return rows.map(mapApiStakeholderToStakeholder);
}

export async function createStakeholderApi(input: StakeholderFormInput): Promise<Stakeholder> {
    const row = await api.post<ApiStakeholder>('/stakeholders', {
        name: {
            en: input.name.en.trim(),
            ar: input.name.ar.trim(),
        },
        type: input.type,
        category: input.category,
        status: 'active',
        classification: 'secondary',
        email: input.email.trim(),
        phone: input.phone.trim(),
        country: input.country.trim(),
    });
    return mapApiStakeholderToStakeholder(row);
}

export type StakeholderUpdateInput = Pick<Stakeholder, 'id'> & Partial<Stakeholder>;

export async function updateStakeholderApi(input: StakeholderUpdateInput): Promise<Stakeholder> {
    const row = await api.patch<ApiStakeholder>(`/stakeholders/${input.id}`, {
        ...(input.name ? { name: input.name } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.classification !== undefined ? { classification: input.classification } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(input.country !== undefined ? { country: input.country } : {}),
        ...(input.healthScore !== undefined ? { healthScore: input.healthScore } : {}),
        ...(input.engagementScore !== undefined ? { engagementScore: input.engagementScore } : {}),
        ...(input.relationshipLevel !== undefined ? { relationshipLevel: input.relationshipLevel } : {}),
        ...(input.riskLevel !== undefined ? { riskLevel: input.riskLevel } : {}),
        ...(input.riskProfile !== undefined ? { riskProfile: input.riskProfile } : {}),
        ...(input.power !== undefined ? { power: input.power } : {}),
        ...(input.interest !== undefined ? { interest: input.interest } : {}),
        ...(input.aiInsights !== undefined ? { aiInsights: input.aiInsights } : {}),
        ...(input.lastContact !== undefined ? { lastContact: input.lastContact } : {}),
        ...(input.needs !== undefined ? { needs: input.needs } : {}),
        ...(input.totalDonations !== undefined ? { totalDonations: input.totalDonations } : {}),
        ...(input.supportReceived !== undefined ? { supportReceived: input.supportReceived } : {}),
        ...(input.partnershipValue !== undefined ? { partnershipValue: input.partnershipValue } : {}),
    });
    return mapApiStakeholderToStakeholder(row);
}

export async function deleteStakeholderApi(id: Stakeholder['id']): Promise<void> {
    await api.delete<{ ok: true }>(`/stakeholders/${id}`);
}

export const useStakeholders = () => {
    const { user, loading: authLoading } = useAuth();

    return useQuery({
        queryKey: STAKEHOLDERS_QUERY_KEY,
        queryFn: fetchStakeholdersList,
        enabled: !authLoading && !!user,
    });
};

export const useCreateStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStakeholderApi,
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
            const previous = queryClient.getQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY);
            const optimistic = buildOptimisticStakeholder(input);
            queryClient.setQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY, (old) => [
                optimistic,
                ...(old ?? []),
            ]);
            return { previous, optimisticId: optimistic.id };
        },
        onSuccess: (created, _input, context) => {
            queryClient.setQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY, (old) => {
                const list = old ?? [];
                const withoutOptimistic = context?.optimisticId
                    ? list.filter((row) => row.id !== context.optimisticId)
                    : list.filter((row) => row.id !== created.id);
                return [created, ...withoutOptimistic];
            });
        },
        onError: (_error, _input, context) => {
            queryClient.setQueryData(STAKEHOLDERS_QUERY_KEY, context?.previous ?? []);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
        },
    });
};

export const useUpdateStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStakeholderApi,
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
            const previous = queryClient.getQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY);
            queryClient.setQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY, (old) =>
                (old ?? []).map((row) => (row.id === input.id ? { ...row, ...input } : row)),
            );
            return { previous };
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY, (old) =>
                (old ?? []).map((row) => (row.id === updated.id ? updated : row)),
            );
        },
        onError: (_error, _input, context) => {
            queryClient.setQueryData(STAKEHOLDERS_QUERY_KEY, context?.previous ?? []);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
        },
    });
};

export const useDeleteStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStakeholderApi,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
            const previous = queryClient.getQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY);
            queryClient.setQueryData<Stakeholder[]>(STAKEHOLDERS_QUERY_KEY, (old) =>
                (old ?? []).filter((row) => row.id !== id),
            );
            return { previous };
        },
        onError: (_error, _input, context) => {
            queryClient.setQueryData(STAKEHOLDERS_QUERY_KEY, context?.previous ?? []);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: STAKEHOLDERS_QUERY_KEY });
        },
    });
};
