import { useCallback } from 'react';
import { useLocalization } from './useLocalization';
import { useOrgModules } from './useOrgModules';
import { resolveModuleLabel } from '../moduleRegistry';

export function useSidebarLabel(orgIdOverride?: string | null) {
    const { sidebarLabel, language } = useLocalization(['sidebar']);
    const { data: orgModules } = useOrgModules(orgIdOverride);

    return useCallback(
        (moduleKey: string, defaultValue?: string) =>
            resolveModuleLabel(
                moduleKey,
                orgModules,
                language,
                (key) => sidebarLabel(key, defaultValue),
            ),
        [orgModules, language, sidebarLabel],
    );
}
