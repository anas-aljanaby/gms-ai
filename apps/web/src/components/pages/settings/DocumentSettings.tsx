import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTabParam } from '../../../hooks/useTabParam';
import type { MetadataTag, RetentionPolicy } from '../../../types';
import { MOCK_DOCUMENT_TYPES, MOCK_FOLDER_TEMPLATES, MOCK_METADATA_TAGS, MOCK_RETENTION_POLICIES } from '../../../data/documentData';
import Tabs from '../../common/Tabs';
import SettingsCard from './SettingsCard';
import ToggleSwitch from './ToggleSwitch';
import * as DocumentIcons from '../../icons/DocumentIcons';
import { EditIcon } from '../../icons/ActionIcons';
import { XIcon } from '../../icons/GenericIcons';

const iconMap: { [key: string]: React.FC } = {
    ContractIcon: DocumentIcons.ContractIcon,
    InvoiceIcon: DocumentIcons.InvoiceIcon,
    PolicyIcon: DocumentIcons.PolicyIcon,
    ReportIcon: DocumentIcons.ReportIcon,
};

const documentTypeColorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
};

const DocumentTypesConfig: React.FC = () => {
    const { t, pickLocalized } = useLocalization();

    return (
        <SettingsCard title={t('settings.documents.types.title')} description={t('settings.documents.types.desc')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_DOCUMENT_TYPES.map(type => {
                    const Icon = iconMap[type.icon] ?? DocumentIcons.PolicyIcon;
                    return (
                        <div key={type.id} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${documentTypeColorClasses[type.color] ?? documentTypeColorClasses.blue}`}>
                                <Icon />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="font-semibold text-foreground dark:text-dark-foreground">{pickLocalized(type.name)}</h4>
                                    <button className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700" aria-label={t('settings.documents.editType')}>
                                        <EditIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{pickLocalized(type.description)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </SettingsCard>
    );
};

const FolderTemplatesConfig: React.FC = () => {
    const { t, pickLocalized } = useLocalization();

    const renderFolderTree = (folder: { id: string; name: string; children?: Array<{ id: string; name: string; children?: any[] }> }, depth = 0): React.ReactNode => (
        <div key={folder.id} className={depth === 0 ? '' : 'mt-2'}>
            <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium dark:bg-slate-800/60" style={{ marginInlineStart: depth * 16 }}>
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>{folder.name}</span>
            </div>
            {folder.children?.map(child => renderFolderTree(child, depth + 1))}
        </div>
    );

    return (
        <SettingsCard title={t('settings.documents.templates.title')} description={t('settings.documents.templates.desc')}>
            <div className="space-y-4">
                {MOCK_FOLDER_TEMPLATES.map(template => (
                    <div key={template.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/20">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h4 className="font-semibold text-foreground dark:text-dark-foreground">{pickLocalized(template.name)}</h4>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{pickLocalized(template.description)}</p>
                            </div>
                            <button className="rounded-full p-1.5 hover:bg-white dark:hover:bg-slate-700" aria-label={t('settings.documents.editTemplate')}>
                                <EditIcon className="h-4 w-4" />
                            </button>
                        </div>
                        {renderFolderTree(template.structure)}
                    </div>
                ))}
            </div>
        </SettingsCard>
    );
};

const MetadataConfig: React.FC = () => {
    const { t } = useLocalization();
    const [tags, setTags] = useState<MetadataTag[]>(MOCK_METADATA_TAGS);
    const [newTagName, setNewTagName] = useState('');
    const tagColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

    const handleAddTag = () => {
        if (newTagName.trim()) {
            const color = tagColors[tags.length % tagColors.length];
            setTags([...tags, { id: `tag-${Date.now()}`, name: newTagName.trim(), color }]);
            setNewTagName('');
        }
    };

    return (
        <SettingsCard
            title={t('settings.documents.metadata.title')}
            description={t('settings.documents.metadata.desc')}
        >
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder={t('settings.documents.metadata.tagName')} 
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-grow block w-full p-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                    />
                    <button onClick={handleAddTag} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shrink-0">
                        {t('settings.documents.metadata.addTag')}
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2 min-h-[40px] p-3 bg-white dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                    {tags.map(tag => (
                        <span key={tag.id} className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${tag.color} flex items-center gap-2 animate-scale-in-fast`}>
                            {tag.name}
                            <button onClick={() => setTags(tags.filter(t => t.id !== tag.id))} className="opacity-70 hover:opacity-100">
                                <XIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </SettingsCard>
    );
};

const VersioningRetentionConfig: React.FC = () => {
    const { t, pickLocalized } = useLocalization();
    const [policies, setPolicies] = useState<RetentionPolicy[]>(MOCK_RETENTION_POLICIES);

    const getDocumentTypeName = (policy: RetentionPolicy) => {
        const documentType = MOCK_DOCUMENT_TYPES.find(type => type.id === policy.appliesTo.docTypeId);
        return documentType ? pickLocalized(documentType.name) : t('settings.documents.versioning.allDocuments');
    };

    const togglePolicy = (policyId: string, isEnabled: boolean) => {
        setPolicies(prev => prev.map(policy => policy.id === policyId ? { ...policy, isEnabled } : policy));
    };

    return (
        <SettingsCard title={t('settings.documents.versioning.title')} description={t('settings.documents.versioning.desc')}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="p-2">{t('settings.documents.versioning.policy')}</th>
                            <th className="p-2">{t('settings.documents.versioning.appliesTo')}</th>
                            <th className="p-2">{t('settings.documents.versioning.retention')}</th>
                            <th className="p-2">{t('settings.documents.versioning.endOfLifeAction')}</th>
                            <th className="p-2 text-right">{t('settings.documents.versioning.enabled')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy.id} className="border-t dark:border-slate-700">
                                <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">{policy.name}</td>
                                <td className="p-2">{getDocumentTypeName(policy)}</td>
                                <td className="p-2">{t('settings.documents.versioning.years', { count: policy.durationYears })}</td>
                                <td className="p-2">{t(`settings.documents.versioning.actions.${policy.endOfLifeAction}`)}</td>
                                <td className="p-2">
                                    <ToggleSwitch
                                        label=""
                                        name={policy.id}
                                        isChecked={policy.isEnabled}
                                        onToggle={togglePolicy}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SettingsCard>
    );
};

const DOCUMENT_SETTINGS_TABS = ['types', 'templates', 'metadata', 'versioning'] as const;

const DocumentSettings: React.FC = () => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useTabParam('documentsTab', 'metadata', DOCUMENT_SETTINGS_TABS);
    
    const tabs = [
        { id: 'types', label: t('settings.documents.tabs.types') },
        { id: 'templates', label: t('settings.documents.tabs.templates') },
        { id: 'metadata', label: t('settings.documents.tabs.metadata') },
        { id: 'versioning', label: `${t('settings.documents.tabs.versioning')} & ${t('settings.documents.tabs.retention')}` },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'types':
                return <DocumentTypesConfig />;
            case 'templates':
                return <FolderTemplatesConfig />;
            case 'metadata':
                return <MetadataConfig />;
            case 'versioning':
                return <VersioningRetentionConfig />;
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4">{t('settings.documents.title')}</h2>
            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
            <div className="flex justify-end pt-6 mt-6 border-t dark:border-slate-700">
                 <button className="px-6 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark transition-colors">
                    {t('settings.saveChanges')}
                </button>
            </div>
        </div>
    );
};

export default DocumentSettings;
