import type { Communication } from '../types';

export const MOCK_COMMUNICATIONS: Communication[] = [
  // DN-001: Aisha Al-Farsi - Responds quickly in the evening, clicks links
  {
    communication_id: 'C1-1', donor_id: 'DN-001', communication_type: 'email',
    sent_at: '2024-05-18T10:00:00Z', opened_at: '2024-05-18T19:05:00Z', clicked_at: '2024-05-18T19:06:00Z',
    subject: 'Your Impact in Q1', status: 'clicked'
  },
  {
    communication_id: 'C1-2', donor_id: 'DN-001', communication_type: 'email',
    sent_at: '2024-04-15T11:00:00Z', opened_at: '2024-04-15T20:30:00Z', response_at: '2024-04-15T20:45:00Z',
    subject: 'Thank You for Your Donation', status: 'responded'
  },

  // DN-002: John Smith - Opens in the morning, sometimes responds
  {
    communication_id: 'C2-1', donor_id: 'DN-002', communication_type: 'email',
    sent_at: '2024-05-30T14:00:00Z', opened_at: '2024-05-31T08:15:00Z',
    subject: 'Monthly Update', status: 'opened'
  },
  {
    communication_id: 'C2-2', donor_id: 'DN-002', communication_type: 'sms',
    sent_at: '2024-04-20T12:00:00Z', opened_at: '2024-04-20T12:05:00Z', response_at: '2024-04-21T09:00:00Z',
    subject: 'Quick Question', status: 'responded'
  },

  // DN-003: Fatma Yılmaz - Low engagement
  {
    communication_id: 'C3-1', donor_id: 'DN-003', communication_type: 'email',
    sent_at: '2024-02-10T09:00:00Z', status: 'sent',
    subject: 'Re-engagement Email'
  },
  {
    communication_id: 'C3-2', donor_id: 'DN-003', communication_type: 'email',
    sent_at: '2024-05-05T09:00:00Z', status: 'ignored',
    subject: 'Follow-up'
  },
  
  // DN-004: David Chen - Prefers calls, opens emails but doesn't interact
   {
    communication_id: 'C4-1', donor_id: 'DN-004', communication_type: 'email',
    sent_at: '2024-02-20T16:00:00Z', opened_at: '2024-02-21T11:00:00Z',
    subject: 'Impact Report', status: 'opened'
  },
   {
    communication_id: 'C4-2', donor_id: 'DN-004', communication_type: 'call',
    sent_at: '2024-01-15T15:00:00Z', response_at: '2024-01-15T15:30:00Z',
    subject: 'Annual Check-in', status: 'responded'
  },
];
