
import type { MarketingMetric, ActivityFeedItem } from '../types';

export const MOCK_MARKETING_METRICS: MarketingMetric[] = [
    { id: 'conversionRate', value: 3.4, trend: 0.5, format: 'percentage' },
    { id: 'emailPerformance', value: 45.3, trend: -2.1, format: 'percentage' },
    { id: 'socialReach', value: 87700, trend: 8.1, format: 'number' },
    { id: 'websiteTraffic', value: 12500, trend: 15.2, format: 'number' },
    { id: 'adPerformance', value: 1.8, trend: -5.4, format: 'number' },
    { id: 'contentEngagement', value: 5.2, trend: 1.1, format: 'percentage' },
    { id: 'campaignROI', value: 420.0, trend: 18.0, format: 'percentage' },
    { id: 'digitalDonations', value: 25678, trend: 22.8, format: 'currency' },
];

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
    {
        id: 'act-1', type: 'donation', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        description: { en: 'New donation received from', ar: 'تم استلام تبرع جديد من' },
        subject: 'Aisha Al-Farsi', link: '#'
    },
    {
        id: 'act-2', type: 'emailSent', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        description: { en: 'Email campaign sent:', ar: 'تم إرسال حملة البريد الإلكتروني:' },
        subject: 'Q3 Newsletter', link: '#'
    },
    {
        id: 'act-3', type: 'socialPost', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
        description: { en: 'New post scheduled on', ar: 'تمت جدولة منشور جديد على' },
        subject: 'Facebook', link: '#'
    },
    {
        id: 'act-4', type: 'adStarted', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        description: { en: 'Ad campaign started:', ar: 'بدأت الحملة الإعلانية:' },
        subject: 'Ramadan Giving 2025', link: '#'
    },
    {
        id: 'act-5', type: 'landingPage', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        description: { en: 'Landing page published:', ar: 'تم نشر الصفحة المقصودة:' },
        subject: 'Water Well Project', link: '#'
    },
];