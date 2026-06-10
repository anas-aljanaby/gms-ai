import { useMemo } from 'react';
import type { RbacModule } from '@gms/shared';
import { usePermissions } from './usePermissions';
import { useOrg } from '../contexts/OrgContext';
import {
    PLATFORM_MODULE,
    buildSidebarModulesFromOrg,
} from '../moduleRegistry';
import { useOrgModules } from './useOrgModules';

const UNGATED_MODULES = new Set(['help']);

export function useVisibleSidebarModules() {
    const { can, isPlatformAdmin } = usePermissions();
    const { isImpersonating } = useOrg();
    const { data: orgModules = [], isLoading } = useOrgModules();

    const visibleModules = useMemo(() => {
        const fromOrg = buildSidebarModulesFromOrg(orgModules);
        const filtered = fromOrg.filter((module) => {
            if (UNGATED_MODULES.has(module.key)) return true;
            return can(module.key as RbacModule, 'read');
        });

        if (!isPlatformAdmin || isImpersonating) return filtered;

        const settingsIndex = filtered.findIndex((module) => module.key === 'settings');
        const platformEntry = { key: PLATFORM_MODULE.key, icon: PLATFORM_MODULE.icon };

        if (settingsIndex === -1) {
            return [...filtered, platformEntry];
        }

        return [
            ...filtered.slice(0, settingsIndex),
            platformEntry,
            ...filtered.slice(settingsIndex),
        ];
    }, [orgModules, can, isPlatformAdmin, isImpersonating]);

    return { visibleModules, orgModules, isLoading };
}
