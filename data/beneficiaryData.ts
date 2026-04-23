import type { BeneficiaryData, Beneficiary, NeedsAssessment, Milestone } from '../types';
import { MOCK_ORPHAN_DATA } from './orphanData';

const MOCK_ASSESSMENTS: NeedsAssessment[] = [
    {
        id: 'asm-001',
        date: '2024-07-10T10:00:00Z',
        assessor: 'Fatma Kaya',
        povertyScore: 3,
        foodSecurity: 'at_risk',
        housingStatus: 'stable',
        educationalNeeds: 'Needs support for university textbooks and a laptop for studies.',
        suggestedPrograms: ['PROGRAM_EDU_SUPPORT', 'PROGRAM_TECH_GRANT']
    },
    {
        id: 'asm-002',
        date: '2024-06-20T14:00:00Z',
        assessor: 'System',
        povertyScore: 4,
        foodSecurity: 'insecure',
        housingStatus: 'unstable',
        medicalNeeds: 'Requires regular check-ups for two children.',
        suggestedPrograms: ['PROGRAM_FOOD_AID', 'PROGRAM_HOUSING_SUPPORT', 'PROGRAM_HEALTH_CARE']
    },
    {
        id: 'asm-003',
        date: '2024-05-15T09:00:00Z',
        assessor: 'Ali Veli',
        povertyScore: 2,
        foodSecurity: 'secure',
        housingStatus: 'stable',
        educationalNeeds: 'None reported.',
        suggestedPrograms: []
    },
    {
        id: 'asm-004',
        date: '2024-04-10T11:00:00Z',
        assessor: 'John Doe',
        povertyScore: 5,
        foodSecurity: 'insecure',
        housingStatus: 'unstable',
        medicalNeeds: 'Chronic illness support',
        suggestedPrograms: ['PROGRAM_FOOD_AID', 'PROGRAM_HEALTH_CARE']
    }
];

const students: Beneficiary[] = [
    {
      id: 'ben-001',
      name: 'Yusuf Al-Ahmad',
      beneficiaryType: 'student',
      photo: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=200&auto=format&fit=crop',
      type: 'sponsorship',
      country: 'Turkey',
      assessments: [MOCK_ASSESSMENTS[0]],
      milestones: [
        { id: 'm1', title: { en: 'Enrolled in University', ar: 'الالتحاق بالجامعة', tr: 'Üniversiteye Kayıt Oldu' }, status: 'achieved', date: '2023-09-01' },
        { id: 'm2', title: { en: 'Completed First Year', ar: 'إكمال السنة الأولى', tr: 'Birinci Yılı Tamamladı' }, status: 'achieved', date: '2024-06-15' },
        { id: 'm3', title: { en: 'Joined Leadership Program', ar: 'الانضمام لبرنامج التأهيل القيادي', tr: 'Liderlik Programına Katıldı' }, status: 'in-progress', date: '2024-09-01' },
        { id: 'm4', title: { en: 'Internship', ar: 'تدريب عملي', tr: 'Staj' }, status: 'pending' },
        { id: 'm5', title: { en: 'Graduation', ar: 'التخرج', tr: 'Mezuniyet' }, status: 'pending' },
      ],
      profile: {
        academicInfo: {
            level: { en: 'University - 2nd Year', ar: 'جامعة - سنة ثانية', tr: 'Üniversite - 2. Yıl' },
            field: 'Computer Engineering',
            university: 'Istanbul University',
            gpa: 3.4
        },
        dob: '2004-08-15',
        gender: 'Male',
        contact: { email: 'yusuf.a@example.com', phone: '+90 555 123 4567', address: 'Istanbul, Turkey' },
        sponsorshipDetails: { status: 'Active', startDate: '2023-09-01', donorId: 2, studentId: 'stud-001' },
        academicRecords: { school: 'Istanbul University', grade: '2nd Year', gpa: 3.4, reports: [
          { date: '2023-01-15', name: 'Fall 2022 Report', url: '#', gpa: 3.1 },
          { date: '2023-06-10', name: 'Spring 2023 Report', url: '#', gpa: 3.3 },
          { date: '2024-01-15', name: 'Fall 2023 Report', url: '#', gpa: 3.2 },
          { date: '2024-06-10', name: 'Spring 2024 Report', url: '#', gpa: 3.4 }
        ] },
        financialAid: { supportAmount: 250, lastPaymentDate: '2024-07-01', paymentHistory: [{ date: '2024-07-01', amount: 250 }, { date: '2024-06-01', amount: 250 }, { date: '2024-05-01', amount: 250 }] },
        communicationLog: [{ date: '2024-05-20', type: 'Email', notes: 'Checked in on exam preparations.' }],
        qualificationPrograms: [
          { programId: 'leadership', name: { en: 'Leadership Qualification', ar: 'التأهيل القيادي', tr: 'Liderlik Yeterliliği' }, status: 'In Progress' },
          { programId: 'educational', name: { en: 'Educational Development', ar: 'البناء التربوي', tr: 'Eğitim Geliştirme' }, status: 'Completed' }
        ],
        communityInitiatives: [
            { initiativeId: 'proj-1', name: { en: 'Ramadan Iftar Initiative', ar: 'مبادرة إفطار صائم', tr: 'Ramazan İftar Girişimi' }, role: 'Volunteer' }
        ],
        documents: [
            {
                id: 'folder-official', type: 'folder', name: 'Official Documents', accessLevel: 'private', lastModified: '2024-01-01T00:00:00Z',
                children: []
            },
            {
                id: 'folder-ben-1', type: 'folder', name: 'Academic Records', accessLevel: 'team', lastModified: '2024-07-01T00:00:00Z',
                children: [
                     {
                        id: 'file-ben-1', type: 'file', name: 'University Transcript 2024.pdf', fileType: 'pdf', size: 850, uploadedBy: 'Yusuf Al-Ahmad',
                        uploadedDate: '2024-07-01T00:00:00Z', lastModified: '2024-07-01T00:00:00Z', tags: ['academic', 'official'],
                        description: 'Official transcript for the 2023-2024 academic year.', accessLevel: 'private', viewCount: 3,
                        versions: [{ version: 'v1.0', date: '2024-07-01T00:00:00Z', author: 'Yusuf Al-Ahmad', notes: 'Initial upload.', size: 850 }]
                    }
                ]
            },
            {
                id: 'file-ben-2', type: 'file', name: 'Personal ID.jpg', fileType: 'jpg', size: 300, uploadedBy: 'System',
                uploadedDate: '2023-08-15T00:00:00Z', lastModified: '2023-08-15T00:00:00Z', tags: ['id'],
                description: 'Scanned copy of personal identification.', accessLevel: 'private', viewCount: 5,
                versions: [{ version: 'v1.0', date: '2023-08-15T00:00:00Z', author: 'System', notes: 'Initial upload.', size: 300 }]
            }
        ],
        aidLog: [
            { id: 'aid-b1-1', type: 'financial', date: new Date().toISOString(), description: { en: 'Monthly Stipend', ar: 'مخصص شهري', tr: 'Aylık Burs' }, value: 250, unit: 'USD', status: 'Delivered', relatedProjectId: 'proj-educ' },
            { id: 'aid-b1-2', type: 'in-kind', date: '2024-06-15T00:00:00Z', description: { en: 'Laptop for Studies', ar: 'جهاز كمبيوتر محمول للدراسة', tr: 'Eğitim için Dizüstü Bilgisayar' }, value: 1, unit: 'pcs', status: 'Delivered', inventoryItemId: 'ELEC-LAP-01' },
            { id: 'aid-b1-3', type: 'service', date: '2024-05-20T00:00:00Z', description: { en: 'Leadership Workshop Attendance', ar: 'حضور ورشة عمل القيادة', tr: 'Liderlik Atölyesine Katılım' }, value: 8, unit: 'hours', status: 'Delivered' },
            { id: 'aid-b1-4', type: 'financial', date: '2024-08-01T00:00:00Z', description: { en: 'August Stipend', ar: 'مخصص أغسطس', tr: 'Ağustos Bursu' }, value: 250, unit: 'USD', status: 'Scheduled' }
        ]
      },
    },
    {
      id: 'ben-002',
      name: 'Fatima Al-Jamil',
      beneficiaryType: 'student',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      type: 'direct-support',
      country: 'Lebanon',
      projectId: 'proj-educ',
      assessments: [MOCK_ASSESSMENTS[2]],
      profile: {
        academicInfo: {
            level: { en: 'High School - 11th Grade', ar: 'ثانوية - صف حادي عشر', tr: 'Lise - 11. Sınıf' },
            field: 'Science Stream',
            university: 'Beirut International School',
            gpa: 3.8
        },
        dob: '2007-03-22',
        gender: 'Female',
        contact: { email: 'fatima.j@example.com', phone: '+961 3 987 654', address: 'Beirut, Lebanon' },
        sponsorshipDetails: { status: 'Active', startDate: '2024-01-15' },
        financialAid: { supportAmount: 100, lastPaymentDate: '2024-07-05', paymentHistory: [] },
        aidLog: [
            { id: 'aid-b2-1', type: 'financial', date: new Date().toISOString(), description: { en: 'School Fees', ar: 'رسوم مدرسية', tr: 'Okul Ücretleri' }, value: 100, unit: 'USD', status: 'Delivered', relatedProjectId: 'proj-educ' },
        ]
      },
    },
    {
      id: 'ben-003',
      name: 'Ahmad Hussein',
      beneficiaryType: 'student',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
      type: 'direct-support',
      country: 'Turkey',
      projectId: 'proj-lead',
      assessments: [MOCK_ASSESSMENTS[3]],
      profile: {
        academicInfo: {
            level: { en: 'University - 4th Year', ar: 'جامعة - سنة رابعة', tr: 'Üniversite - 4. Yıl' },
            field: 'Business Administration',
            university: 'METU',
            gpa: 3.1
        },
        dob: '2002-11-05',
        gender: 'Male',
        contact: { email: 'ahmad.h@example.com', phone: '+90 555 234 5678', address: 'Ankara, Turkey' },
        sponsorshipDetails: { status: 'Active', startDate: '2024-02-01' },
      },
    },
];

const others: Beneficiary[] = [
    {
        id: 'ben-fam-001',
        name: 'عائلة الأحمد',
        beneficiaryType: 'family',
        photo: 'https://images.unsplash.com/photo-1555952494-033f74201b56?q=80&w=200&auto=format&fit=crop',
        type: 'direct-support',
        country: 'Syria',
        projectId: 'proj-comm',
        assessments: [MOCK_ASSESSMENTS[1]],
        profile: {
            contact: { email: 'family.ahmad@example.com', phone: '+963 912345678', address: 'Damascus, Syria' },
            customData: {
                'رب الأسرة': 'خالد الأحمد',
                'عدد أفراد الأسرة': 5,
                'الحالة السكنية': 'إيجار',
                'متوسط الدخل الشهري': '150 USD',
            },
            aidLog: [
                { id: 'aid-f1-1', type: 'in-kind', date: new Date().toISOString(), description: { en: 'Monthly Food Basket', ar: 'سلة غذائية شهرية', tr: 'Aylık Gıda Paketi' }, value: 75, unit: 'USD', status: 'Delivered', relatedProjectId: 'proj-comm' },
            ]
        }
    },
    ...MOCK_ORPHAN_DATA,
    {
        id: 'ben-haf-001',
        name: 'عبد الرحمن محمود',
        beneficiaryType: 'hafiz',
        photo: 'https://images.unsplash.com/photo-1601053706996-5c5188f57f6a?q=80&w=200&auto=format&fit=crop',
        type: 'sponsorship',
        country: 'Egypt',
        profile: {
             academicInfo: {
                 level: { en: 'Quran Memorization Circle', ar: 'حلقة تحفيظ قرآن', tr: 'Kuran Ezberleme Halkası' },
             }
        }
    },
    {
        id: 'ben-inst-001',
        name: 'مدرسة الأمل',
        beneficiaryType: 'institution',
        photo: 'https://picsum.photos/seed/school/100/100',
        type: 'direct-support',
        country: 'Turkey',
        projectId: 'proj-educ',
        profile: {
            customData: {
                'عدد الطلاب': 250,
                'مدير المدرسة': 'أحمد يلماز'
            }
        }
    },
    {
        id: 'ben-comm-001',
        name: 'مخيم الزعتري للاجئين',
        beneficiaryType: 'community',
        photo: 'https://picsum.photos/seed/zaatari/100/100',
        type: 'direct-support',
        country: 'Jordan',
        projectId: 'proj-comm',
        profile: {
            customData: {
                'عدد السكان التقريبي': 80000,
                'المسؤول الميداني': 'علي حسن'
            }
        }
    },
    {
        id: 'ben-inc-001',
        name: 'فكرة تك',
        beneficiaryType: 'incubation_beneficiary',
        photo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=200&auto=format&fit=crop',
        type: 'direct-support',
        country: 'Turkey',
        projectId: 'proj-incubation', // A new project ID, just for show.
        academicLevel: { en: 'Startup', ar: 'شركة ناشئة', tr: 'Girişim' },
        profile: {
            academicLevel: { en: 'Startup', ar: 'شركة ناشئة', tr: 'Girişim' },
        },
        assessments: [],
        milestones: [],
    }
];

export const INITIAL_BENEFICIARY_DATA: BeneficiaryData = {
  projects: [
    { id: 'proj-lead', name: { en: 'Leadership Building Project', ar: 'مشروع البناء القيادي', tr: 'Liderlik Geliştirme Projesi' } },
    { id: 'proj-educ', name: { en: 'Educational Support Initiative', ar: 'مبادرة الدعم التعليمي', tr: 'Eğitim Desteği Girişimi' } },
    { id: 'proj-comm', name: { en: 'Community Service Program', ar: 'برنامج خدمة المجتمع', tr: 'Toplum Hizmeti Programı' } },
  ],
  beneficiaries: [...students, ...others]
};