

import type { IncubationData, CurriculumModule, StartupProgress } from '../types';

export const MOCK_MENTORSHIP_SESSIONS = [
    { id: 'sess-1', startupId: 'su-1', mentorId: 'mentor-1', date: '2025-02-01T10:00:00Z', topic: 'Initial Marketing Strategy', notes: 'Discussed target audience and initial social media plan. Founder is energetic and has good ideas, but lacks a structured approach to execution.', rating: 5 },
    { id: 'sess-2', startupId: 'su-2', mentorId: 'mentor-2', date: '2025-02-05T14:00:00Z', topic: 'Financial Projections', notes: 'Reviewed the initial financial model. Needs more detail on customer acquisition cost (CAC) and lifetime value (LTV).', rating: 4 },
    { id: 'sess-3', startupId: 'su-1', mentorId: 'mentor-1', date: '2025-02-15T10:00:00Z', topic: 'Content Marketing Plan', notes: 'Planned first three blog posts. Founder needs to focus on execution and consistency.', rating: 4 },
    { id: 'sess-4', startupId: 'su-3', mentorId: 'mentor-2', date: '2025-02-20T11:00:00Z', topic: 'Scaling Operations', notes: 'Founder is struggling with logistics planning. Recommended a follow-up session with a supply chain expert.', rating: 3 },
    { id: 'sess-5', startupId: 'su-4', mentorId: 'mentor-2', date: '2025-02-22T15:00:00Z', topic: 'Budgeting for MVP', notes: 'The financial plan for the MVP is unrealistic. We worked on cutting costs and focusing on core features only. The founder needs to re-evaluate their runway.', rating: 3 },
    { id: 'sess-6', startupId: 'su-5', mentorId: 'mentor-1', date: '2025-02-25T09:00:00Z', topic: 'User Acquisition Channels', notes: 'Brainstormed several user acquisition channels. The founder will focus on community-building on Instagram and partnerships with local artisan groups first.', rating: 5 },
    { id: 'sess-7', startupId: 'su-2', mentorId: 'mentor-2', date: '2025-03-01T14:00:00Z', topic: 'Refining Financial Model', notes: 'Second session on financials. CAC and LTV are now included, but projections are too optimistic. Advised to create three scenarios: pessimistic, realistic, and optimistic.', rating: 4 },
    { id: 'sess-8', startupId: 'su-3', mentorId: 'mentor-1', date: '2025-03-05T16:00:00Z', topic: 'Pitch Deck Review', notes: 'The pitch deck is missing a clear problem statement and a compelling story. We worked on the narrative. The design also needs significant improvement.', rating: 2 },
];

const MOCK_CURRICULUM: CurriculumModule[] = [
  {
    week: 1,
    title: {
        en: 'Module 1: Business Model Canvas',
        ar: 'الوحدة 1: نموذج العمل التجاري'
    },
    description: {
        en: 'Understand and map out your business model using the Business Model Canvas framework.',
        ar: 'فهم وتخطيط نموذج عملك باستخدام إطار نموذج العمل التجاري.'
    },
    milestones: [
      { 
        id: 'm1-1', 
        title: {
            en: 'Complete first draft of Business Model Canvas',
            ar: 'إكمال المسودة الأولى لنموذج العمل التجاري'
        },
        description: {
            en: 'Fill all 9 blocks of the canvas.',
            ar: 'املأ جميع الكتل التسعة في النموذج.'
        }
      },
      { 
        id: 'm1-2', 
        title: {
            en: 'Identify Key Customer Segments',
            ar: 'تحديد شرائح العملاء الرئيسية'
        },
        description: {
            en: 'Define at least two distinct customer segments.',
            ar: 'حدد شريحتين مميزتين على الأقل من العملاء.'
        }
      },
    ],
  },
  {
    week: 2,
    title: {
        en: 'Module 2: Market Validation',
        ar: 'الوحدة 2: التحقق من السوق'
    },
    description: {
        en: 'Validate your assumptions about the market and customer needs.',
        ar: 'تحقق من افتراضاتك حول السوق واحتياجات العملاء.'
    },
    milestones: [
      { 
        id: 'm2-1', 
        title: {
            en: 'Conduct 10 customer interviews',
            ar: 'إجراء 10 مقابلات مع العملاء'
        },
        description: {
            en: 'Gather feedback from potential customers.',
            ar: 'اجمع التعليقات من العملاء المحتملين.'
        }
      },
      { 
        id: 'm2-2', 
        title: {
            en: 'Analyze interview feedback and summarize findings',
            ar: 'تحليل ملاحظات المقابلة وتلخيص النتائج'
        },
        description: {
            en: 'Create a report on key insights.',
            ar: 'أنشئ تقريرًا عن الرؤى الرئيسية.'
        }
      },
    ],
  },
  {
    week: 3,
    title: {
        en: 'Module 3: Financial Planning',
        ar: 'الوحدة 3: التخطيط المالي'
    },
    description: {
        en: 'Develop initial financial projections for your startup.',
        ar: 'طور التوقعات المالية الأولية لشركتك الناشئة.'
    },
    milestones: [
      { 
        id: 'm3-1', 
        title: {
            en: 'Create a 12-month financial projection sheet',
            ar: 'إنشاء ورقة توقعات مالية لمدة 12 شهرًا'
        },
        description: {
            en: 'Include revenue, costs, and profit projections.',
            ar: 'قم بتضمين توقعات الإيرادات والتكاليف والأرباح.'
        }
      },
    ],
  },
  { 
    week: 4, 
    title: {
        en: 'Module 4: MVP Definition',
        ar: 'الوحدة 4: تعريف المنتج الأولي القابل للتطبيق'
    }, 
    description: {
        en: 'Define the core features of your Minimum Viable Product.',
        ar: 'حدد الميزات الأساسية لمنتجك الأولي القابل للتطبيق.'
    }, 
    milestones: [
        { 
            id: 'm4-1', 
            title: {
                en: 'List and prioritize MVP features',
                ar: 'سرد وتحديد أولويات ميزات المنتج الأولي'
            }, 
            description: {
                en: 'Use a framework like MoSCoW.',
                ar: 'استخدم إطار عمل مثل MoSCoW.'
            } 
        }
    ] 
  },
];

const MOCK_STARTUP_PROGRESS: StartupProgress[] = [
    {
        startupId: 'su-past-1', // HealthForward
        milestoneProgress: [
            { milestoneId: 'm1-1', status: 'completed', completionDate: '2024-01-20T00:00:00Z', dueDate: '2024-01-22T00:00:00Z' },
            { milestoneId: 'm1-2', status: 'completed', completionDate: '2024-01-21T00:00:00Z', dueDate: '2024-01-22T00:00:00Z' },
            { milestoneId: 'm2-1', status: 'completed', completionDate: '2024-02-05T00:00:00Z', dueDate: '2024-02-05T00:00:00Z' },
            { milestoneId: 'm2-2', status: 'completed', completionDate: '2024-02-10T00:00:00Z', dueDate: '2024-02-12T00:00:00Z' },
            { milestoneId: 'm3-1', status: 'completed', completionDate: '2024-02-20T00:00:00Z', dueDate: '2024-02-20T00:00:00Z' },
            { milestoneId: 'm4-1', status: 'pending', dueDate: new Date().toISOString() }, // Keep one pending to show it is not 100%
        ]
    },
    {
        startupId: 'su-1',
        milestoneProgress: [
            { milestoneId: 'm1-1', status: 'completed', completionDate: '2025-01-20T00:00:00Z', dueDate: '2025-01-22T00:00:00Z' },
            { milestoneId: 'm1-2', status: 'completed', completionDate: '2025-01-21T00:00:00Z', dueDate: '2025-01-22T00:00:00Z' },
            { milestoneId: 'm2-1', status: 'delayed', dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
            { milestoneId: 'm2-2', status: 'pending', dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
            { milestoneId: 'm3-1', status: 'pending', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
            { milestoneId: 'm4-1', status: 'pending', dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        startupId: 'su-2',
        milestoneProgress: [
            { milestoneId: 'm1-1', status: 'completed', completionDate: '2025-01-22T00:00:00Z', dueDate: '2025-01-22T00:00:00Z' },
            { milestoneId: 'm1-2', status: 'pending', dueDate: '2025-01-22T00:00:00Z' },
            { milestoneId: 'm2-1', status: 'pending', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
        ]
    }
];

export const MOCK_INCUBATION_DATA: IncubationData = {
    mentors: [
        { id: 'mentor-1', name: 'Layla', specialty: 'Marketing', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
        { id: 'mentor-2', name: 'Omar', specialty: 'Finance', photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop' },
    ],
    investors: [
        { id: 'inv-1', name: 'Al-Khair Fund', type: 'VC Firm', logoUrl: 'https://picsum.photos/seed/alkhair/100/100', investmentFocus: ['EdTech', 'FinTech', 'AgriTech'], lastInteraction: '2025-03-01T00:00:00Z' },
        { id: 'inv-2', name: 'Future Angels', type: 'Angel Network', logoUrl: 'https://picsum.photos/seed/futureangels/100/100', investmentFocus: ['E-commerce', 'Social Impact'], lastInteraction: '2025-02-20T00:00:00Z' },
    ],
    startups: [
        // Past cohort for impact reports
        { id: 'su-past-1', name: 'HealthForward', sector: 'HealthTech', description: 'AI for early disease detection.', logo: '🩺', stage: 'growth', founder: { name: 'Amina Khalil', email: 'amina@health.com' }, cohortId: 'C-2024-A', mentorIds: ['mentor-2'], investorIds: ['inv-1', 'G-00245'], funding: 100000, status: 'graduated', jobsCreated: 8, postProgramFunding: 500000, financials: { plannedBudget: 40000, actualSpent: 38500 } },
        { id: 'su-past-2', name: 'EcoPack', sector: 'Sustainability', description: 'Sustainable packaging solutions.', logo: '📦', stage: 'growth', founder: { name: 'Omar Said', email: 'omar@ecopack.com' }, cohortId: 'C-2024-A', mentorIds: ['mentor-1'], investorIds: [], funding: 30000, status: 'graduated', jobsCreated: 5, postProgramFunding: 120000, financials: { plannedBudget: 20000, actualSpent: 21000 } },
        { id: 'su-past-3', name: 'LearnSphere', sector: 'EdTech', description: 'VR for education.', logo: 'VR', stage: 'idea', founder: { name: 'Layla Ahmed', email: 'layla@learn.com' }, cohortId: 'C-2024-A', mentorIds: [], investorIds: [], funding: 10000, status: 'failed', jobsCreated: 1, postProgramFunding: 0, financials: { plannedBudget: 15000, actualSpent: 12000 } },
        
        // Current cohort startups
        { id: 'su-1', name: 'EduGrowth', sector: 'EdTech', description: 'AI-powered platform for personalized learning paths.', logo: '💡', stage: 'mvp', founder: { name: 'Ali', email: 'ali@edugrowth.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-1'], investorIds: ['inv-1'], funding: 50000, status: 'active', jobsCreated: 2, financials: { plannedBudget: 50000, actualSpent: 25000 } },
        { id: 'su-2', name: 'FinHealth', sector: 'FinTech', description: 'Mobile app for financial literacy and health for low-income families.', logo: '💰', stage: 'idea', founder: { name: 'Fatma', email: 'fatma@finhealth.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-2'], investorIds: [], funding: 0, status: 'active', jobsCreated: 1, financials: { plannedBudget: 30000, actualSpent: 5000 } },
        { id: 'su-3', name: 'AgriConnect', sector: 'AgriTech', description: 'Connecting small-scale farmers to urban markets.', logo: '🌱', stage: 'growth', founder: { name: 'Youssef', email: 'youssef@agriconnect.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-1', 'mentor-2'], investorIds: ['inv-1', 'inv-2', 'G-00123'], funding: 150000, status: 'active', jobsCreated: 4, financials: { plannedBudget: 100000, actualSpent: 95000 } },
        { id: 'su-4', name: 'CleanWater Tech', sector: 'Sustainability', description: 'Low-cost water purification solutions for rural areas.', logo: '💧', stage: 'mvp', founder: { name: 'Hassan', email: 'hassan@cleanwater.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-2'], investorIds: [], funding: 25000, status: 'active', financials: { plannedBudget: 25000, actualSpent: 18000 } },
        { id: 'su-5', name: 'Artisan Hub', sector: 'E-commerce', description: 'Online marketplace for traditional crafts.', logo: '🎨', stage: 'idea', founder: { name: 'Noura', email: 'noura@artisan.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-1'], investorIds: ['inv-2'], funding: 10000, status: 'active', financials: { plannedBudget: 15000, actualSpent: 16000 } },
        { id: 'su-6', name: 'RecycleRight', sector: 'Sustainability', description: 'Gamified app to encourage household recycling.', logo: '♻️', stage: 'growth', founder: { name: 'Khalid', email: 'khalid@recycle.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-1'], investorIds: [], funding: 75000, status: 'active', financials: { plannedBudget: 60000, actualSpent: 30000 } },
        { id: 'su-7', name: 'HealthBot', sector: 'HealthTech', description: 'A chatbot for preliminary medical diagnosis and advice.', logo: '🤖', stage: 'mvp', founder: { name: 'Amina', email: 'amina@healthbot.com' }, cohortId: 'C-2025-A', mentorIds: ['mentor-2'], investorIds: ['inv-1'], funding: 60000, status: 'active', financials: { plannedBudget: 60000, actualSpent: 45000 } },
        { id: 'su-8', name: 'SolarKit', sector: 'CleanTech', description: 'Affordable solar energy kits for off-grid homes.', logo: '☀️', stage: 'idea', founder: { name: 'Bilal', email: 'bilal@solarkit.com' }, cohortId: 'C-2025-A', mentorIds: [], investorIds: [], funding: 0, status: 'active', financials: { plannedBudget: 40000, actualSpent: 2000 } },
    ],
    cohorts: [
        { id: 'C-2024-A', name: 'Cohort 2024-A', startDate: '2024-01-15T00:00:00Z', endDate: '2024-07-15T00:00:00Z', status: 'completed' },
        { id: 'C-2025-A', name: 'Cohort 2025-A', startDate: '2025-01-15T00:00:00Z', endDate: '2025-07-15T00:00:00Z', status: 'in-progress' },
        { id: 'C-2025-B', name: 'Cohort 2025-B', startDate: '2025-08-01T00:00:00Z', endDate: '2026-02-01T00:00:00Z', status: 'recruiting' },
    ],
    applications: [
    {
      id: 'APP-001',
      date: '2025-06-15T10:00:00Z',
      founderName: 'Ahmad Hassan',
      founderEmail: 'ahmad.h@example.com',
      projectName: 'GreenTech Solutions',
      projectDescription: 'Developing sustainable packaging from agricultural waste to reduce plastic pollution and create a circular economy.',
      sector: 'Environmental',
      fundingNeed: 75000,
      status: 'Under Review',
      autoScore: 82,
      reviews: [
        { reviewerName: 'Omar (Finance)', comment: 'Strong financial projections, but needs a more detailed go-to-market strategy.', score: 4, date: '2025-06-18T14:00:00Z' }
      ]
    },
    {
      id: 'APP-002',
      date: '2025-06-12T09:00:00Z',
      founderName: 'Sara Ibrahim',
      founderEmail: 'sara.i@example.com',
      projectName: 'CodeKids Academy',
      projectDescription: 'An online platform to teach coding to children aged 8-12 in underserved communities, providing them with essential 21st-century skills.',
      sector: 'Educational',
      fundingNeed: 40000,
      status: 'Pending',
      autoScore: 78,
      reviews: []
    },
    {
      id: 'APP-003',
      date: '2025-06-10T11:00:00Z',
      founderName: 'Yara Khaled',
      founderEmail: 'yara.k@example.com',
      projectName: 'ConnectCare',
      projectDescription: 'A mobile app connecting elderly individuals with vetted local caregivers for non-medical assistance, companionship, and daily tasks.',
      sector: 'HealthTech',
      fundingNeed: 60000,
      status: 'Accepted',
      autoScore: 91,
      reviews: [
        { reviewerName: 'Omar (Finance)', comment: 'Solid business model with clear revenue streams and social impact.', score: 5, date: '2025-06-11T10:00:00Z' },
        { reviewerName: 'Layla (Marketing)', comment: 'Excellent market analysis. The target audience is well-defined and the need is clear.', score: 5, date: '2025-06-11T11:00:00Z' }
      ]
    },
    {
      id: 'APP-004',
      date: '2025-06-08T17:00:00Z',
      founderName: 'Majid Khan',
      founderEmail: 'majid.k@example.com',
      projectName: 'Craftsly',
      projectDescription: 'An e-commerce platform that connects local artisans directly with global customers, focusing on fair trade principles.',
      sector: 'E-commerce',
      fundingNeed: 30000,
      status: 'Rejected',
      autoScore: 65,
      reviews: [
        { reviewerName: 'Layla (Marketing)', comment: 'The market is highly saturated and the unique selling proposition is not clear enough.', score: 2, date: '2025-06-09T16:00:00Z' }
      ]
    }
  ],
  mentorshipSessions: MOCK_MENTORSHIP_SESSIONS,
  curriculum: MOCK_CURRICULUM,
  startupProgress: MOCK_STARTUP_PROGRESS,
};
