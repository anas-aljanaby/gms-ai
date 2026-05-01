
import type { Alert, Language } from '../types';

export const MOCK_ALERTS: Alert[] = [
    {
        id: 'alert-1',
        text: {
            en: "Project 'PROJ-2024-001' is trending 15% over budget.",
            ar: "مشروع 'PROJ-2024-001' يتجه لتجاوز الميزانية بنسبة 15%."
        },
        priority: 'high',
        timestamp: new Date().toISOString(),
        targetModule: 'projects',
        targetId: 'PROJ-2024-001',
        targetTab: 'cost',
    },
    {
        id: 'alert-2',
        text: {
            en: "New high-value prospect 'Global Tech Fund' identified. Needs initial contact.",
            ar: "تم تحديد عميل محتمل عالي القيمة 'Global Tech Fund'. يحتاج إلى اتصال أولي."
        },
        priority: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'alert-3',
        text: {
            en: "Grant deadline for 'Global Philanthropy Foundation' is in 10 days.",
            ar: "الموعد النهائي لمنحة 'Global Philanthropy Foundation' بعد 10 أيام."
        },
        priority: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: 'alert-4',
        text: {
            en: "Compliance check for vendor 'SupplyCo' is overdue.",
            ar: "فحص الامتثال للمورد 'SupplyCo' متأخر."
        },
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: 'alert-5',
        text: {
            en: "Volunteer engagement score has dropped by 5% this month.",
            ar: "انخفضت درجة تفاعل المتطوعين بنسبة 5% هذا الشهر."
        },
        priority: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: 'alert-6',
        text: {
            en: "Server maintenance scheduled for this weekend. Expect brief downtime.",
            ar: "صيانة الخادم مجدولة في نهاية هذا الأسبوع. توقع فترة توقف قصيرة."
        },
        priority: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
];
