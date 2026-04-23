import type { DocumentType, FolderTemplate, MetadataTag, RetentionPolicy } from '../types';

export const MOCK_DOCUMENT_TYPES: DocumentType[] = [
    { 
        id: 'dt-1', 
        name: { en: 'Contract', ar: 'عقد' }, 
        icon: 'ContractIcon', 
        color: 'blue',
        description: { en: 'Legal agreements with donors, vendors, or partners.', ar: 'اتفاقيات قانونية مع المانحين أو البائعين أو الشركاء.' }
    },
    { 
        id: 'dt-2', 
        name: { en: 'Invoice', ar: 'فاتورة' }, 
        icon: 'InvoiceIcon', 
        color: 'green',
        description: { en: 'Invoices from vendors or for services rendered.', ar: 'فواتير من البائعين أو للخدمات المقدمة.' }
    },
    { 
        id: 'dt-3', 
        name: { en: 'Policy', ar: 'سياسة' }, 
        icon: 'PolicyIcon', 
        color: 'purple',
        description: { en: 'Internal organizational policies and procedures.', ar: 'السياسات والإجراءات التنظيمية الداخلية.' }
    },
    { 
        id: 'dt-4', 
        name: { en: 'Grant Report', ar: 'تقرير منحة' }, 
        icon: 'ReportIcon', 
        color: 'yellow',
        description: { en: 'Progress and final reports for grant-funded projects.', ar: 'تقارير مرحلية ونهائية للمشاريع الممولة بمنح.' }
    },
];

export const MOCK_FOLDER_TEMPLATES: FolderTemplate[] = [
    {
        id: 'ft-1',
        name: { en: 'Standard Project Template', ar: 'قالب المشروع القياسي' },
        description: { en: 'Default folder structure for all new projects.', ar: 'هيكل المجلد الافتراضي لجميع المشاريع الجديدة.' },
        structure: {
            id: 'root',
            name: '[Project Name]',
            children: [
                { id: 'f-1-1', name: '01_Contracts & Agreements', children: [] },
                { id: 'f-1-2', name: '02_Financials', children: [
                    { id: 'f-1-2-1', name: 'Invoices', children: [] },
                    { id: 'f-1-2-2', name: 'Budgets', children: [] },
                ]},
                { id: 'f-1-3', name: '03_Reports', children: [
                     { id: 'f-1-3-1', name: 'Monthly Progress', children: [] },
                     { id: 'f-1-3-2', name: 'Final Report', children: [] },
                ]},
                { id: 'f-1-4', name: '04_Media', children: [] },
            ]
        }
    }
];

export const MOCK_METADATA_TAGS: MetadataTag[] = [
    { id: 'tag-1', name: 'Urgent', color: 'bg-red-500' },
    { id: 'tag-2', name: 'Q4-2024', color: 'bg-blue-500' },
    { id: 'tag-3', name: 'Grant-A123', color: 'bg-green-500' },
    { id: 'tag-4', name: 'For Review', color: 'bg-yellow-500' },
    { id: 'tag-5', name: 'Approved', color: 'bg-purple-500' },
];

export const MOCK_RETENTION_POLICIES: RetentionPolicy[] = [
    {
        id: 'rp-1',
        name: 'Financial Records Policy',
        appliesTo: { type: 'docType', docTypeId: 'dt-2' }, // Invoices
        durationYears: 7,
        endOfLifeAction: 'archive',
        isEnabled: true,
    },
    {
        id: 'rp-2',
        name: 'Employee Contracts Policy',
        appliesTo: { type: 'docType', docTypeId: 'dt-1' }, // Contracts (could be more granular)
        durationYears: 10,
        endOfLifeAction: 'delete',
        isEnabled: true,
    },
     {
        id: 'rp-3',
        name: 'Outdated Policies',
        appliesTo: { type: 'docType', docTypeId: 'dt-3' }, // Policy
        durationYears: 2,
        endOfLifeAction: 'review',
        isEnabled: false,
    }
];
