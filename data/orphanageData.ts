import type { Orphanage } from '../types';

export const MOCK_ORPHANAGES: Orphanage[] = [
  {
    id: 'ORPH-003',
    name: {
      en: 'Al-Noor Center for Orphans',
      ar: 'مركز النور للأيتام'
    },
    country: 'Saudi Arabia',
    city: 'Riyadh',
    logo: '🌟',
    status: 'Under Review',
    capacity: 120,
    beneficiaryCount: 110,
    budget: 300000,
    manager: 'Aisha Al-Farsi'
  },
  {
    id: 'ORPH-002',
    name: {
      en: 'Future Generation Home',
      ar: 'بيت جيل المستقبل'
    },
    country: 'Jordan',
    city: 'Amman',
    logo: '🏠',
    status: 'Active',
    capacity: 50,
    beneficiaryCount: 48,
    budget: 150000,
    manager: 'Omar Hassan'
  },
  {
    id: 'ORPH-001',
    name: {
      en: 'Hope Shelter Orphanage',
      ar: 'دار أيتام ملجأ الأمل'
    },
    country: 'Turkey',
    city: 'Istanbul',
    logo: '🤝',
    status: 'Active',
    capacity: 100,
    beneficiaryCount: 85,
    budget: 250000,
    manager: 'Fatma Yılmaz'
  },
  {
    id: 'ORPH-005',
    name: {
      en: 'Anatolian Children Village',
      ar: 'قرية أطفال الأناضول'
    },
    country: 'Turkey',
    city: 'Ankara',
    logo: '🏡',
    status: 'Inactive',
    capacity: 200,
    beneficiaryCount: 0,
    budget: 500000,
    manager: 'Ali Veli'
  },
  {
    id: 'ORPH-004',
    name: {
      en: 'Peace & Smile Orphanage',
      ar: 'دار السلام والابتسامة'
    },
    country: 'Lebanon',
    city: 'Beirut',
    logo: '😊',
    status: 'Active',
    capacity: 75,
    beneficiaryCount: 60,
    budget: 180000,
    manager: 'John Smith'
  }
];
