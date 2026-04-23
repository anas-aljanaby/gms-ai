import type { Partner } from '../types';

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p-1', name: "مؤسسة التنمية المستدامة", logo: "TD", country: "🇸🇦 السعودية", sector: "التنمية", status: "نشط", projectsCompleted: 15, projectsInProgress: 3, rating: 5.0, budget: 250000,
    phone: "N/A",
    email: "info@sds.org.sa",
    website: "sds.org.sa",
    address: "N/A",
    coordinates: null,
    contacts: [
      { id: 'pc-1', name: 'سارة عبدالله', position: 'مديرة البرامج', email: 's.abdullah@sds.org.sa', phone: '+966 11 123 4567', isPrimary: true, photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' },
      { id: 'pc-2', name: 'أحمد خالد', position: 'مسؤول ميداني', email: 'a.khaled@sds.org.sa', phone: '+966 11 987 6543', isPrimary: false, photoUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200&auto=format&fit=crop' },
      { id: 'pc-3', name: 'فاطمة الزهراء', position: 'منسقة المشاريع', email: 'f.zahra@sds.org.sa', phone: '+966 11 555 7890', isPrimary: false, photoUrl: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=200&auto=format&fit=crop' },
    ]
  },
  { id: 'p-2', name: "جمعية الإغاثة الدولية", logo: "JE", country: "🇹🇷 تركيا", sector: "الإغاثة", status: "نشط", projectsCompleted: 12, projectsInProgress: 5, rating: 4.8, budget: 180000 },
  { id: 'p-3', name: "منظمة الصحة المجتمعية", logo: "MS", country: "🇪🇬 مصر", sector: "الصحة", status: "نشط", projectsCompleted: 10, projectsInProgress: 2, rating: 4.5, budget: 320000 },
  { id: 'p-4', name: "مبادرة التعليم للجميع", logo: "MT", country: "🇯🇴 الأردن", sector: "التعليم", status: "نشط", projectsCompleted: 9, projectsInProgress: 4, rating: 4.3, budget: 450000 },
  { id: 'p-5', name: "شركاء البيئة الخضراء", logo: "SB", country: "🇲🇦 المغرب", sector: "البيئة", status: "قيد المراجعة", projectsCompleted: 8, projectsInProgress: 1, rating: 4.2, budget: 95000 },
  { id: 'p-6', name: "مؤسسة الأمل الخيرية", logo: "MA", country: "🇸🇦 السعودية", sector: "التعليم", status: "نشط", projectsCompleted: 22, projectsInProgress: 6, rating: 4.9, budget: 600000 },
  { id: 'p-7', name: "جمعية البناء المستدام", logo: "JB", country: "🇦🇪 الإمارات", sector: "التنمية", status: "نشط", projectsCompleted: 5, projectsInProgress: 1, rating: 4.0, budget: 150000 },
  { id: 'p-8', name: "منظمة الطفولة السعيدة", logo: "MT", country: "🇱🇧 لبنان", sector: "التنمية", status: "غير نشط", projectsCompleted: 18, projectsInProgress: 0, rating: 3.8, budget: 220000 },
  { id: 'p-9', name: "مركز الرعاية الصحية", logo: "MR", country: "🇰🇼 الكويت", sector: "الصحة", status: "نشط", projectsCompleted: 7, projectsInProgress: 3, rating: 4.6, budget: 310000 },
  { id: 'p-10', name: "شركاء الغذاء والتغذية", logo: "SG", country: "🇸🇩 السودان", sector: "الإغاثة", status: "نشط", projectsCompleted: 25, projectsInProgress: 8, rating: 4.1, budget: 550000 },
  { id: 'p-11', name: "مبادرة المياه النظيفة", logo: "MM", country: "🇾🇪 اليمن", sector: "البيئة", status: "نشط", projectsCompleted: 11, projectsInProgress: 2, rating: 4.7, budget: 120000 },
  { id: 'p-12', name: "جمعية التمكين الاقتصادي", logo: "JT", country: "🇶🇦 قطر", sector: "التنمية", status: "نشط", projectsCompleted: 6, projectsInProgress: 1, rating: 4.4, budget: 280000 },
];