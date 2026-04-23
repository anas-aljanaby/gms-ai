import type { Beneficiary } from '../types';

export const MOCK_ORPHAN_DATA: Beneficiary[] = [
  {
    id: 'ben-orp-001',
    name: 'علي خالد',
    beneficiaryType: 'orphan',
    photo: 'https://images.unsplash.com/photo-1519985359926-d63c467a5ee2?q=80&w=200&auto=format&fit=crop',
    type: 'sponsorship',
    country: 'Jordan',
    profile: {
      age: 12,
      city: 'Amman',
      sponsorshipType: 'كاملة',
      sponsor: { id: 'DN-001', name: 'عائشة الفارسي' },
      caseManager: { id: 'user-3', name: 'John Doe' },
      personalInfo: {
        dob: '2012-05-10',
        gender: 'ذكر',
        healthStatus: 'جيدة',
        guardian: 'مريم عبد الله (الأم)',
      },
      academicInfo: {
        grade: 'الصف السادس',
        attendance: '98%',
        level: 'ممتاز',
      },
      socialInfo: {
        familySituation: 'يعيش مع والدته وأخوين أصغر سنًا في شقة مستأجرة.',
        housingStatus: 'جيد',
        familyMembers: [
          { relation: 'الأم', name: 'مريم عبد الله', age: 38 },
          { relation: 'الأخ', name: 'حسن', age: 9 },
          { relation: 'الأخت', name: 'سارة', age: 7 },
        ],
        hobbies: ['كرة القدم', 'القراءة', 'الرسم'],
        needsAndWishes: ['جهاز كمبيوتر محمول للدراسة', 'دروس تقوية في اللغة الإنجليزية', 'دراجة هوائية'],
      },
      programs: {
        educational: { status: 'ملتحق' },
        psychologicalChild: { status: 'مكتمل' },
        psychologicalGuardian: { status: 'بحاجة لتقييم' },
      },
      financial: {
        payments: [
          { month: 1, year: 2024, status: 'paid' }, { month: 2, year: 2024, status: 'paid' },
          { month: 3, year: 2024, status: 'paid' }, { month: 4, year: 2024, status: 'paid' },
          { month: 5, year: 2024, status: 'paid' }, { month: 6, year: 2024, status: 'paid' },
          { month: 7, year: 2024, status: 'due' }, { month: 8, year: 2024, status: 'due' },
          { month: 9, year: 2024, status: 'due' }, { month: 10, year: 2024, status: 'due' },
          { month: 11, year: 2024, status: 'due' }, { month: 12, year: 2024, status: 'due' },
        ],
        log: [
          { type: 'income', description: 'دفعة كفالة شهر يوليو', date: '2024-07-01', amount: 150 },
          { type: 'expense', description: 'رسوم مدرسية', date: '2024-07-05', amount: -50 },
          { type: 'expense', description: 'ملابس العيد', date: '2024-07-10', amount: -40 },
          { type: 'income', description: 'هدية من الكافل', date: '2024-07-15', amount: 25 },
        ],
      },
      calendarEvents: [
        { date: '2024-07-15', type: 'gift', title: 'استلام هدية من الكافل' },
        { date: '2024-08-01', type: 'payment', title: 'دفعة الكفالة مستحقة' },
        { date: '2024-08-10', type: 'occasion', title: 'عيد ميلاد علي' },
        { date: '2024-07-22', type: 'achievement', title: 'حصل على المركز الأول في مسابقة القراءة' },
      ],
      updates: [
        { date: '2024-07-22', author: 'John Doe', note: 'أظهر علي تفوقًا ملحوظًا في مسابقة القراءة على مستوى المدرسة وحصل على المركز الأول.' },
        { date: '2024-06-15', author: 'John Doe', note: 'تم تسليم نتائج الفصل الدراسي الثاني، وحافظ علي على مستواه الممتاز.' },
      ],
      achievements: [
        { date: '2024-07-22', title: 'المركز الأول في مسابقة القراءة', description: 'فاز بالمركز الأول على مستوى المدرسة في مسابقة القراءة السنوية.'},
      ],
      aidLog: [
        { id: 'aid-o1-1', type: 'financial', date: '2024-07-01T00:00:00Z', description: { en: 'July Sponsorship Payment', ar: 'دفعة كفالة يوليو', tr: 'Temmuz Sponsorluk Ödemesi' }, value: 150, unit: 'USD', status: 'Delivered' },
        { id: 'aid-o1-2', type: 'in-kind', date: '2024-07-10T00:00:00Z', description: { en: 'Eid Clothing', ar: 'ملابس العيد', tr: 'Bayramlık Giyim' }, value: 1, unit: 'package', status: 'Delivered', inventoryItemId: 'CL-KID-01' },
        { id: 'aid-o1-3', type: 'service', date: '2024-06-05T00:00:00Z', description: { en: 'Psychological Support Session', ar: 'جلسة دعم نفسي', tr: 'Psikolojik Destek Seansı' }, value: 1, unit: 'session', status: 'Delivered' },
        { id: 'aid-o1-4', type: 'financial', date: '2024-08-01T00:00:00Z', description: { en: 'August Sponsorship Payment', ar: 'دفعة كفالة أغسطس', tr: 'Ağustos Sponsorluk Ödemesi' }, value: 150, unit: 'USD', status: 'Scheduled' },
        { id: 'aid-o1-5', type: 'in-kind', date: '2024-08-15T00:00:00Z', description: { en: 'School Supplies', ar: 'لوازم مدرسية', tr: 'Okul Malzemeleri' }, value: 1, unit: 'kit', status: 'Pending' }
      ]
    },
  },
];