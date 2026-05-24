import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

type Db = PostgresJsDatabase<typeof schema>;

/** Maps legacy beneficiary `project_id` strings to seeded project UUIDs. */
export type ProjectLegacyIdMap = Record<string, string>;

type ProjectSeedRow = {
    legacyKey?: string;
    name_en: string;
    name_ar: string;
    type: string;
    stage: string;
    sdg_goals: number[];
    planned_start_date: string;
    planned_end_date: string;
    country: string;
    city: string;
    region: string;
    donor: string;
    implementing_partner: string;
    target_beneficiaries: string;
    primary_contact: string;
    goal: string;
    objectives: string[];
    expected_outcomes: string[];
    progress: number;
    budget: string;
    spent: string;
    scope_in: string[];
    scope_out: string[];
    scope_assumptions: string[];
    scope_constraints: string[];
    kpis: { name: string; unit: string; target: string }[];
    tasks: { name: string; start_date: string; end_date: string; progress: number }[];
    risks: {
        description: string;
        category: string;
        probability: string;
        impact: string;
        response_strategy: string;
        contingency_plan: string;
        owner: string;
        status: string;
    }[];
    expenses: { date: string; description: string; category: string; amount: string }[];
    budget_lines: { category: string; planned: string; actual: string }[];
    team_members: { user_id: string; project_role: string; effort: number; availability: string }[];
    custom_fields?: Record<string, unknown>;
};

const SEED_PROJECT_ROWS: ProjectSeedRow[] = [
    {
        legacyKey: 'proj-educ',
        name_en: 'CECR-2025',
        name_ar: 'تأهيل مركز تعليمي مجتمعي',
        type: 'education',
        stage: 'implementation',
        sdg_goals: [4, 11],
        planned_start_date: '2025-01-01',
        planned_end_date: '2025-09-30',
        country: 'Turkey',
        city: 'Istanbul',
        region: 'حي إسنيوبر',
        donor: 'مؤسسة الخير الدولية',
        implementing_partner: 'شريك ميداني محلي',
        target_beneficiaries: '١٥٠ طالباً ويتيماً من المجتمع المحلي',
        primary_contact: 'فاطمة كايا',
        goal: 'تأهيل مركز تعليمي مجتمعي يقدّم دروساً وبرامج دعم للشباب والأيتام.',
        objectives: [
            'إنهاء أعمال الترميم الأساسية',
            'تجهيز قاعتين دراسيتين',
            'إطلاق برنامج دروس أسبوعي',
            'تنظيم أنشطة رمضانية للأسر المحتاجة',
        ],
        expected_outcomes: [
            '١٥٠ مستفيداً منتظماً',
            '١٠ أنشطة تعليمية شهرياً',
            'تحسين بيئة التعلم المجتمعية',
        ],
        progress: 42,
        budget: '55250.00',
        spent: '17100.00',
        scope_in: [
            'ترميم المبنى والمرافق',
            'تأثيث الفصول والقاعة',
            'برامج تعليمية ودعم اجتماعي',
            'تنسيق مع المتطوعين المحليين',
        ],
        scope_out: [
            'سكن دائم للمستفيدين',
            'منح نقدية شهرية',
            'برامج جامعية معتمدة',
        ],
        scope_assumptions: [
            'توفر التصاريح في الموعد',
            'مشاركة المتطوعين المحليين',
            'استقرار أسعار المواد',
        ],
        scope_constraints: [
            'مدة التنفيذ ٩ أشهر',
            'سقف الميزانية ٥٥٢٥٠ دولاراً',
            'فريق ميداني محدود',
        ],
        kpis: [
            { name: 'عدد المستفيدين المنتظمين', unit: 'number', target: '150' },
            { name: 'الأنشطة التعليمية الشهرية', unit: 'number', target: '10' },
            { name: 'نسبة إنجاز الترميم', unit: 'percentage', target: '100' },
            { name: 'رضا أولياء الأمور', unit: 'percentage', target: '85' },
        ],
        tasks: [
            { name: 'التصاريح والتصميم', start_date: '2025-01-01', end_date: '2025-02-15', progress: 100 },
            { name: 'أعمال الترميم', start_date: '2025-02-16', end_date: '2025-06-30', progress: 55 },
            { name: 'التأثيث والتجهيز', start_date: '2025-07-01', end_date: '2025-08-15', progress: 10 },
            { name: 'تدريب المعلمين', start_date: '2025-07-15', end_date: '2025-08-31', progress: 0 },
            { name: 'افتتاح المركز', start_date: '2025-09-15', end_date: '2025-09-15', progress: 0 },
            { name: 'متابعة البرامج', start_date: '2025-09-16', end_date: '2025-09-30', progress: 0 },
        ],
        risks: [
            {
                description: 'تأخر توريد مواد البناء',
                category: 'operational',
                probability: 'medium',
                impact: 'medium',
                response_strategy: 'mitigate',
                contingency_plan: 'تحديد موردين بديلين محليين',
                owner: 'فاطمة كايا',
                status: 'open',
            },
            {
                description: 'فجوة تمويل مرحلة التأثيث',
                category: 'financial',
                probability: 'low',
                impact: 'high',
                response_strategy: 'mitigate',
                contingency_plan: 'تأثيث تدريجي حسب الأولوية',
                owner: 'قسم المالية',
                status: 'open',
            },
            {
                description: 'نقص متطوعين في موسم الذروة',
                category: 'operational',
                probability: 'medium',
                impact: 'low',
                response_strategy: 'mitigate',
                contingency_plan: 'جدولة نشاطات خارج موسم الامتحانات',
                owner: 'منسق المجتمع',
                status: 'in-progress',
            },
            {
                description: 'تقلبات أسعار الصرف',
                category: 'financial',
                probability: 'low',
                impact: 'medium',
                response_strategy: 'accept',
                contingency_plan: 'مراجعة الميزانية ربع سنوياً',
                owner: 'مدير المشروع',
                status: 'open',
            },
        ],
        expenses: [
            { date: '2025-01-20', description: 'رسوم تصاريح البناء', category: 'other', amount: '1200.00' },
            { date: '2025-03-15', description: 'مواد الأساسات', category: 'other', amount: '8500.00' },
            { date: '2025-04-20', description: 'توريد حديد إنشائي', category: 'equipment', amount: '5600.00' },
            { date: '2025-05-10', description: 'إشراف ميداني وانتقالات', category: 'travel', amount: '1800.00' },
        ],
        budget_lines: [
            { category: 'other', planned: '30250.00', actual: '9700.00' },
            { category: 'equipment', planned: '15000.00', actual: '5600.00' },
            { category: 'salaries', planned: '8000.00', actual: '1200.00' },
            { category: 'travel', planned: '2000.00', actual: '600.00' },
        ],
        team_members: [
            { user_id: 'فاطمة كايا', project_role: 'مديرة المشروع', effort: 60, availability: 'دوام جزئي' },
            { user_id: 'أحمد يلماز', project_role: 'مهندس ميداني', effort: 100, availability: 'دوام كامل' },
            { user_id: 'سارة أرسلان', project_role: 'منسقة تعليم', effort: 50, availability: 'دوام جزئي' },
            { user_id: 'محمد حسن', project_role: 'مسؤول مالي', effort: 30, availability: 'دوام جزئي' },
        ],
        custom_fields: {
            burnRate: [
                { month: '2025-01', value: 1200 },
                { month: '2025-02', value: 2800 },
                { month: '2025-03', value: 4500 },
                { month: '2025-04', value: 5200 },
                { month: '2025-05', value: 3400 },
            ],
            documents: [
                {
                    id: 'folder-plan-ar',
                    type: 'folder',
                    name: 'التخطيط',
                    accessLevel: 'team',
                    lastModified: '2025-02-01T00:00:00Z',
                    children: [
                        {
                            id: 'file-plan-ar',
                            type: 'file',
                            name: 'خطة المشروع.pdf',
                            fileType: 'pdf',
                            size: 980,
                            uploadedBy: 'فاطمة كايا',
                            uploadedDate: '2025-01-10T00:00:00Z',
                            lastModified: '2025-02-01T00:00:00Z',
                            tags: ['خطة'],
                            description: 'النسخة المعتمدة من خطة المشروع',
                            accessLevel: 'team',
                            viewCount: 18,
                            versions: [
                                {
                                    version: 'v1.0',
                                    date: '2025-01-10T00:00:00Z',
                                    author: 'فاطمة كايا',
                                    notes: 'مسودة أولى',
                                    size: 980,
                                },
                            ],
                        },
                        {
                            id: 'file-budget-ar',
                            type: 'file',
                            name: 'جدول الميزانية.xlsx',
                            fileType: 'xlsx',
                            size: 420,
                            uploadedBy: 'محمد حسن',
                            uploadedDate: '2025-01-15T00:00:00Z',
                            lastModified: '2025-01-28T00:00:00Z',
                            tags: ['ميزانية'],
                            description: 'تفصيل بنود الميزانية',
                            accessLevel: 'team',
                            viewCount: 9,
                            versions: [
                                {
                                    version: 'v1.0',
                                    date: '2025-01-15T00:00:00Z',
                                    author: 'محمد حسن',
                                    notes: 'إصدار أول',
                                    size: 420,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'folder-contracts-ar',
                    type: 'folder',
                    name: 'العقود',
                    accessLevel: 'private',
                    lastModified: '2025-03-01T00:00:00Z',
                    children: [
                        {
                            id: 'file-contract-ar',
                            type: 'file',
                            name: 'عقد المقاول.docx',
                            fileType: 'docx',
                            size: 210,
                            uploadedBy: 'فاطمة كايا',
                            uploadedDate: '2025-02-20T00:00:00Z',
                            lastModified: '2025-02-20T00:00:00Z',
                            tags: ['عقد'],
                            description: 'عقد أعمال الترميم',
                            accessLevel: 'private',
                            viewCount: 5,
                            versions: [
                                {
                                    version: 'v1.0',
                                    date: '2025-02-20T00:00:00Z',
                                    author: 'فاطمة كايا',
                                    notes: 'موقّع',
                                    size: 210,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'folder-reports-ar',
                    type: 'folder',
                    name: 'التقارير',
                    accessLevel: 'organization',
                    lastModified: '2025-05-01T00:00:00Z',
                    children: [
                        {
                            id: 'file-report-mar-ar',
                            type: 'file',
                            name: 'تقرير مارس.pdf',
                            fileType: 'pdf',
                            size: 640,
                            uploadedBy: 'سارة أرسلان',
                            uploadedDate: '2025-04-05T00:00:00Z',
                            lastModified: '2025-04-05T00:00:00Z',
                            tags: ['تقرير'],
                            description: 'تقرير تقدم شهري',
                            accessLevel: 'organization',
                            viewCount: 11,
                            versions: [
                                {
                                    version: 'v1.0',
                                    date: '2025-04-05T00:00:00Z',
                                    author: 'سارة أرسلان',
                                    notes: 'إرسال للمانح',
                                    size: 640,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'folder-photos-ar',
                    type: 'folder',
                    name: 'صور الموقع',
                    accessLevel: 'team',
                    lastModified: '2025-04-15T00:00:00Z',
                    children: [],
                },
            ],
        },
    },
    {
        legacyKey: 'proj-comm',
        name_en: 'Clean Water Initiative',
        name_ar: 'مبادرة المياه النظيفة',
        type: 'humanitarian',
        stage: 'monitoring',
        sdg_goals: [3, 6],
        planned_start_date: '2024-03-01',
        planned_end_date: '2025-02-28',
        country: 'Uganda',
        city: 'Gulu',
        region: 'Northern Region',
        donor: 'Global Philanthropy Foundation',
        implementing_partner: 'Local Water Org',
        target_beneficiaries: '5000 villagers across 10 communities',
        primary_contact: 'Jane Smith',
        goal: 'Improve access to clean drinking water in rural communities.',
        objectives: ['Construct 10 wells', 'Train 20 community maintainers'],
        expected_outcomes: ['95% households with clean water access'],
        progress: 65,
        budget: '150000.00',
        spent: '95000.00',
        scope_in: ['Well construction', 'Community training', 'Water quality testing'],
        scope_out: ['Household plumbing', 'Irrigation systems'],
        scope_assumptions: ['Community participation is high'],
        scope_constraints: ['Rainy season may delay drilling'],
        kpis: [
            { name: 'Wells constructed', unit: 'number', target: '10' },
            { name: 'Households served', unit: 'percentage', target: '95' },
        ],
        tasks: [
            { name: 'Site Surveys', start_date: '2024-03-06', end_date: '2024-04-15', progress: 100 },
            { name: 'Drilling Phase 1', start_date: '2024-04-16', end_date: '2024-08-30', progress: 80 },
            { name: 'Community Training', start_date: '2024-09-01', end_date: '2024-09-15', progress: 0 },
        ],
        risks: [
            {
                description: 'Heavy rains flooding construction sites',
                category: 'operational',
                probability: 'high',
                impact: 'medium',
                response_strategy: 'mitigate',
                contingency_plan: 'Schedule drilling outside peak rainy months',
                owner: 'John Doe',
                status: 'in-progress',
            },
        ],
        expenses: [
            { date: '2024-07-15', description: 'Drilling rig rental', category: 'equipment', amount: '15000.00' },
            { date: '2024-07-20', description: 'Field staff transportation', category: 'travel', amount: '500.00' },
        ],
        budget_lines: [
            { category: 'equipment', planned: '70000.00', actual: '55000.00' },
            { category: 'salaries', planned: '40000.00', actual: '35000.00' },
            { category: 'travel', planned: '10000.00', actual: '5000.00' },
            { category: 'other', planned: '30000.00', actual: '10000.00' },
        ],
        team_members: [
            { user_id: 'Jane Smith', project_role: 'Community Officer', effort: 50, availability: 'Part-time' },
            { user_id: 'John Doe', project_role: 'Field Engineer', effort: 100, availability: 'Full-time' },
        ],
    },
    {
        legacyKey: 'proj-lead',
        name_en: 'Vocational Training Institute',
        name_ar: 'معهد التدريب المهني',
        type: 'education',
        stage: 'planning',
        sdg_goals: [4, 8],
        planned_start_date: '2025-01-01',
        planned_end_date: '2025-04-30',
        country: 'Turkey',
        city: 'Istanbul',
        region: 'Esenyurt',
        donor: 'Sheikh Abdullah Al Nouri Charity',
        implementing_partner: 'Core Istanbul',
        target_beneficiaries: '1000 youth annually',
        primary_contact: 'Core Istanbul PM',
        goal: 'Renovate headquarters for vocational training and entrepreneurship programs.',
        objectives: ['Increase training capacity to 1000 youth', 'Launch startup incubation track'],
        expected_outcomes: ['Improved employability for marginalized youth'],
        progress: 10,
        budget: '850000.00',
        spent: '45000.00',
        scope_in: ['Building renovation', 'Equipment procurement', 'Curriculum development'],
        scope_out: ['University degree programs'],
        scope_assumptions: ['Partnerships with universities secured'],
        scope_constraints: ['4-month execution window'],
        kpis: [
            { name: 'Youths trained annually', unit: 'number', target: '1000' },
            { name: 'Startups incubated', unit: 'number', target: '20' },
        ],
        tasks: [
            { name: 'Building Renovation', start_date: '2025-01-01', end_date: '2025-02-28', progress: 15 },
            { name: 'Equipment Procurement', start_date: '2025-02-15', end_date: '2025-03-31', progress: 5 },
        ],
        risks: [
            {
                description: 'Funding gap impacting full scope delivery',
                category: 'financial',
                probability: 'high',
                impact: 'high',
                response_strategy: 'mitigate',
                contingency_plan: 'Phased implementation by available funds',
                owner: 'PM',
                status: 'open',
            },
        ],
        expenses: [
            { date: '2025-01-20', description: 'Architectural assessment', category: 'other', amount: '45000.00' },
        ],
        budget_lines: [
            { category: 'other', planned: '400000.00', actual: '45000.00' },
            { category: 'equipment', planned: '300000.00', actual: '0.00' },
            { category: 'salaries', planned: '150000.00', actual: '0.00' },
        ],
        team_members: [
            { user_id: 'Core Istanbul PM', project_role: 'Project Manager', effort: 100, availability: 'Full-time' },
        ],
    },
];

export async function seedProjects(db: Db, orgId: string): Promise<ProjectLegacyIdMap> {
    const legacyMap: ProjectLegacyIdMap = {};

    for (const row of SEED_PROJECT_ROWS) {
        const [project] = await db
            .insert(schema.projects)
            .values({
                org_id: orgId,
                name_en: row.name_en,
                name_ar: row.name_ar,
                type: row.type,
                stage: row.stage,
                sdg_goals: row.sdg_goals,
                planned_start_date: row.planned_start_date,
                planned_end_date: row.planned_end_date,
                country: row.country,
                city: row.city,
                region: row.region,
                donor: row.donor,
                implementing_partner: row.implementing_partner,
                target_beneficiaries: row.target_beneficiaries,
                primary_contact: row.primary_contact,
                goal: row.goal,
                objectives: row.objectives,
                expected_outcomes: row.expected_outcomes,
                progress: row.progress,
                budget: row.budget,
                spent: row.spent,
                scope_in: row.scope_in,
                scope_out: row.scope_out,
                scope_assumptions: row.scope_assumptions,
                scope_constraints: row.scope_constraints,
                custom_fields: row.custom_fields ?? {},
            })
            .returning();

        if (row.legacyKey) {
            legacyMap[row.legacyKey] = project.id;
        }

        if (row.kpis.length > 0) {
            await db.insert(schema.project_kpis).values(
                row.kpis.map((kpi) => ({
                    org_id: orgId,
                    project_id: project.id,
                    name: kpi.name,
                    unit: kpi.unit,
                    target: kpi.target,
                    custom_fields: {},
                })),
            );
        }

        if (row.tasks.length > 0) {
            await db.insert(schema.project_tasks).values(
                row.tasks.map((task) => ({
                    org_id: orgId,
                    project_id: project.id,
                    name: task.name,
                    start_date: task.start_date,
                    end_date: task.end_date,
                    progress: task.progress,
                    custom_fields: {},
                })),
            );
        }

        if (row.risks.length > 0) {
            await db.insert(schema.project_risks).values(
                row.risks.map((risk) => ({
                    org_id: orgId,
                    project_id: project.id,
                    description: risk.description,
                    category: risk.category,
                    probability: risk.probability,
                    impact: risk.impact,
                    response_strategy: risk.response_strategy,
                    contingency_plan: risk.contingency_plan,
                    owner: risk.owner,
                    status: risk.status,
                    custom_fields: {},
                })),
            );
        }

        if (row.expenses.length > 0) {
            await db.insert(schema.project_expenses).values(
                row.expenses.map((expense) => ({
                    org_id: orgId,
                    project_id: project.id,
                    date: expense.date,
                    description: expense.description,
                    category: expense.category,
                    amount: expense.amount,
                    custom_fields: {},
                })),
            );
        }

        if (row.budget_lines.length > 0) {
            await db.insert(schema.project_budget_lines).values(
                row.budget_lines.map((line) => ({
                    org_id: orgId,
                    project_id: project.id,
                    category: line.category,
                    planned: line.planned,
                    actual: line.actual,
                    custom_fields: {},
                })),
            );
        }

        if (row.team_members.length > 0) {
            await db.insert(schema.project_team_members).values(
                row.team_members.map((member) => ({
                    org_id: orgId,
                    project_id: project.id,
                    user_id: member.user_id,
                    project_role: member.project_role,
                    effort: member.effort,
                    availability: member.availability,
                    custom_fields: {},
                })),
            );
        }

        console.log(`  Project: ${row.name_en} (${row.stage}, ${row.tasks.length} tasks, ${row.risks.length} risks)`);
    }

    return legacyMap;
}

export function resolveProjectId(
    legacyId: string | null,
    legacyMap: ProjectLegacyIdMap,
): string | null {
    if (!legacyId) return null;
    return legacyMap[legacyId] ?? null;
}
