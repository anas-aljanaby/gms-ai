import type { Announcement } from '../types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ann-1',
        date: new Date().toISOString(),
        title: {
            en: 'Welcome to the New MSS.2!',
            ar: 'مرحباً بكم في نظام MSS.2 الجديد!',

        },
        content: {
            en: 'We have completely redesigned the interface for a more intuitive and powerful experience. Explore the new customizable dashboard and AI-powered features.',
            ar: 'لقد أعدنا تصميم الواجهة بالكامل لتجربة أكثر سهولة وقوة. استكشف لوحة القيادة الجديدة القابلة للتخصيص والميزات المدعومة بالذكاء الاصطناعي.',

        },
        isNew: true,
        tag: { text: { en: 'Major Update', ar: 'تحديث رئيسي' }, color: 'bg-blue-500' },
    },
    {
        id: 'ann-2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: {
            en: 'AI-Powered Anomaly Detection is Here',
            ar: 'الكشف عن الحالات الشاذة بالذكاء الاصطناعي متاح الآن',

        },
        content: {
            en: 'Our new Anomaly Detection module helps you spot unusual patterns in your KPIs automatically. Find it under the AI & Automation section.',
            ar: 'وحدة الكشف عن الحالات الشاذة الجديدة تساعدك على اكتشاف الأنماط غير العادية في مؤشرات الأداء الرئيسية تلقائيًا. تجدها في قسم الذكاء الاصطناعي والأتمتة.',

        },
        isNew: true,
        tag: { text: { en: 'New Feature', ar: 'ميزة جديدة' }, color: 'bg-green-500' },
    },
     {
        id: 'ann-3',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: {
            en: 'Improved Reporting Module',
            ar: 'تحسين وحدة التقارير',

        },
        content: {
            en: 'Generating reports is now faster and more customizable. You can also export reports in new formats.',
            ar: 'أصبح إنشاء التقارير الآن أسرع وأكثر قابلية للتخصيص. يمكنك أيضًا تصدير التقارير بتنسيقات جديدة.',

        },
        isNew: false,
        tag: { text: { en: 'Improvement', ar: 'تحسين' }, color: 'bg-purple-500' },
    },
];