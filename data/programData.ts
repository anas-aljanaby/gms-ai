import type { 
    ProgramCategory, 
    ProjectLifecycleStage, 
    ProjectClassification,
    GeographicLevel,
    BeneficiaryGroup,
    DemographicTag,
    LogFrameComponent,
    TheoryOfChangeComponent,
    SDG,
    Indicator,
    PartnerType,
    PolicyDocument,
    ReportTemplate
} from '../types';

export const MOCK_PROGRAM_CATEGORIES: ProgramCategory[] = [
    { id: 'cat-1', name: { en: 'Education', ar: 'التعليم' }, description: { en: 'Programs focused on educational access and quality.', ar: 'برامج تركز على الوصول إلى التعليم وجودته.' }, icon: 'EducationalIcon', color: 'blue' },
    { id: 'cat-2', name: { en: 'Health & Nutrition', ar: 'الصحة والتغذية' }, description: { en: 'Initiatives for community health and wellness.', ar: 'مبادرات لصحة المجتمع وعافيته.' }, icon: 'HealthIcon', color: 'red' },
    { id: 'cat-3', name: { en: 'Emergency Relief', ar: 'الإغاثة الطارئة' }, description: { en: 'Rapid response to disasters and crises.', ar: 'الاستجابة السريعة للكوارث والأزمات.' }, icon: 'ReliefIcon', color: 'orange' },
    { id: 'cat-4', name: { en: 'Economic Empowerment', ar: 'التمكين الاقتصادي' }, description: { en: 'Livelihood and vocational training programs.', ar: 'برامج سبل العيش والتدريب المهني.' }, icon: 'EmpowermentIcon', color: 'green' },
];

export const MOCK_LIFECYCLE_STAGES: ProjectLifecycleStage[] = [
    { id: 'lc-1', name: { en: 'Design & Proposal', ar: 'التصميم والمقترح' }, order: 1, description: { en: 'Initial project idea, needs assessment, and proposal writing.', ar: 'فكرة المشروع الأولية وتقييم الاحتياجات وكتابة المقترح.' } },
    { id: 'lc-2', name: { en: 'Approval', ar: 'الموافقة' }, order: 2, description: { en: 'Internal and donor approval process.', ar: 'عملية الموافقة الداخلية وموافقة المانحين.' } },
    { id: 'lc-3', name: { en: 'Implementation', ar: 'التنفيذ' }, order: 3, description: { en: 'Project activities are carried out.', ar: 'تنفيذ أنشطة المشروع.' } },
    { id: 'lc-4', name: { en: 'Monitoring & Evaluation', ar: 'الرصد والتقييم' }, order: 4, description: { en: 'Ongoing tracking of progress and impact.', ar: 'التتبع المستمر للتقدم والأثر.' } },
    { id: 'lc-5', name: { en: 'Closure & Reporting', ar: 'الإغلاق والتقارير' }, order: 5, description: { en: 'Final reporting, financial closure, and lessons learned.', ar: 'التقارير النهائية والإغلاق المالي والدروس المستفادة.' } },
];

export const MOCK_PROJECT_CLASSIFICATIONS: ProjectClassification[] = [
    { id: 'pc-1', name: { en: 'Emergency Response', ar: 'استجابة طارئة' }, description: { en: 'Short-term, rapid response projects.', ar: 'مشاريع استجابة سريعة وقصيرة الأجل.' } },
    { id: 'pc-2', name: { en: 'Long-term Development', ar: 'تنمية طويلة الأمد' }, description: { en: 'Sustainable, multi-year development projects.', ar: 'مشاريع تنمية مستدامة متعددة السنوات.' } },
    { id: 'pc-3', name: { en: 'Advocacy', ar: 'مناصرة' }, description: { en: 'Projects focused on policy change and awareness.', ar: 'مشاريع تركز على تغيير السياسات والوعي.' } },
];

export const MOCK_GEOGRAPHIES: GeographicLevel[] = [
    { id: 'geo-1', name: 'Turkey', children: [
        { id: 'geo-1-1', name: 'Istanbul Province', children: [
            { id: 'geo-1-1-1', name: 'Fatih', children: [] },
            { id: 'geo-1-1-2', name: 'Başakşehir', children: [] },
        ]},
        { id: 'geo-1-2', name: 'Ankara Province', children: [] },
    ]},
    { id: 'geo-2', name: 'Lebanon', children: [] },
];

export const MOCK_BENEFICIARY_GROUPS: BeneficiaryGroup[] = [
    { id: 'bg-1', name: { en: 'Refugees', ar: 'لاجئون' } },
    { id: 'bg-2', name: { en: 'Internally Displaced Persons (IDPs)', ar: 'النازحون داخلياً' } },
    { id: 'bg-3', name: { en: 'Orphans', ar: 'أيتام' } },
    { id: 'bg-4', name: { en: 'Host Community', ar: 'المجتمع المضيف' } },
];

export const MOCK_SDGS: SDG[] = [
    { id: 1, name: "No Poverty", description: "...", color: "#E5243B", isEnabled: true },
    { id: 2, name: "Zero Hunger", description: "...", color: "#DDA63A", isEnabled: true },
    { id: 3, name: "Good Health and Well-being", description: "...", color: "#4C9F38", isEnabled: true },
    { id: 4, name: "Quality Education", description: "...", color: "#C5192D", isEnabled: true },
    { id: 5, name: "Gender Equality", description: "...", color: "#FF3A21", isEnabled: true },
    { id: 6, name: "Clean Water and Sanitation", description: "...", color: "#26BDE2", isEnabled: false },
    { id: 7, name: "Affordable and Clean Energy", description: "...", color: "#FCC30B", isEnabled: false },
    { id: 8, name: "Decent Work and Economic Growth", description: "...", color: "#A21942", isEnabled: true },
    { id: 9, name: "Industry, Innovation and Infrastructure", description: "...", color: "#FD6925", isEnabled: false },
    { id: 10, name: "Reduced Inequality", description: "...", color: "#DD1367", isEnabled: true },
    { id: 11, name: "Sustainable Cities and Communities", description: "...", color: "#FD9D24", isEnabled: false },
    { id: 12, name: "Responsible Consumption and Production", description: "...", color: "#BF8B2E", isEnabled: false },
    { id: 13, name: "Climate Action", description: "...", color: "#3F7E44", isEnabled: false },
    { id: 14, name: "Life Below Water", description: "...", color: "#0A97D9", isEnabled: false },
    { id: 15, name: "Life on Land", description: "...", color: "#56C02B", isEnabled: false },
    { id: 16, name: "Peace, Justice and Strong Institutions", description: "...", color: "#00689D", isEnabled: true },
    { id: 17, name: "Partnerships for the Goals", description: "...", color: "#19486A", isEnabled: true },
];


export const MOCK_PROGRAM_DATA = {
    categories: MOCK_PROGRAM_CATEGORIES,
    lifecycleStages: MOCK_LIFECYCLE_STAGES,
    classifications: MOCK_PROJECT_CLASSIFICATIONS,
    geographies: MOCK_GEOGRAPHIES,
    beneficiaryGroups: MOCK_BENEFICIARY_GROUPS,
    sdgs: MOCK_SDGS,
};
