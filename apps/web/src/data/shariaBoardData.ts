import type { ShariaBoardMember, ShariaMeeting } from '../types';

export const MOCK_SHARIA_BOARD_MEMBERS: ShariaBoardMember[] = [
  {
    id: 'sbm-001',
    name: { en: 'Dr. Abdullah Al-Fahim', ar: 'د. عبد الله الفهيم' },
    title: { en: 'Sharia Scholar', ar: 'باحث شرعي' },
    photoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=200&auto=format&fit=crop',
    role: 'Chairman',
    status: 'Active',
    email: 'abdullah.f@example.org',
    bio: { en: 'PhD in Islamic Finance, 20+ years of experience.', ar: 'دكتوراه في التمويل الإسلامي، خبرة تزيد عن 20 عامًا.' },
    credentials: ['PhD', 'CIFE'],
  },
  {
    id: 'sbm-002',
    name: { en: 'Sheikh Fatima Al-Mansour', ar: 'الشيخة فاطمة المنصور' },
    title: { en: 'Fiqh Expert', ar: 'خبيرة في الفقه' },
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    role: 'Member',
    status: 'Active',
    email: 'fatima.m@example.org',
    bio: { en: 'Specializes in Islamic contract law.', ar: 'متخصصة في قانون العقود الإسلامية.' },
    credentials: ['MA in Fiqh'],
  },
  {
    id: 'sbm-003',
    name: { en: 'Mr. Omar Hassan', ar: 'السيد عمر حسن' },
    title: { en: 'Islamic Economist', ar: 'اقتصادي إسلامي' },
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    role: 'Member',
    status: 'On Leave',
    email: 'omar.h@example.org',
    bio: { en: 'Focuses on Zakat and Awqaf management.', ar: 'يركز على إدارة الزكاة والأوقاف.' },
    credentials: ['MSc in Islamic Economics'],
  },
  {
    id: 'sbm-004',
    name: { en: 'Dr. Aisha Ibrahim', ar: 'د. عائشة إبراهيم' },
    title: { en: 'Compliance Specialist', ar: 'متخصصة امتثال' },
    photoUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=200&auto=format&fit=crop',
    role: 'Member',
    status: 'Active',
    email: 'aisha.i@example.org',
    bio: { en: 'Expert in AAOIFI standards.', ar: 'خبيرة في معايير هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (AAOIFI).' },
    credentials: ['PhD', 'CSAA'],
  },
  {
    id: 'sbm-005',
    name: { en: 'Mr. Khalid Al-Jamil', ar: 'السيد خالد الجميل' },
    title: { en: 'Secretary', ar: 'أمين سر' },
    photoUrl: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?q=80&w=200&auto=format&fit=crop',
    role: 'Secretary',
    status: 'Active',
    email: 'khalid.j@example.org',
    bio: { en: 'Coordinates all board activities and documentation.', ar: 'ينسق جميع أنشطة المجلس والتوثيق.' },
    credentials: ['BA'],
  },
  {
    id: 'sbm-006',
    name: { en: 'Prof. Mehmet Yildiz', ar: 'البروفيسور محمد يلديز' },
    title: { en: 'External Observer', ar: 'مراقب خارجي' },
    photoUrl: 'https://images.unsplash.com/photo-1520409364224-63400afe26e5?q=80&w=200&auto=format&fit=crop',
    role: 'Observer',
    status: 'Inactive',
    email: 'mehmet.y@example.org',
    bio: { en: 'Retired professor of Islamic Law.', ar: 'أستاذ متقاعد في الشريعة الإسلامية.' },
    credentials: ['Professor Emeritus'],
  }
];

export const MOCK_SHARIA_MEETINGS: ShariaMeeting[] = [
  {
    id: 'sm-1',
    title: { en: 'Q3 Board Review', ar: 'مراجعة المجلس للربع الثالث' },
    date: new Date(new Date().setDate(5)).toISOString(),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Conference Room 1',
    attendees: ['sbm-001', 'sbm-002', 'sbm-004', 'sbm-005'],
    agenda: [
        { topic: { en: 'Review of Q2 Zakat Distribution', ar: 'مراجعة توزيع الزكاة للربع الثاني' }, presenter: 'Mr. Omar Hassan' },
        { topic: { en: 'Approval of new investment product', ar: 'الموافقة على منتج استثماري جديد' }, presenter: 'Dr. Abdullah Al-Fahim' },
    ],
    minutesUrl: '/minutes_q3_review.pdf'
  },
  {
    id: 'sm-2',
    title: { en: 'New Investment Product Review', ar: 'مراجعة منتج استثماري جديد' },
    date: new Date(new Date().setDate(12)).toISOString(),
    startTime: '14:00',
    endTime: '15:30',
    location: 'Online',
    attendees: ['sbm-001', 'sbm-002', 'sbm-004'],
    agenda: [
        { topic: { en: 'Detailed review of Sukuk fund', ar: 'مراجعة تفصيلية لصندوق الصكوك' }, presenter: 'Investment Team' },
    ],
    minutesUrl: '/minutes_investment_review.pdf'
  },
  {
    id: 'sm-3',
    title: { en: 'Zakat Policy Annual Update', ar: 'التحديث السنوي لسياسة الزكاة' },
    date: new Date(new Date().setDate(22)).toISOString(),
    startTime: '11:00',
    endTime: '12:00',
    location: 'Conference Room 1',
    attendees: ['sbm-001', 'sbm-002', 'sbm-003', 'sbm-004', 'sbm-005'],
    agenda: [
        { topic: { en: 'Discuss proposed changes for 2025', ar: 'مناقشة التغييرات المقترحة لعام 2025' }, presenter: 'Dr. Aisha Ibrahim' },
    ],
    minutesUrl: '/minutes_zakat_policy.pdf'
  }
];