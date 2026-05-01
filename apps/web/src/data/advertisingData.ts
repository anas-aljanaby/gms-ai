import type { AdPlatformAccount, AdCampaign } from '../types';

export const MOCK_PLATFORM_ACCOUNTS: AdPlatformAccount[] = [
    {
        id: 'google',
        name: 'Google Ads',
        status: 'connected',
        accountName: 'Nonprofit Org',
        accountId: '123-456-7890',
        metrics: { spend: 8450, activeCampaigns: 12, impressions: 245000, clicks: 12500, ctr: 5.1, conversions: 345, cvr: 2.8, cpc: 0.68 },
        adGrant: { status: 'active', budget: 10000, spend: 8450 }
    },
    {
        id: 'meta',
        name: 'Facebook & Instagram',
        status: 'connected',
        accountName: 'Nonprofit Org Page',
        accountId: '123456789',
        metrics: { spend: 3250, activeCampaigns: 8, impressions: 180000, clicks: 9500, ctr: 5.3, conversions: 178, cvr: 1.9, cpc: 0.34, cpm: 18.05 }
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        status: 'connected',
        accountName: 'Nonprofit Org Company Page',
        metrics: { spend: 1890, activeCampaigns: 4, impressions: 45000, clicks: 1800, ctr: 4.0, conversions: 89, cvr: 4.9, cpc: 1.05 }
    },
    {
        id: 'twitter',
        name: 'X (Twitter)',
        status: 'connected',
        accountName: '@NonprofitOrg',
        metrics: { spend: 680, activeCampaigns: 3, impressions: 95000, clicks: 1500, ctr: 1.6, conversions: 34, cvr: 2.3, cpc: 0.45 }
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        status: 'not-connected',
        metrics: { spend: 0, activeCampaigns: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0, cvr: 0, cpc: 0 }
    },
    {
        id: 'youtube',
        name: 'YouTube',
        status: 'connected',
        accountName: 'Connected via Google Ads',
        metrics: { spend: 1250, activeCampaigns: 5, impressions: 450000, clicks: 3500, ctr: 0.8, conversions: 145, cvr: 4.1, cpc: 0.36, cpv: 0.003, viewRate: 28 }
    }
];

export const MOCK_ACTIVE_CAMPAIGNS: AdCampaign[] = [
    {
        id: 'C001',
        name: 'Ramadan Giving - Search Campaign',
        platform: 'google',
        type: 'Search',
        status: 'Active',
        budget: { type: 'daily', amount: 150, spent: 2450 },
        schedule: { start: '2024-03-01T00:00:00Z', end: '2024-03-31T23:59:59Z' },
        performance: { impressions: 45200, clicks: 2340, ctr: 5.2, conversions: 78, cvr: 3.3, cost: 2450, cpa: 31.41, roas: 2.3 },
        optimizationScore: 78,
    },
    {
        id: 'C002',
        name: 'Impact Stories - Facebook',
        platform: 'meta',
        type: 'Social',
        status: 'Learning',
        budget: { type: 'lifetime', amount: 3000, spent: 850 },
        schedule: { start: '2024-03-10T00:00:00Z', end: '2024-04-10T23:59:59Z' },
        performance: { impressions: 95000, clicks: 3200, ctr: 3.4, conversions: 45, cvr: 1.4, cost: 850, cpa: 18.89, roas: 2.8 },
    },
    {
        id: 'C003',
        name: 'B2B Partnerships - LinkedIn',
        platform: 'linkedin',
        type: 'Social',
        status: 'Active',
        budget: { type: 'daily', amount: 60, spent: 1250 },
        schedule: { start: '2024-03-01T00:00:00Z', end: 'Ongoing' },
        performance: { impressions: 32000, clicks: 980, ctr: 3.1, conversions: 42, cvr: 4.3, cost: 1250, cpa: 29.76, roas: 2.5 },
        optimizationScore: 92,
    },
    {
        id: 'C004',
        name: 'Testimonial Video - YouTube',
        platform: 'youtube',
        type: 'Video',
        status: 'Paused',
        budget: { type: 'daily', amount: 40, spent: 600 },
        schedule: { start: '2024-02-15T00:00:00Z', end: 'Ongoing' },
        performance: { impressions: 220000, clicks: 1800, ctr: 0.8, conversions: 85, cvr: 4.7, cost: 600, cpa: 7.06 },
    },
     {
        id: 'C005',
        name: 'Ramadan Awareness - Twitter',
        platform: 'twitter',
        type: 'Social',
        status: 'Ended',
        budget: { type: 'lifetime', amount: 500, spent: 500 },
        schedule: { start: '2024-03-01T00:00:00Z', end: '2024-03-15T23:59:59Z' },
        performance: { impressions: 85000, clicks: 1200, ctr: 1.4, conversions: 25, cvr: 2.1, cost: 500, cpa: 20.00, roas: 0.9 },
    }
];

export const MOCK_OVERALL_PERFORMANCE = {
    totalSpend: 15970,
    totalImpressions: 1330000,
    totalClicks: 37800,
    totalConversions: 825,
    avgCpc: 0.42,
    avgCpm: 12.00,
    avgCpa: 19.36,
    roas: 2.16
};
