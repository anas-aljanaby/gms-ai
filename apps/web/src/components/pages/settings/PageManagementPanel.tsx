import React, { useEffect, useMemo, useState } from 'react';
import type { OrgModule, OrgModuleUpdateItem } from '@gms/shared';
import { useLocalization } from '../../../hooks/useLocalization';
import { useSidebarLabel } from '../../../hooks/useSidebarLabel';
import { buildPatchPayload, useOrgModules, usePatchOrgModules } from '../../../hooks/useOrgModules';
import { useToast } from '../../../hooks/useToast';
import { getRegistryIcon } from '../../../moduleRegistry';

interface PageManagementPanelProps {
    orgId?: string | null;
    compact?: boolean;
    onDirtyChange?: (dirty: boolean) => void;
}

function sortModules(modules: OrgModule[]) {
    return [...modules].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

const PageManagementPanel: React.FC<PageManagementPanelProps> = ({ orgId, compact = false, onDirtyChange }) => {
    const { t, language } = useLocalization(['settings', 'common', 'sidebar']);
    const sidebarLabel = useSidebarLabel(orgId);
    const { data: serverModules = [], isLoading } = useOrgModules(orgId);
    const patchMutation = usePatchOrgModules(orgId);
    const { showSuccess, showError } = useToast();

    const [draft, setDraft] = useState<OrgModule[]>([]);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!dirty) {
            setDraft(sortModules(serverModules));
        }
    }, [serverModules, dirty]);

    useEffect(() => {
        onDirtyChange?.(dirty);
    }, [dirty, onDirtyChange]);

    const ordered = useMemo(() => sortModules(draft), [draft]);

    const updateDraft = (updater: (current: OrgModule[]) => OrgModule[]) => {
        setDraft(updater);
        setDirty(true);
    };

    const toggleEnabled = (name: string) => {
        updateDraft((current) =>
            current.map((row) => {
                if (row.name !== name || row.locked) return row;
                return { ...row, enabled: !row.enabled };
            }),
        );
    };

    const moveModule = (name: string, direction: -1 | 1) => {
        updateDraft((current) => {
            const sorted = sortModules(current);
            const index = sorted.findIndex((row) => row.name === name);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= sorted.length) return current;

            const next = [...sorted];
            const [item] = next.splice(index, 1);
            next.splice(target, 0, item);
            return next.map((row, sort_order) => ({ ...row, sort_order }));
        });
    };

    const updateLabel = (name: string, field: 'label_en' | 'label_ar', value: string) => {
        updateDraft((current) =>
            current.map((row) =>
                row.name === name ? { ...row, [field]: value || null } : row,
            ),
        );
    };

    const buildUpdates = (): OrgModuleUpdateItem[] =>
        ordered.map((row, index) => ({
            name: row.name,
            enabled: row.enabled,
            sort_order: index,
            label_en: row.label_en,
            label_ar: row.label_ar,
        }));

    const handleSave = async () => {
        try {
            await patchMutation.mutateAsync(buildPatchPayload(buildUpdates()));
            setDirty(false);
            showSuccess(t('settings.pages.saveSuccess'));
        } catch (err) {
            showError(err instanceof Error ? err.message : t('common.error'));
        }
    };

    const handleReset = () => {
        setDraft(sortModules(serverModules));
        setDirty(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-dashed border-primary" />
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${compact ? '' : 'max-w-3xl'}`}>
            {!compact && (
                <div>
                    <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground">
                        {t('settings.pages.title')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('settings.pages.description')}
                    </p>
                </div>
            )}

            <div className={`rounded-xl border border-gray-200 dark:border-slate-700 divide-y divide-gray-200 dark:divide-slate-700 ${
                compact
                    ? 'max-h-[45vh] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]'
                    : 'overflow-hidden'
            }`}>
                {ordered.map((row, index) => {
                    const Icon = getRegistryIcon(row.name);
                    const defaultLabel = sidebarLabel(row.name);
                    const displayLabel =
                        language === 'ar'
                            ? row.label_ar?.trim() || row.label_en?.trim() || defaultLabel
                            : row.label_en?.trim() || row.label_ar?.trim() || defaultLabel;

                    return (
                        <div key={row.id} className="p-4 bg-card dark:bg-dark-card space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 text-primary">
                                        <Icon />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-foreground dark:text-dark-foreground truncate">
                                                {displayLabel}
                                            </p>
                                            {row.locked && (
                                                <span className="inline-flex rounded-full bg-gray-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {t('settings.pages.locked')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => moveModule(row.name, -1)}
                                        disabled={index === 0 || patchMutation.isPending}
                                        className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-slate-700 disabled:opacity-40"
                                        aria-label={t('settings.pages.moveUp')}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveModule(row.name, 1)}
                                        disabled={index === ordered.length - 1 || patchMutation.isPending}
                                        className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-slate-700 disabled:opacity-40"
                                        aria-label={t('settings.pages.moveDown')}
                                    >
                                        ↓
                                    </button>
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={row.enabled}
                                            disabled={row.locked || patchMutation.isPending}
                                            onChange={() => toggleEnabled(row.name)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {t('settings.pages.enabled')}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        {t('settings.pages.labelEn')}
                                    </label>
                                    <input
                                        type="text"
                                        value={row.label_en ?? ''}
                                        placeholder={sidebarLabel(row.name)}
                                        onChange={(e) => updateLabel(row.name, 'label_en', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        {t('settings.pages.labelAr')}
                                    </label>
                                    <input
                                        type="text"
                                        value={row.label_ar ?? ''}
                                        placeholder={sidebarLabel(row.name)}
                                        onChange={(e) => updateLabel(row.name, 'label_ar', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                                        dir="rtl"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`flex justify-end gap-2 ${
                compact
                    ? 'rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/40'
                    : ''
            }`}>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={!dirty || patchMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="button"
                    onClick={() => { void handleSave(); }}
                    disabled={!dirty || patchMutation.isPending}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                    {patchMutation.isPending ? t('common.saving') : t('settings.saveChanges')}
                </button>
            </div>
        </div>
    );
};

export default PageManagementPanel;
