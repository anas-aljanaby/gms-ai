import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Database,
    FileQuestion,
    KeyRound,
    LifeBuoy,
    Lock,
    Mail,
    MessageSquare,
    Search,
    Settings,
    ShieldCheck,
    UserPlus,
    Users,
    Workflow,
} from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';

type SupportCategory = 'all' | 'access' | 'data' | 'workflows' | 'admin';
type ArticleCategory = Exclude<SupportCategory, 'all'>;
type Locale = 'en' | 'ar';

interface HelpArticle {
    id: string;
    category: ArticleCategory;
    title: string;
    summary: string;
    details: string[];
}

interface SupportChannel {
    title: string;
    description: string;
    target: string;
    action: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    articleId: string;
    category: SupportCategory;
}

interface StatusItem {
    label: string;
    value: string;
}

interface HelpCopy {
    badge: string;
    title: string;
    subtitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    statusEyebrow: string;
    statusTitle: string;
    statusWarning: string;
    quickActionsTitle: string;
    quickActionsSubtitle: string;
    knowledgeEyebrow: string;
    knowledgeTitle: string;
    knowledgeSubtitle: string;
    supportLanesTitle: string;
    categories: Record<SupportCategory, string>;
    noResultsTitle: string;
    noResultsDescription: string;
    contactEyebrow: string;
    contactTitle: string;
    contactSubtitle: string;
    beforeContactTitle: string;
    beforeContactItems: string[];
    quickActions: QuickAction[];
    supportChannels: SupportChannel[];
    articles: HelpArticle[];
    statusItems: StatusItem[];
}

const supportChannelLinks = {
    priority: 'mailto:support@gms.ai?subject=Priority%20support%20request',
    guidance: 'mailto:support@gms.ai?subject=Product%20guidance%20request',
    security: 'mailto:security@gms.ai?subject=Security%20review%20request',
};

const helpCopy: Record<Locale, HelpCopy> = {
    en: {
        badge: 'Help & Support',
        title: 'Get unstuck quickly and keep your GMS AI workspace clean.',
        subtitle: 'Grounded guidance for access, data, approvals, reporting, and setup.',
        searchLabel: 'Search help topics',
        searchPlaceholder: 'Search sign-in, donor stages, approvals, fiscal periods...',
        statusEyebrow: 'System status',
        statusTitle: 'Core workspace services look available',
        statusWarning: 'For suspected data exposure, remove affected access first, then contact security.',
        quickActionsTitle: 'Start with the most common fixes',
        quickActionsSubtitle: 'Open the fastest path for the issue.',
        knowledgeEyebrow: 'Knowledge base',
        knowledgeTitle: 'Support articles',
        knowledgeSubtitle: 'Practical steps based on the roles, modules, and workflows currently in this workspace.',
        supportLanesTitle: 'Support lanes',
        categories: {
            all: 'All topics',
            access: 'Access',
            data: 'Data',
            workflows: 'Workflows',
            admin: 'Admin',
        },
        noResultsTitle: 'No matching topics',
        noResultsDescription: 'Try a different keyword, or contact support with the module name and what you expected to happen.',
        contactEyebrow: 'Contact',
        contactTitle: 'Choose a support lane',
        contactSubtitle: 'Use the right lane to speed up triage.',
        beforeContactTitle: 'Before you contact support',
        beforeContactItems: [
            'Include the module name, date range, record ID, and the time the issue happened.',
            'Do not send passwords, full payment details, or unnecessary beneficiary identifiers.',
            'For team access issues, include the affected user email and intended role.',
            'For configuration questions, mention the workflow or settings area you changed last.',
        ],
        quickActions: [
            {
                title: 'Can’t sign in',
                description: 'Check invitation, role access, and session policy.',
                icon: KeyRound,
                articleId: 'access-reset',
                category: 'access',
            },
            {
                title: 'Import looks wrong',
                description: 'Check IDs, dates, locale fields, and test rows.',
                icon: Database,
                articleId: 'data-import',
                category: 'data',
            },
            {
                title: 'Approval is stuck',
                description: 'Check workflow step, approver, and amount limit.',
                icon: Workflow,
                articleId: 'approval-routing',
                category: 'workflows',
            },
            {
                title: 'Add a teammate',
                description: 'Invite the user and align their role access.',
                icon: UserPlus,
                articleId: 'permissions',
                category: 'admin',
            },
        ],
        supportChannels: [
            {
                title: 'Priority support',
                description: 'For login, access, payment, or blocking issues.',
                target: 'Placeholder SLA: 4 business hours',
                action: 'Email support',
                href: supportChannelLinks.priority,
                icon: LifeBuoy,
            },
            {
                title: 'Product guidance',
                description: 'For onboarding, workflows, reporting, or setup.',
                target: 'Placeholder SLA: 1 business day',
                action: 'Request guidance',
                href: supportChannelLinks.guidance,
                icon: MessageSquare,
            },
            {
                title: 'Security review',
                description: 'For audits, suspicious activity, or compliance.',
                target: 'Placeholder SLA: same day triage',
                action: 'Contact security',
                href: supportChannelLinks.security,
                icon: ShieldCheck,
            },
        ],
        articles: [
            {
                id: 'access-reset',
                category: 'access',
                title: 'Fix sign-in, invitation, and module access issues',
                summary: 'Use this when a teammate cannot sign in, does not receive the right access, or lands in the wrong modules after being invited.',
                details: [
                    'Open Settings > User Management > User Provisioning and confirm the invitation was sent to the exact email the teammate uses to sign in.',
                    'If the user can sign in but sees the wrong modules, review their role under Access Control and compare its module permissions with the access they need.',
                    'After changing a role or permissions, ask the user to sign out and start a fresh session before you retest access.',
                ],
            },
            {
                id: 'auth-policy',
                category: 'access',
                title: 'Review authentication policy before escalating repeat login failures',
                summary: 'Some login issues come from configuration changes rather than user mistakes, especially after updates to password, MFA, or session rules.',
                details: [
                    'In Settings > User Management > Authentication, review minimum password length, complexity, and session timeout.',
                    'If MFA is enforced for specific roles, confirm the affected user belongs to one of those roles before escalating the issue.',
                    'If concurrent sessions are disabled, ask the user to retry from one browser session only and test again.',
                ],
            },
            {
                id: 'permissions',
                category: 'admin',
                title: 'Set up a new teammate with the right level of access',
                summary: 'GMS AI uses role-based access. Start with the closest role and only grant the modules and actions the person actually needs.',
                details: [
                    'Use the role patterns already present in this workspace: Admin, Manager, Staff, and Volunteer.',
                    'Check sensitive access carefully for Financials, Beneficiaries, Donors, and Settings before the invitation is accepted.',
                    'If your organization uses stricter controls, document the intended role and review it again after the teammate completes onboarding.',
                ],
            },
            {
                id: 'data-import',
                category: 'data',
                title: 'Prepare clean donor, beneficiary, and project data before import or bulk entry',
                summary: 'Most data issues start with mismatched identifiers, inconsistent dates, or mixing test data with live records.',
                details: [
                    'Keep one unique external ID or source identifier per record so the same donor, beneficiary, or project is not created twice.',
                    'Use one date convention across the whole file and double-check locale-sensitive fields such as country, currency, and fiscal year dates.',
                    'Do not upload test rows into production lists. Clean test data first, then import only the records your team intends to operate on.',
                ],
            },
            {
                id: 'donor-pipeline',
                category: 'data',
                title: 'Understand donor pipeline stages and filtered search results',
                summary: 'The donor workspace combines registry data, relationship stages, tasks, and filters, so mismatches often come from filters rather than missing records.',
                details: [
                    'Check whether the donor is being filtered out by status, tier, country, owner, stage, donor type, or task state before assuming the record is missing.',
                    'If the donor appears in the registry but not where expected in the pipeline, review the relationship stage and whether the record was moved recently.',
                    'When reviewing activity, distinguish between donor profile data, pipeline tasks, and recent interactions before changing the record.',
                ],
            },
            {
                id: 'reporting-mismatch',
                category: 'data',
                title: 'When dashboard metrics do not match a report or detailed list',
                summary: 'Most mismatches come from filters, date ranges, active tabs, draft records, or comparing values from different modules.',
                details: [
                    'Compare the same date range, currency, and module context before you compare totals between Dashboard, Financials, Donors, or Projects.',
                    'Check whether the view includes draft, pending, archived, or optimistic records that are not shown the same way elsewhere.',
                    'After bulk edits or imports, refresh the affected view and re-run the comparison before escalating a reporting defect.',
                ],
            },
            {
                id: 'approval-routing',
                category: 'workflows',
                title: 'Unblock approvals in financial workflows',
                summary: 'If a request is stuck, the issue is usually the current step, the approver assignment, or the authorization limit tied to that transaction type.',
                details: [
                    'Open Financials > Approvals or the related transaction and confirm the current status before changing any settings.',
                    'In Settings > Financials > Approval Workflows, review the active workflow, the approval step condition, and the approver type for that transaction.',
                    'If approval depends on authorization limits, verify that the role limit for the selected transaction type is high enough for the amount being submitted.',
                ],
            },
            {
                id: 'financial-periods',
                category: 'workflows',
                title: 'Check financial periods before posting or closing finance work',
                summary: 'Transactions and period-closing issues often come from posting into the wrong period or working while a period is already soft-closed.',
                details: [
                    'Go to Settings > Financials > Financial Periods and confirm whether the target period is Future, Open, Soft-Closed, or Hard-Closed.',
                    'Treat one active open period as the live posting window for current finance activity.',
                    'Before closing a period, confirm pending approvals and unresolved transactions are not still waiting in the workflow.',
                ],
            },
            {
                id: 'project-records',
                category: 'workflows',
                title: 'Keep project records consistent across list, wizard, and detail views',
                summary: 'Project information is split across creation, detail tabs, and reporting views, so errors often come from partial updates rather than missing features.',
                details: [
                    'If a project exists but looks incomplete, open the project detail view and review the active tab before re-entering data.',
                    'Use the detail tabs to verify scope, schedule, cost, beneficiaries, documents, risks, and reports instead of relying on list-level metrics alone.',
                    'When creating a new project, confirm location and budget fields carefully because they affect downstream summaries and analytics.',
                ],
            },
            {
                id: 'localization-settings',
                category: 'admin',
                title: 'Review language, region, and date settings before changing live data',
                summary: 'Some data confusion comes from display settings such as language, timezone, currency, 24-hour time, or Hijri versus Gregorian date format.',
                details: [
                    'In Settings > Organization, check the default language, enabled languages, country, timezone, and primary currency before investigating formatting issues.',
                    'If a team reports date confusion, confirm whether the workspace is using Hijri or Gregorian display and whether users expect 12-hour or 24-hour time.',
                    'When you change regional settings, spot-check finance, project, and dashboard views because those are the places most likely to be affected first.',
                ],
            },
            {
                id: 'audit-ready',
                category: 'admin',
                title: 'Prepare an audit-ready review pack for finance or governance',
                summary: 'When preparing for audit, board review, or internal controls review, gather approved records, source files, and workflow evidence from the same period.',
                details: [
                    'Export reports only after confirming the relevant financial period and approval state are final for the review window.',
                    'Collect source documents from transactions and project records so reviewers can trace totals back to operational evidence.',
                    'Note any manual edits, reopened periods, or exceptional approvals that occurred after the normal workflow path.',
                ],
            },
        ],
        statusItems: [
            { label: 'Application', value: 'Operational' },
            { label: 'Data sync', value: 'Operational' },
            { label: 'AI services', value: 'Operational' },
        ],
    },
    ar: {
        badge: 'المساعدة والدعم',
        title: 'اعثر على الحل بسرعة وحافظ على مساحة عمل GMS AI منظمة.',
        subtitle: 'إرشادات عملية للوصول والبيانات والموافقات والتقارير والإعداد.',
        searchLabel: 'البحث في مواضيع المساعدة',
        searchPlaceholder: 'ابحث عن تسجيل الدخول، مراحل المانحين، الموافقات، الفترات المالية...',
        statusEyebrow: 'حالة النظام',
        statusTitle: 'تبدو خدمات مساحة العمل الأساسية متاحة',
        statusWarning: 'عند الاشتباه بتعرض البيانات، أزل صلاحيات الوصول المتأثرة أولا، ثم تواصل مع فريق الأمان.',
        quickActionsTitle: 'ابدأ بأكثر الحلول شيوعا',
        quickActionsSubtitle: 'افتح أسرع مسار لحل المشكلة.',
        knowledgeEyebrow: 'قاعدة المعرفة',
        knowledgeTitle: 'مقالات الدعم',
        knowledgeSubtitle: 'خطوات عملية مبنية على الأدوار والوحدات ومسارات العمل الموجودة حاليا في هذه المساحة.',
        supportLanesTitle: 'قنوات الدعم',
        categories: {
            all: 'كل المواضيع',
            access: 'الوصول',
            data: 'البيانات',
            workflows: 'سير العمل',
            admin: 'الإدارة',
        },
        noResultsTitle: 'لا توجد نتائج مطابقة',
        noResultsDescription: 'جرب كلمة بحث مختلفة، أو تواصل مع الدعم مع ذكر اسم الوحدة وما كنت تتوقع حدوثه.',
        contactEyebrow: 'التواصل',
        contactTitle: 'اختر قناة الدعم',
        contactSubtitle: 'اختيار القناة الصحيحة يسرع الفرز.',
        beforeContactTitle: 'قبل التواصل مع الدعم',
        beforeContactItems: [
            'اذكر اسم الوحدة ونطاق التاريخ ورقم السجل والوقت الذي ظهرت فيه المشكلة.',
            'لا ترسل كلمات المرور أو بيانات الدفع الكاملة أو معرفات المستفيدين غير الضرورية.',
            'لمشاكل وصول الفريق، أرفق بريد المستخدم المتأثر والدور المطلوب له.',
            'لأسئلة الإعدادات، اذكر سير العمل أو منطقة الإعدادات التي عدلتها مؤخرا.',
        ],
        quickActions: [
            {
                title: 'تعذر تسجيل الدخول',
                description: 'راجع الدعوة والوصول وسياسة الجلسات.',
                icon: KeyRound,
                articleId: 'access-reset',
                category: 'access',
            },
            {
                title: 'الاستيراد غير صحيح',
                description: 'راجع المعرفات والتواريخ والحقول الإقليمية وبيانات الاختبار.',
                icon: Database,
                articleId: 'data-import',
                category: 'data',
            },
            {
                title: 'الموافقة متوقفة',
                description: 'راجع خطوة المسار والمعتمد وحد المبلغ.',
                icon: Workflow,
                articleId: 'approval-routing',
                category: 'workflows',
            },
            {
                title: 'إضافة عضو فريق',
                description: 'أرسل الدعوة واضبط صلاحيات الدور.',
                icon: UserPlus,
                articleId: 'permissions',
                category: 'admin',
            },
        ],
        supportChannels: [
            {
                title: 'دعم ذو أولوية',
                description: 'لمشاكل الدخول أو الصلاحيات أو الدفع أو التعطيل.',
                target: 'اتفاقية مؤقتة: 4 ساعات عمل',
                action: 'إرسال بريد للدعم',
                href: supportChannelLinks.priority,
                icon: LifeBuoy,
            },
            {
                title: 'إرشاد المنتج',
                description: 'للتهيئة وسير العمل والتقارير والإعداد.',
                target: 'اتفاقية مؤقتة: يوم عمل واحد',
                action: 'طلب إرشاد',
                href: supportChannelLinks.guidance,
                icon: MessageSquare,
            },
            {
                title: 'مراجعة الأمان',
                description: 'لتدقيق الصلاحيات أو النشاط المشبوه أو الامتثال.',
                target: 'اتفاقية مؤقتة: فرز في اليوم نفسه',
                action: 'التواصل مع الأمان',
                href: supportChannelLinks.security,
                icon: ShieldCheck,
            },
        ],
        articles: [
            {
                id: 'access-reset',
                category: 'access',
                title: 'معالجة مشاكل تسجيل الدخول والدعوات والوصول إلى الوحدات',
                summary: 'استخدم هذا المسار عندما يتعذر على عضو الفريق الدخول أو لا يحصل على الوصول الصحيح أو يصل إلى وحدات غير متوقعة بعد الدعوة.',
                details: [
                    'افتح الإعدادات > إدارة المستخدمين > تهيئة المستخدمين وتأكد أن الدعوة أُرسلت إلى نفس البريد الذي يستخدمه الشخص لتسجيل الدخول.',
                    'إذا استطاع المستخدم الدخول لكنه يرى وحدات غير صحيحة، راجع دوره في التحكم بالوصول وقارن صلاحيات الوحدات مع الوصول المطلوب.',
                    'بعد تعديل الدور أو الصلاحيات، اطلب من المستخدم تسجيل الخروج وبدء جلسة جديدة قبل إعادة الاختبار.',
                ],
            },
            {
                id: 'auth-policy',
                category: 'access',
                title: 'راجع سياسة المصادقة قبل تصعيد أعطال الدخول المتكررة',
                summary: 'بعض مشاكل الدخول تكون مرتبطة بالإعدادات نفسها لا بخطأ المستخدم، خاصة بعد تعديل كلمات المرور أو MFA أو الجلسات.',
                details: [
                    'في الإعدادات > إدارة المستخدمين > المصادقة، راجع الحد الأدنى لطول كلمة المرور ومتطلبات التعقيد ومدة الجلسة.',
                    'إذا كان MFA مفروضا على أدوار محددة، تأكد أن المستخدم المتأثر ينتمي فعلا إلى أحد تلك الأدوار قبل التصعيد.',
                    'إذا كانت الجلسات المتزامنة معطلة، اطلب من المستخدم إعادة المحاولة من جلسة متصفح واحدة فقط ثم اختبر من جديد.',
                ],
            },
            {
                id: 'permissions',
                category: 'admin',
                title: 'إعداد عضو فريق جديد بالمستوى الصحيح من الصلاحيات',
                summary: 'يعتمد GMS AI على الوصول القائم على الأدوار. ابدأ بأقرب دور ثم امنح فقط الوحدات والإجراءات التي يحتاجها الشخص فعلا.',
                details: [
                    'استخدم أنماط الأدوار الموجودة في هذه المساحة: مدير النظام أو مدير أو موظف أو متطوع.',
                    'تحقق بعناية من الوصول الحساس إلى المالية والمستفيدين والمانحين والإعدادات قبل قبول الدعوة.',
                    'إذا كانت منظمتك تطبق ضوابط أشد، وثّق الدور المقصود وراجعه مرة أخرى بعد اكتمال onboarding للمستخدم.',
                ],
            },
            {
                id: 'data-import',
                category: 'data',
                title: 'تجهيز بيانات المانحين والمستفيدين والمشاريع قبل الاستيراد أو الإدخال الجماعي',
                summary: 'غالبا تبدأ مشاكل البيانات من معرفات غير متطابقة أو تواريخ غير موحدة أو خلط بيانات الاختبار مع البيانات الحية.',
                details: [
                    'احتفظ بمعرف خارجي أو مصدر فريد لكل سجل حتى لا يتم إنشاء نفس المانح أو المستفيد أو المشروع أكثر من مرة.',
                    'استخدم صيغة تاريخ واحدة في الملف كله وتحقق من الحقول المرتبطة بالإعدادات الإقليمية مثل البلد والعملة وتواريخ السنة المالية.',
                    'لا ترفع صفوف الاختبار إلى القوائم الإنتاجية. نظف بيانات الاختبار أولا ثم ارفع السجلات التي تنوي فرقك تشغيلها فعليا فقط.',
                ],
            },
            {
                id: 'donor-pipeline',
                category: 'data',
                title: 'فهم مراحل مسار المانحين ونتائج البحث المفلترة',
                summary: 'تجمع مساحة المانحين بين بيانات السجل ومراحل العلاقة والمهام والمرشحات، لذلك تكون الفروقات غالبا بسبب التصفية لا بسبب اختفاء السجل.',
                details: [
                    'تحقق أولا هل تم استبعاد السجل بواسطة مرشح الحالة أو الفئة أو البلد أو المالك أو المرحلة أو نوع المانح أو حالة المهمة.',
                    'إذا ظهر المانح في السجل لكنه لم يظهر في المسار المتوقع، راجع مرحلة العلاقة وهل تم نقل السجل مؤخرا.',
                    'عند مراجعة النشاط، فرّق بين بيانات ملف المانح ومهام المسار والتفاعلات الأخيرة قبل تعديل السجل.',
                ],
            },
            {
                id: 'reporting-mismatch',
                category: 'data',
                title: 'عندما لا تتطابق مؤشرات اللوحات مع التقارير أو القوائم التفصيلية',
                summary: 'غالبا تأتي الفروقات من المرشحات أو نطاقات التاريخ أو التبويبات النشطة أو السجلات المسودة أو المقارنة بين وحدات مختلفة.',
                details: [
                    'قارن نفس نطاق التاريخ ونفس العملة ونفس سياق الوحدة قبل مقارنة الإجماليات بين اللوحة والمالية والمانحين والمشاريع.',
                    'تحقق هل يشمل العرض سجلات مسودة أو معلقة أو مؤرشفة أو تفاؤلية لا تظهر بالطريقة نفسها في أماكن أخرى.',
                    'بعد التعديلات الجماعية أو الاستيراد، حدّث العرض المتأثر ثم أعد المقارنة قبل تصعيد عيب في التقارير.',
                ],
            },
            {
                id: 'approval-routing',
                category: 'workflows',
                title: 'فك تعطل الموافقات في سير العمل المالي',
                summary: 'إذا تعطل الطلب فغالبا السبب هو الخطوة الحالية أو تعيين المعتمد أو حد الصلاحية المرتبط بنوع المعاملة.',
                details: [
                    'افتح المالية > الموافقات أو المعاملة المرتبطة وتأكد من الحالة الحالية قبل تغيير أي إعداد.',
                    'في الإعدادات > المالية > مسارات الموافقة، راجع المسار النشط وشرط خطوة الموافقة ونوع المعتمد لهذا النوع من المعاملات.',
                    'إذا كانت الموافقة تعتمد على حدود الصلاحية، تحقق من أن حد الدور لنوع المعاملة المحدد يكفي لقيمة المبلغ المرسل.',
                ],
            },
            {
                id: 'financial-periods',
                category: 'workflows',
                title: 'راجع الفترات المالية قبل الترحيل أو الإغلاق',
                summary: 'كثير من مشاكل المعاملات والإغلاق تأتي من العمل على فترة خاطئة أو من متابعة العمل بعد أن تصبح الفترة شبه مغلقة.',
                details: [
                    'اذهب إلى الإعدادات > المالية > الفترات المالية وتأكد هل الفترة المستهدفة مستقبلية أو مفتوحة أو شبه مغلقة أو مغلقة نهائيا.',
                    'تعامل مع فترة مفتوحة واحدة باعتبارها نافذة الترحيل الجارية للأنشطة المالية الحالية.',
                    'قبل إغلاق الفترة، تأكد أن الموافقات المعلقة والمعاملات غير المحسومة لا تزال عالقة في سير العمل.',
                ],
            },
            {
                id: 'project-records',
                category: 'workflows',
                title: 'الحفاظ على اتساق سجلات المشاريع بين القائمة والمعالج وتفاصيل المشروع',
                summary: 'تنقسم بيانات المشروع بين الإنشاء وعلامات التفاصيل وعروض التقارير، لذلك تأتي الأخطاء غالبا من تحديثات جزئية لا من غياب الميزة.',
                details: [
                    'إذا كان المشروع موجودا لكنه يبدو غير مكتمل، افتح صفحة التفاصيل وراجع علامة التبويب النشطة قبل إدخال البيانات مرة أخرى.',
                    'استخدم علامات التفاصيل للتحقق من النطاق والجدول والتكلفة والمستفيدين والمستندات والمخاطر والتقارير بدلا من الاعتماد على مؤشرات القائمة فقط.',
                    'عند إنشاء مشروع جديد، تحقق بعناية من الموقع والميزانية لأنهما يؤثران في الملخصات والتحليلات اللاحقة.',
                ],
            },
            {
                id: 'localization-settings',
                category: 'admin',
                title: 'راجع إعدادات اللغة والمنطقة والتاريخ قبل تعديل البيانات الحية',
                summary: 'بعض ارتباك البيانات يكون سببه إعدادات العرض مثل اللغة والمنطقة الزمنية والعملة و24 ساعة أو هجري مقابل ميلادي.',
                details: [
                    'في الإعدادات > المنظمة، تحقق من اللغة الافتراضية واللغات المفعلة والبلد والمنطقة الزمنية والعملة الأساسية قبل التحقيق في مشاكل التنسيق.',
                    'إذا أبلغ الفريق عن ارتباك في التواريخ، فتأكد هل تستخدم المساحة عرضا هجريا أم ميلاديا وهل يتوقع المستخدمون تنسيق 12 ساعة أم 24 ساعة.',
                    'عند تغيير الإعدادات الإقليمية، راجع بسرعة المالية والمشاريع ولوحات المؤشرات لأنها أكثر الأماكن تأثرا عادة.',
                ],
            },
            {
                id: 'audit-ready',
                category: 'admin',
                title: 'تجهيز حزمة جاهزة للتدقيق المالي أو الحوكمة',
                summary: 'عند التحضير للتدقيق أو مراجعة المجلس أو مراجعة الضوابط الداخلية، اجمع السجلات المعتمدة والملفات المصدرية وأدلة سير العمل للفترة نفسها.',
                details: [
                    'صدّر التقارير فقط بعد التأكد من أن الفترة المالية وحالة الموافقات نهائية ضمن نافذة المراجعة.',
                    'اجمع المستندات المصدرية من المعاملات وسجلات المشاريع حتى يستطيع المراجع تتبع الإجماليات إلى الأدلة التشغيلية.',
                    'وثّق أي تعديلات يدوية أو فترات أعيد فتحها أو موافقات استثنائية تمت خارج المسار المعتاد.',
                ],
            },
        ],
        statusItems: [
            { label: 'التطبيق', value: 'يعمل' },
            { label: 'مزامنة البيانات', value: 'تعمل' },
            { label: 'خدمات الذكاء الاصطناعي', value: 'تعمل' },
        ],
    },
};

const categoryOrder: SupportCategory[] = ['all', 'access', 'data', 'workflows', 'admin'];
const beforeContactIcons = [Clock3, Lock, Users, Settings];
const articleCategoryIcons: Record<ArticleCategory, React.ComponentType<{ className?: string }>> = {
    access: KeyRound,
    data: Database,
    workflows: Workflow,
    admin: Settings,
};

const HelpSupportPage: React.FC = () => {
    const { language, dir } = useLocalization(['common', 'misc']);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<SupportCategory>('all');
    const [openArticleId, setOpenArticleId] = useState<string>(helpCopy.en.articles[0]?.id ?? '');
    const copy = helpCopy[language];
    const isRtl = dir === 'rtl';

    const filteredArticles = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return copy.articles.filter((article) => {
            const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
            const searchableText = [
                article.title,
                article.summary,
                copy.categories[article.category],
                ...article.details,
            ].join(' ').toLowerCase();
            const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, copy, searchTerm]);

    const articleCounts = useMemo(() => {
        return copy.articles.reduce<Record<SupportCategory, number>>((acc, article) => {
            acc.all += 1;
            acc[article.category] += 1;
            return acc;
        }, { all: 0, access: 0, data: 0, workflows: 0, admin: 0 });
    }, [copy.articles]);

    const handleQuickAction = (category: SupportCategory, articleId: string) => {
        setActiveCategory(category);
        setOpenArticleId(articleId);
    };

    return (
        <div dir={dir} className="mx-auto max-w-6xl space-y-5 animate-fade-in">
            <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-card shadow-soft dark:border-slate-700/60 dark:bg-dark-card">
                <div className="relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.08),_transparent_28%)]" />
                    <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-7">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-light/80 px-3 py-1 text-sm font-semibold text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-secondary">
                                <LifeBuoy className="h-4 w-4" />
                                {copy.badge}
                            </div>
                            <h1 className="max-w-2xl text-2xl font-bold leading-tight text-foreground dark:text-dark-foreground sm:text-3xl">
                                {copy.title}
                            </h1>
                            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-[15px]">
                                {copy.subtitle}
                            </p>

                            <div className="mt-5 max-w-xl">
                                <label htmlFor="help-search" className="sr-only">{copy.searchLabel}</label>
                                <div className="relative">
                                    <Search className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                                    <input
                                        id="help-search"
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder={copy.searchPlaceholder}
                                        className={`w-full rounded-2xl border border-white/70 bg-white/90 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/90 dark:text-dark-foreground ${
                                            isRtl ? 'pl-4 pr-12 text-right' : 'pl-12 pr-4 text-left'
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {copy.statusItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-100/85 px-3 py-1.5 text-xs text-gray-700 dark:bg-slate-800/80 dark:text-gray-200"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                        <span className="font-semibold">{item.label}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-[22px] bg-slate-50/90 p-3.5 dark:bg-slate-900/45">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-primary dark:text-secondary">{copy.quickActionsTitle}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{copy.quickActionsSubtitle}</p>
                                    </div>
                                    <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-gray-600 dark:bg-slate-800 dark:text-gray-300 sm:inline-flex">
                                        <BookOpen className="h-4 w-4" />
                                        {filteredArticles.length}
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    {copy.quickActions.map((action) => {
                                        const Icon = action.icon;
                                        const isActive = openArticleId === action.articleId;

                                        return (
                                            <button
                                                key={action.title}
                                                type="button"
                                                onClick={() => handleQuickAction(action.category, action.articleId)}
                                                className={`flex items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                                                    isActive
                                                        ? 'bg-white text-foreground shadow-sm dark:bg-slate-800 dark:text-dark-foreground'
                                                        : 'bg-transparent text-gray-700 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-slate-800/70'
                                                } ${isRtl ? 'text-right' : 'text-left'}`}
                                            >
                                                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-primary dark:bg-slate-800 dark:text-secondary">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <h3 className="text-sm font-bold sm:text-[15px]">{action.title}</h3>
                                                        <ArrowRight
                                                            className={`h-4 w-4 flex-shrink-0 text-gray-400 ${
                                                                isRtl ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                    <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">{action.description}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex h-full flex-col gap-3 rounded-[24px] bg-slate-50/85 p-4 dark:bg-slate-900/45">
                            <div className="rounded-2xl bg-white/85 p-4 dark:bg-slate-950/35">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{copy.statusEyebrow}</p>
                                        <h2 className="text-lg font-bold text-foreground dark:text-dark-foreground">{copy.statusTitle}</h2>
                                    </div>
                                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                                </div>
                                <div className="rounded-2xl bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                        <p>{copy.statusWarning}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{copy.contactEyebrow}</p>
                                    <h2 className="text-lg font-bold text-foreground dark:text-dark-foreground">{copy.supportLanesTitle}</h2>
                                </div>
                                <div className="space-y-2.5">
                                    {copy.supportChannels.slice(0, 2).map((channel) => {
                                        const Icon = channel.icon;

                                        return (
                                            <a
                                                key={channel.title}
                                                href={channel.href}
                                                className="group flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-3 transition hover:bg-white dark:bg-slate-950/25 dark:hover:bg-slate-900/60"
                                            >
                                                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-primary dark:bg-slate-800 dark:text-secondary">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <h3 className="text-sm font-bold text-foreground dark:text-dark-foreground">{channel.title}</h3>
                                                        <ArrowRight
                                                            className={`h-4 w-4 flex-shrink-0 text-gray-400 ${
                                                                isRtl ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                    <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">{channel.description}</p>
                                                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">{channel.target}</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-gray-200 bg-card p-5 shadow-soft dark:border-slate-700/60 dark:bg-dark-card sm:p-6">
                <div className="mb-5 flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-slate-700">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary dark:text-secondary">
                                <BookOpen className="h-4 w-4" />
                                {copy.knowledgeEyebrow}
                            </div>
                            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">{copy.knowledgeTitle}</h2>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                                {copy.knowledgeSubtitle}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categoryOrder.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                                        activeCategory === category
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {copy.categories[category]} ({articleCounts[category]})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredArticles.map((article) => {
                        const isOpen = openArticleId === article.id;
                        const CategoryIcon = articleCategoryIcons[article.category];

                        return (
                            <article
                                key={article.id}
                                className={`rounded-2xl transition ${
                                    isOpen
                                        ? 'bg-slate-50 dark:bg-slate-900/45'
                                        : 'bg-transparent hover:bg-slate-50/70 dark:hover:bg-slate-900/30'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenArticleId(isOpen ? '' : article.id)}
                                    aria-expanded={isOpen}
                                    className={`flex w-full items-start gap-4 p-4 ${isRtl ? 'text-right' : 'text-left'}`}
                                >
                                    <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-primary dark:bg-slate-800 dark:text-secondary">
                                        <CategoryIcon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                                            {copy.categories[article.category]}
                                        </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-base font-bold text-foreground dark:text-dark-foreground sm:text-lg">
                                                        {article.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                                                        {article.summary}
                                                    </p>
                                                </div>
                                                <ChevronDown className={`mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-4 pb-4">
                                            <ul className="grid gap-2 sm:grid-cols-2">
                                                {article.details.map((detail) => (
                                                    <li
                                                        key={detail}
                                                        className="rounded-2xl bg-white px-3 py-2.5 text-sm leading-5 text-gray-700 shadow-sm dark:bg-slate-900 dark:text-gray-300"
                                                    >
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                    </div>
                                )}
                            </article>
                        );
                    })}

                    {filteredArticles.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-14 text-center dark:border-slate-700">
                            <FileQuestion className="mb-3 h-10 w-10 text-gray-400" />
                            <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">{copy.noResultsTitle}</h3>
                            <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
                                {copy.noResultsDescription}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-[28px] bg-slate-50/85 p-5 dark:bg-slate-900/40 sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground dark:text-dark-foreground">{copy.beforeContactTitle}</h2>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {copy.beforeContactItems.map((item, index) => {
                        const Icon = beforeContactIcons[index] ?? Clock3;

                        return (
                            <div key={item} className="flex gap-3 rounded-2xl bg-white/80 p-3.5 text-sm text-gray-600 dark:bg-slate-950/25 dark:text-gray-400">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-primary dark:bg-slate-800 dark:text-secondary">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="leading-6">{item}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default HelpSupportPage;
