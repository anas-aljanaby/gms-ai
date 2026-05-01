import type { LeadershipData, TeamMember } from '../types';

// Helper function to create a map of all team members for easy lookup
const createTeamMemberMap = (data: LeadershipData): Map<string, TeamMember> => {
  const map = new Map<string, TeamMember>();
  data.units.forEach(unit => {
    unit.team.forEach(member => {
      map.set(member.name, member);
    });
  });
  return map;
};

const rawData: Omit<LeadershipData, 'units'> & { units: any[] } = {
  units: [
    // Educational Development
    {
      id: 'educational',
      name: { en: 'Educational Development', ar: 'البناء التربوي' },
      team: [
        { id: 't-ahmad', name: 'أ. عبد الرحمن الأحمد', type: 'volunteer', photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=200&auto=format&fit=crop' },
        { id: 't-omar', name: 'عمر عز الدين', type: 'volunteer', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop' },
        { id: 't-ani', name: 'محمد العاني', type: 'staff', photo: 'https://images.unsplash.com/photo-1583067130547-90f77c3856d1?q=80&w=200&auto=format&fit=crop' },
      ],
      stages: [
        {
          id: 's1',
          title: { en: 'Second Semester', ar: 'الفصل الدراسي الثاني' },
          events: [
            { id: 'e1', title: { en: 'Values Workshop', ar: 'ورشة عمل القيم' }, type: 'workshop', facilitator: 'عمر عز الدين', date: '2024-05-10T10:00:00Z', status: 'completed', completionDate: '2024-05-10T10:00:00Z', attendanceRate: 95, location: 'Hall A', startTime: '10:00', endTime: '12:00', budget: 1500, duration: 120 },
            { id: 'e2', title: { en: 'Goal Setting Lecture', ar: 'محاضرة تحديد الأهداف' }, type: 'lecture', facilitator: 'محمد العاني', date: '2024-06-25T14:00:00Z', status: 'completed', completionDate: '2024-06-28T14:00:00Z', attendanceRate: 88, location: 'Main Auditorium', budget: 500, duration: 90 },
            { id: 'e20', title: { en: 'Past Planned Event', ar: 'فعالية سابقة مخطط لها' }, type: 'workshop', facilitator: 'أ. عبد الرحمن الأحمد', date: '2024-04-01T10:00:00Z', status: 'missed' },
          ],
        },
        {
          id: 's2',
          title: { en: 'First Semester', ar: 'الفصل الدراسي الأول' },
          events: [
            { id: 'e3', title: { en: 'Public Speaking Course', ar: 'دورة الإلقاء والخطابة' }, type: 'course', facilitator: 'محمد العاني', date: '2024-02-15T09:00:00Z', status: 'completed', completionDate: '2024-02-15T09:00:00Z', attendanceRate: 92, location: 'Room 101', budget: 2500, duration: 240 },
            { id: 'e4', title: { en: 'Cancelled Event Example', ar: 'مثال لفعالية ملغاة' }, type: 'lecture', facilitator: 'عمر عز الدين', date: '2024-03-01T11:00:00Z', status: 'cancelled' },
            { id: 'e21', title: { en: 'Critical Thinking', ar: 'التفكير الناقد' }, type: 'workshop', facilitator: 'أ. عبد الرحمن الأحمد', date: '2024-03-20T10:00:00Z', status: 'completed', completionDate: '2024-03-19T10:00:00Z', attendanceRate: 98, location: 'Library', budget: 1200, duration: 180 },
          ],
        },
        {
          id: 's3',
          title: { en: 'Summer Break', ar: 'العطلة الصيفية' },
          events: [],
        },
      ],
    },
    // Leadership Qualification
    {
      id: 'leadership',
      name: { en: 'Leadership Qualification', ar: 'التأهيل القيادي' },
      team: [
        { id: 't-imad', name: 'د. عماد الحمداني', type: 'staff', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      ],
      stages: [
        {
          id: 's1',
          title: { en: 'Second Semester', ar: 'الفصل الدراسي الثاني' },
          events: [],
        },
        {
          id: 's2',
          title: { en: 'First Semester', ar: 'الفصل الدراسي الأول' },
          events: [
            { id: 'lead-course-6', title: { en: 'Team Roles', ar: 'أدوار فريق العمل' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-09-01T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-7', title: { en: 'Team Networking', ar: 'التشبيك بين أفراد فريق العمل' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-09-08T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-8', title: { en: 'Leadership Empowerment', ar: 'التمكين القيادي' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-09-15T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'e6', title: { en: 'Conflict Resolution', ar: 'حل النزاعات' }, type: 'workshop', facilitator: 'د. عماد الحمداني', date: '2024-09-20T10:00:00Z', status: 'planned', startTime: '10:00', endTime: '13:00' },
            { id: 'lead-course-9', title: { en: 'Leadership Coaching', ar: 'الكوتشينغ القيادي' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-09-22T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-10', title: { en: 'Designing Future-Measured Goals', ar: 'تصميم الأهداف ذات القياس المستقبلي' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-09-29T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-11', title: { en: 'Designing Achievement Dashboard', ar: 'تصميم لوحة الإنجاز مع الإطار المحاسبي' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-10-06T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-12', title: { en: 'Fostering Innovation', ar: 'تحفيز الابتكار' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-10-13T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-13', title: { en: 'Leading Change', ar: 'قيادة التغيير' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-10-20T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-14', title: { en: 'Building Relationships', ar: 'بناء العلاقات' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-10-27T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-15', title: { en: 'Understanding & Connecting with Others', ar: 'فهم الآخرين والاتصال بهم' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-11-03T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' }
          ],
        },
        {
          id: 's3',
          title: { en: 'Summer Break', ar: 'العطلة الصيفية' },
          events: [
            { id: 'lead-course-1', title: { en: 'Values System', ar: 'منظومة القيم' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-07-28T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-2', title: { en: 'Personal Productivity', ar: 'الإنتاجية الشخصية' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-08-04T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'e5', title: { en: 'Leadership Theories', ar: 'نظريات القيادة' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-08-05T18:00:00Z', status: 'planned', startTime: '18:00' },
            { id: 'lead-course-3', title: { en: 'Future Perspective', ar: 'المنظور المستقبلي' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-08-11T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-4', title: { en: 'Guiding Vision', ar: 'الرؤية المرشدة' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-08-18T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' },
            { id: 'lead-course-5', title: { en: 'Team Building', ar: 'بناء فريق العمل' }, type: 'lecture', facilitator: 'د. عماد الحمداني', date: '2024-08-25T07:00:00.000Z', status: 'planned', startTime: '10:00', endTime: '12:00', location: 'Online' }
          ],
        },
      ],
    },
     // Scout Unit
    {
      id: 'scout',
      name: { en: 'Scout Unit', ar: 'الوحدة الكشفية' },
      team: [
        { id: 't-musab', name: 'د. مصعب', type: 'volunteer', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      ],
      stages: [
        {
          id: 's1',
          title: { en: 'Second Semester', ar: 'الفصل الدراسي الثاني' },
          events: [
            { id: 'scout-e1', title: { en: 'Scout Workshop - First Aid', ar: 'ورشة كشفية - الإسعافات الأولية' }, type: 'workshop', facilitator: 'د. مصعب', date: '2025-04-15T11:00:00Z', status: 'planned' },
            { id: 'scout-e2', title: { en: 'Scout Trip - Nature Exploration', ar: 'رحلة كشفية - استكشاف الطبيعة' }, type: 'camp', facilitator: 'د. مصعب', date: '2025-05-22T08:00:00Z', status: 'planned' },
          ],
        },
        {
          id: 's2',
          title: { en: 'First Semester', ar: 'الفصل الدراسي الأول' },
          events: [
             { id: 'scout-e3', title: { en: 'Winter Camp - Skill Building', ar: 'مخيم الشتاء - بناء المهارات' }, type: 'camp', facilitator: 'د. مصعب', date: '2025-01-20T08:00:00Z', status: 'planned', isMultiDay: true, endDate: '2025-01-23T17:00:00Z' },
             { id: 'scout-e4', title: { en: 'Scout Activity - Survival Skills', ar: 'نشاط كشفي - مهارات البقاء' }, type: 'workshop', facilitator: 'د. مصعب', date: '2025-02-18T11:00:00Z', status: 'planned' },
          ],
        },
        {
          id: 's3',
          title: { en: 'Summer Break', ar: 'العطلة الصيفية' },
          events: [
            { id: 'scout-e5', title: { en: 'Summer Camp - Leadership & Adventure', ar: 'مخيم صيفي - القيادة والمغامرة' }, type: 'camp', facilitator: 'د. مصعب', date: '2024-07-15T08:00:00Z', status: 'planned' },
          ],
        },
      ],
    },
    // Student Environment
     {
      id: 'student_environment',
      name: { en: 'Student Environment', ar: 'البيئة الطلابية' },
      team: [
        { id: 't-kubaisi', name: 'أ. محمد الكبيسي', type: 'staff', photo: 'https://images.unsplash.com/photo-1542327897-4141ce251543?q=80&w=200&auto=format&fit=crop' },
      ],
      stages: [
        {
          id: 's1',
          title: { en: 'Second Semester', ar: 'الفصل الدراسي الثاني' },
          events: [
            { id: 'se-e3', title: { en: 'Football League', ar: 'دوري كرة القدم' }, type: 'activity', facilitator: 'أ. محمد الكبيسي', date: '2025-03-10T16:00:00Z', isMultiDay: true, endDate: '2025-05-10T18:00:00Z', status: 'planned', location: 'Sports Field' },
            { id: 'se-e6', title: { en: 'Educational Visits', ar: 'زيارات علمية' }, type: 'activity', facilitator: 'أ. محمد الكبيسي', date: '2025-03-25T09:00:00Z', status: 'planned', location: 'Science Museum' },
            { id: 'se-e5', title: { en: 'Student Needs Follow-up', ar: 'متابعة احتياجات الطلاب' }, type: 'meeting', facilitator: 'أ. محمد الكبيسي', date: '2025-04-10T11:00:00Z', status: 'planned', location: 'Student Affairs Office' },
          ],
        },
        {
          id: 's2',
          title: { en: 'First Semester', ar: 'الفصل الدراسي الأول' },
          events: [
            { id: 'e10', title: { en: 'Welcome Event', ar: 'الحفل الترحيبي' }, type: 'lecture', facilitator: 'أ. محمد الكبيسي', date: '2024-09-15T12:00:00Z', status: 'planned' },
            { id: 'se-e1', title: { en: 'New Students Reception', ar: 'استقبال الطلاب الجدد' }, type: 'ceremony', facilitator: 'أ. محمد الكبيسي', date: '2024-09-20T10:00:00Z', status: 'planned', location: 'Main Hall' },
            { id: 'se-e2', title: { en: '11th Cohort Welcome Ceremony', ar: 'حفل استقبال الدفعة الحادية عشر' }, type: 'ceremony', facilitator: 'أ. محمد الكبيسي', date: '2024-09-27T14:00:00Z', status: 'planned', location: 'Auditorium' },
            { id: 'e9', title: { en: 'University Clubs Fair', ar: 'معرض الأندية الجامعية' }, type: 'workshop', facilitator: 'أ. محمد الكبيسي', date: '2024-10-10T12:00:00Z', status: 'planned' },
          ],
        },
        {
          id: 's3',
          title: { en: 'Summer Break', ar: 'العطلة الصيفية' },
          events: [
            { id: 'se-e4', title: { en: 'Tourism Trips', ar: 'سفرات سياحية' }, type: 'camp', facilitator: 'أ. محمد الكبيسي', date: '2024-07-20T08:00:00Z', isMultiDay: true, endDate: '2024-07-22T20:00:00Z', status: 'planned', location: 'Cultural Sites' },
            { id: 'se-e7', title: { en: 'Youth Recreational Trips', ar: 'سفرات شبابية ترفيهية' }, type: 'camp', facilitator: 'أ. محمد الكبيسي', date: '2024-08-10T09:00:00Z', status: 'planned', location: 'Amusement Park' },
          ],
        },
      ],
    },
  ],
  quranicTimeline: {
    secondSemester: Array.from({ length: 18 }, (_, i) => ({
      week: i + 1,
      status: i < 3 ? 'completed' : i === 3 ? 'in-progress' : 'upcoming',
      isCurrent: i === 3,
      dateRange: { en: `Jan ${15+i*7}-${21+i*7}`, ar: `${15+i*7}-${21+i*7} يناير` },
      content: { en: `Surah Al-Baqarah: Verses ${i*10 + 1}-${(i+1)*10}`, ar: `سورة البقرة: آيات ${i*10 + 1}-${(i+1)*10}` },
      notes: { en: '', ar: '' },
    })),
    firstSemester: Array.from({ length: 18 }, (_, i) => ({
      week: i + 1,
      status: 'upcoming',
      isCurrent: false,
      dateRange: { en: `Sep ${1+i*7}-${7+i*7}`, ar: `${1+i*7}-${7+i*7} سبتمبر` },
      content: { en: `Surah Al-Imran: Verses ${i*10 + 1}-${(i+1)*10}`, ar: `سورة آل عمران: آيات ${i*10 + 1}-${(i+1)*10}` },
      notes: { en: '', ar: '' },
    })),
    summerBreak: Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      status: 'upcoming',
      isCurrent: false,
      dateRange: { en: `Jul ${1+i*7}-${7+i*7}`, ar: `${1+i*7}-${7+i*7} يوليو` },
      content: { en: `Surah An-Nisa: Verses ${i*10 + 1}-${(i+1)*10}`, ar: `سورة النساء: آيات ${i*10 + 1}-${(i+1)*10}` },
      notes: { en: '', ar: '' },
    })),
  },
  studentProjects: [
    {
      id: 'proj-1',
      title: { en: 'Ramadan Iftar Initiative', ar: 'مبادرة إفطار صائم' },
      student: { id: 'stud-1', name: 'أحمد محمد العلي', photo: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=200&auto=format&fit=crop' },
      category: 'community-service',
      status: 'active',
      startDate: '2025-03-01T00:00:00Z',
      endDate: '2025-03-29T00:00:00Z',
      mentor: 'د. عماد الحمداني',
      description: { en: 'Distributing Iftar meals to needy families during Ramadan.', ar: 'توزيع وجبات إفطار على الأسر المحتاجة خلال شهر رمضان.' },
      progress: 75,
      impact: { beneficiaries: 150, budget: 2000, volunteers: 10 },
    },
    {
      id: 'proj-2',
      title: { en: 'Recycling Project', ar: 'مشروع تدوير النفايات' },
      student: { id: 'stud-2', name: 'فاطمة حسن', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      category: 'environmental',
      status: 'completed',
      startDate: '2024-09-15T00:00:00Z',
      endDate: '2024-12-15T00:00:00Z',
      mentor: 'أ. محمد الكبيسي',
      description: { en: 'A campaign to raise awareness and set up recycling bins across campus.', ar: 'حملة لزيادة الوعي ووضع صناديق إعادة تدوير في جميع أنحاء الحرم الجامعي.' },
      progress: 100,
      impact: { recycledKg: 200, volunteers: 5 },
    },
    {
      id: 'proj-3',
      title: { en: 'Kids Coding Workshop', ar: 'ورشة تعليم البرمجة للأطفال' },
      student: { id: 'stud-3', name: 'عمر خالد', photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop' },
      category: 'educational',
      status: 'active',
      startDate: '2025-02-10T00:00:00Z',
      endDate: '2025-05-10T00:00:00Z',
      mentor: 'محمد العاني',
      description: { en: 'A weekly workshop to teach basic programming concepts to children aged 8-12.', ar: 'ورشة عمل أسبوعية لتعليم مفاهيم البرمجة الأساسية للأطفال الذين تتراوح أعمارهم بين 8-12.' },
      progress: 40,
      impact: { childrenTrained: 30, budget: 500, volunteers: 3 },
    },
    {
      id: 'proj-4',
      title: { en: 'Digital Education Research', ar: 'بحث عن التعليم الرقمي' },
      student: { id: 'stud-4', name: 'سارة أحمد', photo: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop' },
      category: 'research',
      status: 'planned',
      startDate: '2025-06-01T00:00:00Z',
      endDate: '2025-09-01T00:00:00Z',
      mentor: 'أ. عبد الرحمن الأحمد',
      description: { en: 'Researching the impact of digital tools on student engagement.', ar: 'بحث حول تأثير الأدوات الرقمية على مشاركة الطلاب.' },
      progress: 0,
      impact: {},
    },
    {
      id: 'proj-5',
      title: { en: 'Health Awareness Campaign', ar: 'حملة توعية صحية' },
      student: { id: 'stud-5', name: 'يوسف علي', photo: 'https://images.unsplash.com/photo-1548372291-9d4e58836526?q=80&w=200&auto=format&fit=crop' },
      category: 'community-service',
      status: 'completed',
      startDate: '2024-10-01T00:00:00Z',
      endDate: '2024-11-30T00:00:00Z',
      mentor: 'د. مصعب',
      description: { en: 'A campaign promoting healthy eating and exercise habits.', ar: 'حملة لتشجيع عادات الأكل الصحي وممارسة الرياضة.' },
      progress: 100,
      impact: { beneficiaries: 500, volunteers: 12 },
    },
  ]
};

// Process the raw data to replace facilitator strings with objects
const teamMemberMap = createTeamMemberMap(rawData as LeadershipData);

const processedUnits = rawData.units.map(unit => ({
  ...unit,
  stages: unit.stages.map(stage => ({
    ...stage,
    events: stage.events.map((event: any) => ({
      ...event,
      category: unit.id, // Assign category based on unit ID
      facilitator: teamMemberMap.get(event.facilitator) || { id: 'unknown', name: event.facilitator, type: 'staff', photo: '' },
    })),
  })),
}));

export const initialLeadershipData: LeadershipData = {
  ...rawData,
  units: processedUnits,
};