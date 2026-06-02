import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InstitutionalDonor } from '../types';
import { api } from '../lib/api';

export interface InstitutionalDonorContact {
    id: string;
    name: string;
    position: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    isPrimary: boolean;
    photoUrl?: string;
}

export interface InstitutionalDonorDocument {
    id: string;
    filename: string;
    file_url: string;
    label: string;
    content_type?: string | null;
    size_bytes?: number | null;
    uploaded_at: string | null;
}

export interface InstitutionalGrant {
    id: string;
    date: string | null;
    end_date: string | null;
    amount: number;
    received_amount: number;
    currency: string;
    type: 'Restricted' | 'Unrestricted';
    title: string;
    project_beneficiary: string;
    status: string;
}

type ApiInstitutionalDonor = {
    id: string;
    organizationName: { en: string; ar: string };
    logo: string;
    type: InstitutionalDonor['type'];
    primaryContact: { name: string; email: string };
    totalGrantsAwarded: number;
    activeGrants: number;
    nextDeadline: string;
    relationshipStatus: InstitutionalDonor['relationshipStatus'];
    focusAreas: string[];
    geographicFocus: string[];
    assignedManager: string;
    priority: InstitutionalDonor['priority'];
    country: string;
    lastContactDate: string;
    createdDate: string;
    registrationNumber?: string;
    city?: string;
    establishmentDate?: string;
    phone?: string;
    website?: string;
    socialMedia?: { linkedin?: string; twitter?: string; facebook?: string };
    address?: string;
    coordinates?: { lat: number; lng: number };
    contacts?: InstitutionalDonorContact[];
};

const INSTITUTIONAL_DONORS_QUERY_KEY = ['institutional-donors'] as const;

function mapApiInstitutionalDonor(row: ApiInstitutionalDonor): InstitutionalDonor {
    return {
        ...row,
        contacts: row.contacts ?? [],
    };
}

export const useInstitutionalDonors = () => useQuery({
    queryKey: INSTITUTIONAL_DONORS_QUERY_KEY,
    queryFn: async () => {
        const rows = await api.get<ApiInstitutionalDonor[]>('/institutional-donors');
        return rows.map(mapApiInstitutionalDonor);
    },
});

export type CreateInstitutionalDonorInput = {
    name_en: string;
    name_ar: string;
    type: InstitutionalDonor['type'];
    relationship_status: InstitutionalDonor['relationshipStatus'];
    priority: InstitutionalDonor['priority'];
    assigned_manager: string;
    primary_contact_name: string;
    primary_contact_email: string;
    focus_areas: string[];
    geographic_focus: string[];
    country: string;
    custom_fields: Record<string, unknown>;
};

export const useCreateInstitutionalDonor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateInstitutionalDonorInput) => api.post<ApiInstitutionalDonor>('/institutional-donors', input),
        onSuccess: (created) => {
            queryClient.setQueryData<InstitutionalDonor[]>(INSTITUTIONAL_DONORS_QUERY_KEY, (old) => [mapApiInstitutionalDonor(created), ...(old ?? [])]);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: INSTITUTIONAL_DONORS_QUERY_KEY });
        },
    });
};

export const useUpdateInstitutionalDonor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vars: { donorId: string; payload: Record<string, unknown> }) => api.patch<ApiInstitutionalDonor>(`/institutional-donors/${vars.donorId}`, vars.payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: INSTITUTIONAL_DONORS_QUERY_KEY });
        },
    });
};

export const useDeleteInstitutionalDonor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donorId: string) => api.delete<{ ok: true }>(`/institutional-donors/${donorId}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: INSTITUTIONAL_DONORS_QUERY_KEY });
        },
    });
};

export const useInstitutionalDonorContacts = (donorId: string) => useQuery({
    queryKey: ['institutional-donor-contacts', donorId],
    queryFn: () => api.get<InstitutionalDonorContact[]>(`/institutional-donors/${donorId}/contacts`),
    enabled: !!donorId,
});

export const useCreateInstitutionalDonorContact = (donorId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) => api.post<InstitutionalDonorContact>(`/institutional-donors/${donorId}/contacts`, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['institutional-donor-contacts', donorId] });
            void queryClient.invalidateQueries({ queryKey: INSTITUTIONAL_DONORS_QUERY_KEY });
        },
    });
};

export const useDeleteInstitutionalDonorContact = (donorId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contactId: string) => api.delete<{ ok: true }>(`/institutional-donors/${donorId}/contacts/${contactId}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['institutional-donor-contacts', donorId] });
            void queryClient.invalidateQueries({ queryKey: INSTITUTIONAL_DONORS_QUERY_KEY });
        },
    });
};

export const useInstitutionalDonorDocuments = (donorId: string) => useQuery({
    queryKey: ['institutional-donor-documents', donorId],
    queryFn: () => api.get<InstitutionalDonorDocument[]>(`/institutional-donors/${donorId}/documents`),
    enabled: !!donorId,
});

export const useUploadInstitutionalDonorDocument = (donorId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, label }: { file: File; label?: string }) => {
            const form = new FormData();
            form.append('file', file);
            if (label) form.append('label', label);
            return api.upload<InstitutionalDonorDocument>(`/institutional-donors/${donorId}/documents`, form);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['institutional-donor-documents', donorId] });
        },
    });
};

export const useDeleteInstitutionalDonorDocument = (donorId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (documentId: string) => api.delete<{ ok: true }>(`/institutional-donors/${donorId}/documents/${documentId}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['institutional-donor-documents', donorId] });
        },
    });
};

export const useInstitutionalDonorGrants = (donorId: string) => useQuery({
    queryKey: ['institutional-donor-grants', donorId],
    queryFn: () => api.get<InstitutionalGrant[]>(`/institutional-donors/${donorId}/grants`),
    enabled: !!donorId,
});
