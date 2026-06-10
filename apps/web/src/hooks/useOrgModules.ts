import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OrgModule, OrgModuleUpdateItem, PatchOrgModules } from '@gms/shared';
import { api } from '../lib/api';
import { useOrg } from '../contexts/OrgContext';

export const ORG_MODULES_KEY = ['modules'] as const;

export function orgModulesQueryKey(orgId: string | null) {
    return [...ORG_MODULES_KEY, orgId] as const;
}

export function useOrgModules(orgIdOverride?: string | null) {
    const { activeOrgId, ready } = useOrg();
    const orgId = orgIdOverride ?? activeOrgId;

    return useQuery({
        queryKey: orgModulesQueryKey(orgId),
        queryFn: () => api.get<OrgModule[]>('/modules', orgId ?? undefined),
        enabled: ready && !!orgId,
    });
}

export function usePatchOrgModules(orgIdOverride?: string | null) {
    const queryClient = useQueryClient();
    const { activeOrgId: contextOrgId } = useOrg();
    const orgId = orgIdOverride ?? contextOrgId;

    return useMutation({
        mutationFn: (body: PatchOrgModules) =>
            api.patch<OrgModule[]>('/modules', body, orgId ?? undefined),
        onSuccess: (data) => {
            if (orgId) {
                queryClient.setQueryData(orgModulesQueryKey(orgId), data);
            }
            void queryClient.invalidateQueries({ queryKey: [...ORG_MODULES_KEY] });
        },
    });
}

export function buildPatchPayload(updates: OrgModuleUpdateItem[]): PatchOrgModules {
    return { modules: updates };
}
