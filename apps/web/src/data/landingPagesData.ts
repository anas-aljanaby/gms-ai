import type { LandingPage, LandingPageKpi } from '../types';

export const MOCK_LANDING_PAGE_KPIS: LandingPageKpi = {
    totalPages: {
        value: 47,
        breakdown: { published: 32, draft: 10, scheduled: 3, archived: 2 }
    },
    totalViews: {
        value: 125450,
        unique: 98200,
        trend: 18,
    },
    avgConversionRate: {
        value: 8.5,
        trend: 1.2,
        topPerformer: { name: 'Education Donation - Simplified', value: 18.2 }
    },
    totalConversions: {
        value: 10663,
        revenue: 485000,
    }
};


export const MOCK_LANDING_PAGES: LandingPage[] = [
  {
    id: 'lp-001',
    name: 'Ramadan Donation Page 2024',
    type: 'Donation',
    status: 'Published',
    thumbnail: 'https://picsum.photos/seed/lp1/300/200',
    url: '/ramadan-2024',
    performance: { views: 45200, uniqueVisitors: 38500, conversionRate: 12.5, conversions: 4812, bounceRate: 28, avgTimeOnPage: 165 },
    createdAt: '2024-02-28T10:00:00Z',
    createdBy: 'Sarah Miller',
    updatedAt: '2024-03-15T15:45:00Z',
    updatedBy: 'John Doe',
  },
  {
    id: 'lp-002',
    name: 'Education for All - Main',
    type: 'Donation',
    status: 'Published',
    thumbnail: 'https://picsum.photos/seed/lp2/300/200',
    url: '/education-for-all',
    performance: { views: 28500, uniqueVisitors: 24100, conversionRate: 8.0, conversions: 1928, bounceRate: 35, avgTimeOnPage: 140 },
    createdAt: '2023-11-10T11:00:00Z',
    createdBy: 'Sarah Miller',
    updatedAt: '2024-06-20T09:30:00Z',
    updatedBy: 'Sarah Miller',
  },
  {
    id: 'lp-003',
    name: 'Annual Gala 2024 Registration',
    type: 'Event',
    status: 'Archived',
    thumbnail: 'https://picsum.photos/seed/lp3/300/200',
    url: '/gala-2024-registration',
    performance: { views: 8500, uniqueVisitors: 6200, conversionRate: 5.0, conversions: 310, bounceRate: 42, avgTimeOnPage: 110 },
    createdAt: '2024-01-15T14:00:00Z',
    createdBy: 'John Doe',
    updatedAt: '2024-05-01T18:00:00Z',
    updatedBy: 'John Doe',
  },
  {
    id: 'lp-004',
    name: 'Summer Volunteer Signup',
    type: 'Volunteer',
    status: 'Draft',
    thumbnail: 'https://picsum.photos/seed/lp4/300/200',
    url: '/summer-volunteers',
    performance: { views: 0, uniqueVisitors: 0, conversionRate: 0, conversions: 0, bounceRate: 0, avgTimeOnPage: 0 },
    createdAt: '2024-07-01T12:00:00Z',
    createdBy: 'Jane Smith',
    updatedAt: '2024-07-21T10:15:00Z',
    updatedBy: 'Jane Smith',
  },
  {
    id: 'lp-005',
    name: 'Year-End Campaign 2024',
    type: 'Donation',
    status: 'Scheduled',
    thumbnail: 'https://picsum.photos/seed/lp5/300/200',
    url: '/year-end-2024',
    performance: { views: 0, uniqueVisitors: 0, conversionRate: 0, conversions: 0, bounceRate: 0, avgTimeOnPage: 0 },
    createdAt: '2024-07-18T09:00:00Z',
    createdBy: 'Sarah Miller',
    updatedAt: '2024-07-20T17:00:00Z',
    updatedBy: 'Sarah Miller',
  },
];
