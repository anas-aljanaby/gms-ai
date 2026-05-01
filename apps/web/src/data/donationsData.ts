
import type { Donation } from '../types';

// This data is designed to test all classification categories.
export const MOCK_DONATIONS: Donation[] = [
  // DN-001: Aisha Al-Farsi -> Should be Hero Donor (11 donations, > $5000)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `D1-${i}`, donorId: 'DN-001', amount: 1500, date: new Date(2024, 6 - i, 15).toISOString(), program: 'Education'
  })),

  // DN-002: John Smith -> Should be Recurring Donor
  { id: 'D2-1', donorId: 'DN-002', amount: 200, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), program: 'Healthcare' },
  { id: 'D2-2', donorId: 'DN-002', amount: 200, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), program: 'Healthcare' },
  { id: 'D2-3', donorId: 'DN-002', amount: 200, date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), program: 'Community' },
  { id: 'D2-4', donorId: 'DN-002', amount: 150, date: new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString(), program: 'Healthcare' },
  
  // DN-003: Fatma Yılmaz -> Should be Dormant Donor
  { id: 'D3-1', donorId: 'DN-003', amount: 500, date: '2023-08-18T10:00:00Z', program: 'Community' },
  { id: 'D3-2', donorId: 'DN-003', amount: 300, date: '2023-01-10T10:00:00Z', program: 'Community' },
  
  // DN-004: David Chen -> Should be Hero Donor (>$5000)
  { id: 'D4-1', donorId: 'DN-004', amount: 100000, date: '2024-02-28T10:00:00Z', program: 'Endowment' },
  { id: 'D4-2', donorId: 'DN-004', amount: 25000, date: '2023-08-01T10:00:00Z', program: 'Legacy' },

  // DN-005: Maria Garcia -> Should be Event Donor
  { id: 'D5-1', donorId: 'DN-005', amount: 500, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), program: 'Disaster Relief' },

  // DN-006: Kenji Tanaka -> Should be Seasonal Donor (all in July)
  { id: 'D6-1', donorId: 'DN-006', amount: 400, date: '2024-07-05T10:00:00Z', program: 'Disaster Relief' },
  { id: 'D6-2', donorId: 'DN-006', amount: 400, date: '2023-07-15T10:00:00Z', program: 'Healthcare' },
  { id: 'D6-3', donorId: 'DN-006', amount: 400, date: '2022-07-30T10:00:00Z', program: 'Disaster Relief' },
  
  // DN-007: Omar Hassan -> Should be New Donor (no donations)
];
