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
    { id: 'cat-1', name: { en: 'Education', ar: 'التعليم', tr: 'Eğitim' }, description: { en: 'Programs focused on educational access and quality.', ar: 'برامج تركز على الوصول إلى التعليم وجودته.', tr: 'Eğitime erişim ve kaliteye odaklanan programlar.' }, icon: 'EducationalIcon', color: 'blue' },
    { id: 'cat-2', name: { en: 'Health & Nutrition', ar: 'الصحة والتغذية', tr: 'Sağlık ve Beslenme' }, description: { en: 'Initiatives for community health and wellness.', ar: 'مبادرات لصحة المجتمع وعافيته.', tr: 'Toplum sağlığı ve esenliği için girişimler.' }, icon: 'HealthIcon', color: 'red' },
    { id: 'cat-3', name: { en: 'Emergency Relief', ar: 'الإغاثة الطارئة', tr: 'Acil Yardım' }, description: { en: 'Rapid response to disasters and crises.', ar: 'الاستجابة السريعة للكوارث والأزمات.', tr: 'Afetlere ve krizlere hızlı müdahale.' }, icon: 'ReliefIcon', color: 'orange' },
    { id: 'cat-4', name: { en: 'Economic Empowerment', ar: 'التمكين الاقتصادي', tr: 'Ekonomik Güçlendirme' }, description: { en: 'Livelihood and vocational training programs.', ar: 'برامج سبل العيش والتدريب المهني.', tr: 'Geçim kaynakları ve mesleki eğitim programları.' }, icon: 'EmpowermentIcon', color: 'green' },
];

export const MOCK_LIFECYCLE_STAGES: ProjectLifecycleStage[] = [
    { id: 'lc-1', name: { en: 'Design & Proposal', ar: 'التصميم والمقترح', tr: 'Tasarım ve Teklif' }, order: 1, description: { en: 'Initial project idea, needs assessment, and proposal writing.', ar: 'فكرة المشروع الأولية وتقييم الاحتياجات وكتابة المقترح.', tr: 'İlk proje fikri, ihtiyaç analizi ve teklif yazımı.' } },
    { id: 'lc-2', name: { en: 'Approval', ar: 'الموافقة', tr: 'Onay' }, order: 2, description: { en: 'Internal and donor approval process.', ar: 'عملية الموافقة الداخلية وموافقة المانحين.', tr: 'İç ve bağışçı onay süreci.' } },
    { id: 'lc-3', name: { en: 'Implementation', ar: 'التنفيذ', tr: 'Uygulama' }, order: 3, description: { en: 'Project activities are carried out.', ar: 'تنفيذ أنشطة المشروع.', tr: 'Proje faaliyetleri yürütülür.' } },
    { id: 'lc-4', name: { en: 'Monitoring & Evaluation', ar: 'الرصد والتقييم', tr: 'İzleme ve Değerlendirme' }, order: 4, description: { en: 'Ongoing tracking of progress and impact.', ar: 'التتبع المستمر للتقدم والأثر.', tr: 'İlerlemenin ve etkinin sürekli takibi.' } },
    { id: 'lc-5', name: { en: 'Closure & Reporting', ar: 'الإغلاق والتقارير', tr: 'Kapanış ve Raporlama' }, order: 5, description: { en: 'Final reporting, financial closure, and lessons learned.', ar: 'التقارير النهائية والإغلاق المالي والدروس المستفادة.', tr: 'Nihai raporlama, mali kapanış ve öğrenilen dersler.' } },
];

export const MOCK_PROJECT_CLASSIFICATIONS: ProjectClassification[] = [
    { id: 'pc-1', name: { en: 'Emergency Response', ar: 'استجابة طارئة', tr: 'Acil Durum Müdahalesi' }, description: { en: 'Short-term, rapid response projects.', ar: 'مشاريع استجابة سريعة وقصيرة الأجل.', tr: 'Kısa vadeli, hızlı müdahale projeleri.' } },
    { id: 'pc-2', name: { en: 'Long-term Development', ar: 'تنمية طويلة الأمد', tr: 'Uzun Vadeli Kalkınma' }, description: { en: 'Sustainable, multi-year development projects.', ar: 'مشاريع تنمية مستدامة متعددة السنوات.', tr: 'Sürdürülebilir, çok yıllı kalkınma projeleri.' } },
    { id: 'pc-3', name: { en: 'Advocacy', ar: 'مناصرة', tr: 'Savunuculuk' }, description: { en: 'Projects focused on policy change and awareness.', ar: 'مشاريع تركز على تغيير السياسات والوعي.', tr: 'Politika değişikliği ve farkındalığa odaklanan projeler.' } },
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
    { id: 'bg-1', name: { en: 'Refugees', ar: 'لاجئون', tr: 'Mülteciler' } },
    { id: 'bg-2', name: { en: 'Internally Displaced Persons (IDPs)', ar: 'النازحون داخلياً', tr: 'Ülke İçinde Yerinden Edilmiş Kişiler' } },
    { id: 'bg-3', name: { en: 'Orphans', ar: 'أيتام', tr: 'Yetimler' } },
    { id: 'bg-4', name: { en: 'Host Community', ar: 'المجتمع المضيف', tr: 'Ev Sahibi Topluluk' } },
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
