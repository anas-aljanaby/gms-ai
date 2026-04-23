
import type { KnowledgeData } from '../types';

export const MOCK_KNOWLEDGE_DATA: KnowledgeData = {
    articles: [
        {
            id: 'kl-1',
            title: {
                en: 'Best Practices in Volunteer Management',
                ar: 'أفضل الممارسات في إدارة المتطوعين',

            },
            content: {
                en: 'From our experience with over 500 volunteers, we found that continuous communication and clear task assignments are key to retention and satisfaction.',
                ar: 'من خلال تجربتنا مع 500 متطوع، وجدنا أن التواصل المستمر وتحديد المهام بوضوح هما مفتاح الاحتفاظ بالمتطوعين ورضاهم.',

            },
            category: {
                en: 'Volunteer Management',
                ar: 'إدارة التطوع',

            },
            author_id: 'user-ahmed',
            author_name: 'أحمد محمد',
            created_date: '2025-01-15T10:00:00Z',
            views: 45,
            tags: ['volunteer', 'management'],
        },
        {
            id: 'kl-2',
            title: {
                en: 'Guide to Writing Successful Proposals',
                ar: 'دليل كتابة المقترحات الناجحة',

            },
            content: {
                en: 'The basic steps for writing a successful project proposal include defining the problem, outlining the solution, and detailing the budget.',
                ar: 'الخطوات الأساسية لكتابة مقترح مشروع ناجح تشمل تحديد المشكلة، وتوضيح الحل، وتفصيل الميزانية.',

            },
            category: {
                en: 'Fundraising',
                ar: 'تطوير الأعمال',

            },
            author_id: 'user-fatma',
            author_name: 'فاطمة أحمد',
            created_date: '2025-01-10T11:00:00Z',
            views: 78,
            tags: ['fundraising', 'proposals'],
        },
        {
            id: 'kl-3',
            title: {
                en: 'Effective Communication Strategies',
                ar: 'استراتيجيات التواصل الفعال',

            },
            content: {
                en: 'Communication is the backbone of institutional work. Establishing regular communication channels and being transparent builds trust.',
                ar: 'التواصل هو عصب العمل المؤسسي. إن إنشاء قنوات اتصال منتظمة والتحلي بالشفافية يبني الثقة.',

            },
            category: {
                en: 'Other',
                ar: 'أخرى',

            },
            author_id: 'user-mohammed',
            author_name: 'محمد علي',
            created_date: '2024-12-20T12:00:00Z',
            views: 23,
            tags: ['communication'],
        },
    ],
    points: [
        {
            user_id: '1',
            user_name: 'أحمد محمد',
            avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=200&auto=format&fit=crop',
            total_points: 15,
            contributions: 5,
            last_contribution: '2025-01-15T10:00:00Z',
        },
        {
            user_id: '2',
            user_name: 'فاطمة أحمد',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
            total_points: 12,
            contributions: 4,
            last_contribution: '2025-01-10T11:00:00Z',
        },
        {
            user_id: '3',
            user_name: 'محمد علي',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            total_points: 10,
            contributions: 3,
            last_contribution: '2024-12-20T12:00:00Z',
        },
    ]
};
