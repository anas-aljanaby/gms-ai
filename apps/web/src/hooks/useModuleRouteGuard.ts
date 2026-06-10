import { useEffect, useMemo } from 'react';
import type { RbacModule } from '@gms/shared';
import { usePermissions } from './usePermissions';
import { useOrgModules } from './useOrgModules';
import { useVisibleSidebarModules } from './useVisibleSidebarModules';
import { isOrgModuleAccessible, PLATFORM_MODULE } from '../moduleRegistry';
import { useOrg } from '../contexts/OrgContext';

export function useModuleRouteGuard(activeModule: string, setActiveModule: (module: string) => void) {
    const { can, isPlatformAdmin } = usePermissions();
    const { isImpersonating, ready, activeOrgId } = useOrg();
    const { data: orgModules, isLoading, isFetching } = useOrgModules();
    const { visibleModules } = useVisibleSidebarModules();

    const canRead = useMemo(
        () => (module: string) => can(module as RbacModule, 'read'),
        [can],
    );

    const isAccessible = useMemo(() => {
        if (activeModule === PLATFORM_MODULE.key) {
            return isPlatformAdmin && !isImpersonating;
        }
        return isOrgModuleAccessible(activeModule, orgModules, canRead);
    }, [activeModule, orgModules, canRead, isPlatformAdmin, isImpersonating]);

    const fallbackModule = useMemo(() => {
        const first = visibleModules[0]?.key;
        return first ?? 'dashboard';
    }, [visibleModules]);

    const guardReady = ready && !!activeOrgId && !isLoading && !isFetching && orgModules !== undefined;

    useEffect(() => {
        if (!guardReady) return;
        if (isAccessible) return;
        if (activeModule !== fallbackModule) {
            setActiveModule(fallbackModule);
        }
    }, [guardReady, isAccessible, activeModule, fallbackModule, setActiveModule]);

    return { isAccessible, isLoading: !guardReady, orgModules };
}
