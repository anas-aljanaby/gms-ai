import type { SocialAccount, MarketingMetric, SocialPost } from '../types';

export const MOCK_SOCIAL_ACCOUNTS: SocialAccount[] = [
    {
        id: 'facebook',
        name: 'Facebook',
        status: 'connected',
        profile: { name: 'Global Relief Foundation', handle: 'globalrelief', avatar: 'https://picsum.photos/seed/GPF/100/100' },
        stats: { followers: 12543, followerTrend: 2.0 }
    },
    {
        id: 'instagram',
        name: 'Instagram',
        status: 'connected',
        profile: { name: 'Global Relief', handle: '@globalrelief', avatar: 'https://picsum.photos/seed/Innovate/100/100' },
        stats: { followers: 8543, followerTrend: 1.4 }
    },
    {
        id: 'twitter',
        name: 'Twitter',
        status: 'not-connected',
        profile: { name: '', handle: '', avatar: '' },
        stats: { followers: 0, followerTrend: 0 }
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        status: 'connected',
        profile: { name: 'Global Relief Foundation', handle: 'global-relief-foundation', avatar: 'https://picsum.photos/seed/Solidarity/100/100' },
        stats: { followers: 2134, followerTrend: 0.8 }
    },
     {
        id: 'youtube',
        name: 'YouTube',
        status: 'error',
        profile: { name: 'Global Relief TV', handle: 'globalrelieftv', avatar: 'https://picsum.photos/seed/WHB/100/100' },
        stats: { followers: 950, followerTrend: -0.5 }
    },
     {
        id: 'tiktok',
        name: 'TikTok',
        status: 'not-connected',
        profile: { name: '', handle: '', avatar: '' },
        stats: { followers: 0, followerTrend: 0 }
    },
];

export const MOCK_SOCIAL_PERFORMANCE_METRICS: MarketingMetric[] = [
    { id: 'totalReach', value: 2500000, trend: 18.5, format: 'number' },
    { id: 'totalEngagement', value: 18234, trend: 12.3, format: 'number' },
    { id: 'engagementRate', value: 3.2, trend: 0.5, format: 'percentage' },
    { id: 'followerGrowth', value: 1250, trend: 8.3, format: 'number' },
];

// Add some mock social posts for the calendar
export const MOCK_SOCIAL_POSTS: SocialPost[] = [
    {
        id: 'sp-1',
        platform: 'facebook',
        status: 'published',
        scheduledTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        content: 'Thank you for your amazing support during our latest campaign!',
    },
    {
        id: 'sp-2',
        platform: 'instagram',
        status: 'published',
        scheduledTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        content: 'A look behind the scenes at our distribution center.',
    },
     {
        id: 'sp-3',
        platform: 'twitter',
        status: 'scheduled',
        scheduledTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        content: 'Upcoming webinar on sustainable development goals. Join us!',
    },
     {
        id: 'sp-4',
        platform: 'facebook',
        status: 'scheduled',
        scheduledTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        content: 'Detailed post about the webinar with registration link.',
    },
];
