import type { MessagingCampaign } from '../types';

export const MOCK_SMS_CHANNEL_STATS = {
  messagesSent: 8450,
  deliveryRate: 96.8,
  responseRate: 18.5,
  optOutRate: 0.08,
  provider: 'Twilio',
  balance: 245.80
};

export const MOCK_WHATSAPP_CHANNEL_STATS = {
  messagesSent: 12340,
  deliveryRate: 98.2,
  readRate: 87.3,
  responseRate: 34.2,
  optOutRate: 0.05,
  accountName: 'Nonprofit Organization',
  phoneNumber: '+90 555 123 4567',
  qualityRating: 'High',
  templates: {
    approved: 24,
    pending: 3,
    rejected: 1,
  },
};

export const MOCK_SMS_WHATSAPP_CAMPAIGNS: MessagingCampaign[] = [
  {
    id: 'MSG-001',
    name: { en: 'Ramadan Impact Update - SMS', ar: 'تحديث أثر رمضان - رسائل قصيرة' },
    channel: 'sms',
    status: 'Sent',
    sentDate: '2024-07-15T10:30:00Z',
    recipients: { count: 5432, listName: 'Active Donors' },
    delivered: { count: 5261, rate: 96.9 },
    responded: { count: 1023, rate: 19.4 },
    optOuts: { count: 3, rate: 0.06 },
    cost: { total: 543.20, perMessage: 0.10 },
  },
  {
    id: 'MSG-002',
    name: { en: 'Event Reminder - WhatsApp', ar: 'تذكير بالفعالية - واتساب' },
    channel: 'whatsapp',
    status: 'Sent',
    sentDate: '2024-07-18T14:00:00Z',
    recipients: { count: 850, listName: 'Gala Attendees' },
    delivered: { count: 845, rate: 99.4 },
    read: { count: 798, rate: 94.4 },
    responded: { count: 312, rate: 36.9 },
    optOuts: { count: 1, rate: 0.01 },
    cost: { total: 68.00, perMessage: 0.08 },
  },
  {
    id: 'MSG-003',
    name: { en: 'Education Appeal - SMS', ar: 'نداء التعليم - رسائل قصيرة' },
    channel: 'sms',
    status: 'Scheduled',
    scheduledDate: '2024-08-01T09:00:00Z',
    recipients: { count: 12500, listName: 'Newsletter Subscribers' },
    delivered: { count: 0, rate: 0 },
    responded: { count: 0, rate: 0 },
    optOuts: { count: 0, rate: 0 },
    cost: { total: 1250.00, perMessage: 0.10 },
  },
];
