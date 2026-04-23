import type { Language } from '../types';

export interface ShariaKpiData {
    complianceRate: number;
    pendingFatwas: number;
    recentAlerts: number;
    zakatDistribution: { current: number; target: number; };
    contractsUnderReview: number;
}

export interface ShariaAlert {
    id: string;
    priority: 'critical' | 'warning';
    text: Record<Language, string>;
    timestamp: string;
}

export interface ShariaActivity {
    id: string;
    icon: string;
    text: Record<Language, string>;
    timestamp: string;
}

export const MOCK_SHARIA_KPI_DATA: ShariaKpiData = {
    complianceRate: 98.7,
    pendingFatwas: 3,
    recentAlerts: 1,
    zakatDistribution: { current: 185000, target: 250000 },
    contractsUnderReview: 5,
};

export const MOCK_SHARIA_ALERTS: ShariaAlert[] = [
    { id: 'sa-1', priority: 'critical', text: { en: 'Interest-bearing transaction detected in account ****1234', ar: 'تم كشف معاملة ربوية في حساب ****1234' }, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'sa-2', priority: 'warning', text: { en: 'Contract C-456 with "Global Tech" includes a penalty clause needing review', ar: 'العقد C-456 مع "Global Tech" يتضمن شرط جزائي يحتاج للمراجعة' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'sa-3', priority: 'warning', text: { en: 'Zakat distribution to "Education" category nearing its 30% limit', ar: 'توزيع الزكاة على فئة "التعليم" يقترب من حده الأقصى 30%' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
];

export const MOCK_COMPLIANCE_TREND_DATA = [
    { name: 'Jan', compliance: 98.2 },
    { name: 'Feb', compliance: 98.5 },
    { name: 'Mar', compliance: 97.9 },
    { name: 'Apr', compliance: 98.8 },
    { name: 'May', compliance: 99.1 },
    { name: 'Jun', compliance: 98.7 },
];

export const MOCK_SHARIA_ACTIVITIES: ShariaActivity[] = [
    { id: 'act-1', icon: '⚖️', text: { en: 'Fatwa #123 regarding cryptocurrency was issued', ar: 'تم إصدار الفتوى رقم 123 بخصوص العملات الرقمية' }, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'act-2', icon: '📄', text: { en: 'Contract #C-45 approved by Sharia board', ar: 'تمت الموافقة على العقد رقم C-45 من قبل الهيئة الشرعية' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: 'act-3', icon: '💰', text: { en: 'New Zakat expenditure of $5,000 logged', ar: 'تم تسجيل نفقة زكاة جديدة بقيمة 5,000 دولار' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
    { id: 'act-4', icon: '👥', text: { en: 'Sharia board meeting scheduled for Jul 30, 2024', ar: 'تم تحديد اجتماع الهيئة الشرعية في 30 يوليو 2024' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];
