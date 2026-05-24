import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

type Db = PostgresJsDatabase<typeof schema>;
type ProjectLegacyIdMap = Record<string, string>;

function daysFromNow(days: number): string {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function seedBousala(db: Db, orgId: string, projectLegacyMap: ProjectLegacyIdMap) {
    const sourceProjectEduc = projectLegacyMap['proj-educ'];
    const sourceProjectLead = projectLegacyMap['proj-lead'];

    const [goal1] = await db
        .insert(schema.bousala_goals)
        .values({
            org_id: orgId,
            title: 'تعزيز الوصول إلى التعليم المجتمعي',
            description: 'توسيع الوصول إلى خدمات التعليم المجتمعي في المناطق ذات الاحتياج.',
            responsible_person: 'إدارة البرامج',
            deadline: daysFromNow(120),
            progress: 48,
            prediction: {
                probability: 78,
                trend: 'up',
                recommendation: 'توجد فرصة لرفع الأثر عبر ربط مؤشرات الأداء بالمشاريع التعليمية النشطة.',
            },
            custom_fields: { demo_key: 'G1', status: 'ضمن المسار' },
        })
        .returning();

    const [goal2] = await db
        .insert(schema.bousala_goals)
        .values({
            org_id: orgId,
            title: 'رفع كفاءة تنفيذ المشاريع التنموية',
            description: 'تحسين الانضباط الزمني والمالي للمشاريع التنموية.',
            responsible_person: 'فريق المشاريع',
            deadline: daysFromNow(90),
            progress: 52,
            prediction: {
                probability: 58,
                trend: 'down',
                recommendation: 'يوصى بتركيز المتابعة على المشاريع ذات الانحراف الزمني المرتفع.',
            },
            custom_fields: { demo_key: 'G2', status: 'يحتاج متابعة' },
        })
        .returning();

    const [goal3] = await db
        .insert(schema.bousala_goals)
        .values({
            org_id: orgId,
            title: 'تحسين منظومة القياس والأثر',
            description: 'بناء متابعة قائمة على مؤشرات واضحة وتقارير منتظمة.',
            responsible_person: 'وحدة المتابعة والتقييم',
            deadline: daysFromNow(75),
            progress: 61,
            prediction: {
                probability: 72,
                trend: 'stable',
                recommendation: 'يظهر تحسن في مؤشرات الانتظام التشغيلي مع حاجة إلى تعزيز التقارير الشهرية.',
            },
            custom_fields: { demo_key: 'G3', status: 'قيد التنفيذ' },
        })
        .returning();

    await db.insert(schema.bousala_kpis).values([
        {
            org_id: orgId,
            goal_id: goal1.id,
            title: 'عدد المستفيدين الفعليين من البرامج التعليمية',
            value: '285',
            target: '400',
            unit: 'مستفيد',
            trend: 'up',
            last_updated: daysAgo(12),
            prediction: { probability: 76, status: 'On Track' },
            custom_fields: {
                demo_key: 'G1-K1',
                description: 'يقيس إجمالي المستفيدين الذين تم الوصول إليهم خلال الفترة الحالية',
            },
        },
        {
            org_id: orgId,
            goal_id: goal1.id,
            title: 'نسبة تحقيق مخرجات الربع الحالي',
            value: '72',
            target: '85',
            unit: '%',
            trend: 'up',
            last_updated: daysAgo(8),
            prediction: { probability: 71, status: 'On Track' },
            custom_fields: {
                demo_key: 'G1-K2',
                description: 'يقيس مدى تحقيق المخرجات المخططة للربع الجاري',
            },
        },
        {
            org_id: orgId,
            goal_id: goal2.id,
            title: 'نسبة الالتزام بالخطة الزمنية',
            value: '68',
            target: '90',
            unit: '%',
            trend: 'stable',
            last_updated: daysAgo(15),
            prediction: { probability: 62, status: 'At Risk' },
            custom_fields: {
                demo_key: 'G2-K1',
                description: 'تقيس مدى تنفيذ الأنشطة ضمن الجدول المعتمد',
            },
        },
        {
            org_id: orgId,
            goal_id: goal2.id,
            title: 'نسبة الصرف مقابل التقدم',
            value: '82',
            target: '95',
            unit: '%',
            trend: 'down',
            last_updated: daysAgo(10),
            prediction: { probability: 55, status: 'At Risk' },
            custom_fields: {
                demo_key: 'G2-K2',
                description: 'تقيس توافق الإنفاق مع مستوى الإنجاز الفعلي',
            },
        },
        {
            org_id: orgId,
            goal_id: goal2.id,
            title: 'معدل إغلاق المهام في الوقت المحدد',
            value: '74',
            target: '85',
            unit: '%',
            trend: 'up',
            last_updated: daysAgo(6),
            prediction: { probability: 69, status: 'At Risk' },
            custom_fields: {
                demo_key: 'G2-K3',
                description: 'يقيس كفاءة التنفيذ والمتابعة على مستوى المهام',
            },
        },
        {
            org_id: orgId,
            goal_id: goal3.id,
            title: 'نسبة المشاريع ذات التقارير المنتظمة',
            value: '58',
            target: '80',
            unit: '%',
            trend: 'up',
            last_updated: daysAgo(9),
            prediction: { probability: 73, status: 'On Track' },
            custom_fields: {
                demo_key: 'G3-K1',
                description: 'تقيس انتظام رفع التقارير الدورية للمشاريع المرتبطة',
            },
        },
    ]);

    const [project1] = await db
        .insert(schema.bousala_goal_projects)
        .values({
            org_id: orgId,
            goal_id: goal1.id,
            source_project_id: sourceProjectEduc ?? null,
            title: 'تأهيل مركز تعليمي مجتمعي',
            description: 'مشروع مرتبط مباشرة بتوسيع الوصول إلى التعليم المجتمعي.',
            progress: 42,
            custom_fields: { demo_key: 'P1', status: 'قيد التنفيذ' },
        })
        .returning();

    const [project2] = await db
        .insert(schema.bousala_goal_projects)
        .values({
            org_id: orgId,
            goal_id: goal1.id,
            source_project_id: null,
            title: 'تطوير برنامج الدعم المدرسي',
            description: 'دعم الطلاب المتعثرين وتحسين الاستمرارية التعليمية.',
            progress: 55,
            custom_fields: { demo_key: 'P2', status: 'ضمن المسار' },
        })
        .returning();

    const [project3] = await db
        .insert(schema.bousala_goal_projects)
        .values({
            org_id: orgId,
            goal_id: goal2.id,
            source_project_id: null,
            title: 'تحسين البنية التشغيلية للمتابعة الميدانية',
            description: 'تقوية آليات المتابعة الميدانية ورفع انتظام التقارير.',
            progress: 48,
            custom_fields: { demo_key: 'P3', status: 'متأخر' },
        })
        .returning();

    const [project4] = await db
        .insert(schema.bousala_goal_projects)
        .values({
            org_id: orgId,
            goal_id: goal2.id,
            source_project_id: sourceProjectLead ?? null,
            title: 'رفع جاهزية فرق التنفيذ المحلية',
            description: 'تأهيل الفرق الميدانية لتحسين جودة التنفيذ.',
            progress: 38,
            custom_fields: { demo_key: 'P4', status: 'معرض للخطر' },
        })
        .returning();

    const [project5] = await db
        .insert(schema.bousala_goal_projects)
        .values({
            org_id: orgId,
            goal_id: goal3.id,
            source_project_id: null,
            title: 'تطوير برنامج الدعم المدرسي',
            description: 'ربط مخرجات البرنامج بمؤشرات الأثر والمتابعة الدورية.',
            progress: 55,
            custom_fields: { demo_key: 'P5', status: 'قيد التنفيذ' },
        })
        .returning();

    await db.insert(schema.bousala_tasks).values([
        {
            org_id: orgId,
            goal_project_id: project1.id,
            title: 'إعداد خطة التنفيذ التفصيلية',
            description: 'إعداد خطة تنفيذ مرحلية للمركز التعليمي مع جدول زمني واضح.',
            status: 'completed',
            assignee: 'فريق المشاريع',
            due_date: daysFromNow(-14),
            priority: 'high',
            custom_fields: { demo_key: 'T1' },
        },
        {
            org_id: orgId,
            goal_project_id: project1.id,
            title: 'اعتماد مؤشرات المتابعة الشهرية',
            description: 'اعتماد مؤشرات المتابعة مع وحدة القياس والتقييم.',
            status: 'in-progress',
            assignee: 'وحدة المتابعة والتقييم',
            due_date: daysFromNow(10),
            priority: 'high',
            custom_fields: { demo_key: 'T2' },
        },
        {
            org_id: orgId,
            goal_project_id: project2.id,
            title: 'مراجعة التقدم مع فرق المشاريع',
            description: 'مراجعة أسبوعية لتقدم برنامج الدعم المدرسي ومعالجة التأخيرات.',
            status: 'in-progress',
            assignee: 'مسؤول الأداء المؤسسي',
            due_date: daysFromNow(7),
            priority: 'medium',
            custom_fields: { demo_key: 'T3' },
        },
        {
            org_id: orgId,
            goal_project_id: project3.id,
            title: 'تحديث تقرير الأثر الفصلي',
            description: 'تحديث تقرير الأثر وربطه بالمؤشرات الرئيسية للهدف.',
            status: 'in-progress',
            assignee: 'وحدة المتابعة والتقييم',
            due_date: daysFromNow(21),
            priority: 'medium',
            custom_fields: { demo_key: 'T4' },
        },
        {
            org_id: orgId,
            goal_project_id: project3.id,
            title: 'معالجة الأنشطة المتأخرة',
            description: 'متابعة الأنشطة المتأخرة في المتابعة الميدانية ووضع خطة تصحيح.',
            status: 'in-progress',
            assignee: 'فريق المشاريع',
            due_date: daysFromNow(5),
            priority: 'high',
            custom_fields: { demo_key: 'T5' },
        },
        {
            org_id: orgId,
            goal_project_id: project2.id,
            title: 'ربط المشاريع ذات الأولوية بالمؤشرات الرئيسية',
            description: 'ربط مشاريع الدعم المدرسي بمؤشرات الأثر المعتمدة.',
            status: 'completed',
            assignee: 'مسؤول الأداء المؤسسي',
            due_date: daysFromNow(-7),
            priority: 'high',
            custom_fields: { demo_key: 'T6' },
        },
        {
            org_id: orgId,
            goal_project_id: project4.id,
            title: 'تدريب فرق التنفيذ على آلية المتابعة',
            description: 'ورشة تدريبية للفرق الميدانية على رفع التقارير الدورية.',
            status: 'in-progress',
            assignee: 'فريق الشراكات',
            due_date: daysFromNow(18),
            priority: 'medium',
            custom_fields: { demo_key: 'T7' },
        },
        {
            org_id: orgId,
            goal_project_id: project5.id,
            title: 'مراجعة مؤشرات التقارير الشهرية',
            description: 'مراجعة انتظام التقارير وتحديث قائمة المشاريع ذات الأولوية.',
            status: 'in-progress',
            assignee: 'وحدة المتابعة والتقييم',
            due_date: daysFromNow(12),
            priority: 'low',
            custom_fields: { demo_key: 'T8' },
        },
    ]);

    console.log('  Bousala: 3 goals, 6 KPIs, 5 strategic projects, 8 tasks');
}
