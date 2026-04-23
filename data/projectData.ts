import type { Project, DocumentItem } from '../types';

const mockDocuments: DocumentItem[] = [
    {
        id: 'folder-1', type: 'folder', name: 'Planning', accessLevel: 'team', lastModified: '2024-03-05T00:00:00Z',
        children: [
            {
                id: 'file-1', type: 'file', name: 'Project Plan v2.1.pdf', fileType: 'pdf', size: 1200, uploadedBy: 'Fatma Kaya',
                uploadedDate: '2024-03-05T00:00:00Z', lastModified: '2024-04-10T00:00:00Z', tags: ['core', 'planning'],
                description: 'The main project planning document.', accessLevel: 'team', viewCount: 25,
                versions: [
                    { version: 'v2.1', date: '2024-04-10T00:00:00Z', author: 'Fatma Kaya', notes: 'Updated budget section.', size: 1200 },
                    { version: 'v2.0', date: '2024-03-15T00:00:00Z', author: 'Fatma Kaya', notes: 'Revised timeline.', size: 1150 },
                    { version: 'v1.0', date: '2024-03-05T00:00:00Z', author: 'Fatma Kaya', notes: 'Initial draft.', size: 980 },
                ]
            },
            { id: 'file-2', type: 'file', name: 'Feasibility Study.xlsx', fileType: 'xlsx', size: 850, uploadedBy: 'John Doe', uploadedDate: '2024-03-02T00:00:00Z', lastModified: '2024-03-02T00:00:00Z', tags: ['research'], description: '', accessLevel: 'team', viewCount: 12, versions: [{ version: 'v1.0', date: '2024-03-02T00:00:00Z', author: 'John Doe', notes: 'Initial study.', size: 850 }] },
            { id: 'file-3', type: 'file', name: 'Risk Plan.docx', fileType: 'docx', size: 45, uploadedBy: 'Fatma Kaya', uploadedDate: '2024-03-10T00:00:00Z', lastModified: '2024-03-10T00:00:00Z', tags: [], description: 'Risk register and mitigation plan.', accessLevel: 'team', viewCount: 18, versions: [{ version: 'v1.0', date: '2024-03-10T00:00:00Z', author: 'Fatma Kaya', notes: 'Created.', size: 45 }] },
        ]
    },
    { id: 'folder-2', type: 'folder', name: 'Contracts', accessLevel: 'private', lastModified: '2024-03-20T00:00:00Z', children: [] },
    { id: 'folder-3', type: 'folder', name: 'Reports', accessLevel: 'organization', lastModified: '2024-07-01T00:00:00Z', children: [] },
    { id: 'folder-4', type: 'folder', name: 'Photos', accessLevel: 'public', lastModified: '2024-06-15T00:00:00Z', children: [] },
    { id: 'folder-5', type: 'folder', name: 'Invoices', accessLevel: 'private', lastModified: '2024-07-15T00:00:00Z', children: [] },
];


export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PROJ-2024-004',
    name: {
      en: 'Islamic Center - Albania',
      ar: 'بناء مركز إسلامي - ألبانيا',
      tr: 'Arnavutluk İslam Merkezi İnşaatı'
    },
    type: 'development',
    stage: 'planning',
    sdgGoals: [4, 11], // Quality Education, Sustainable Cities and Communities
    plannedStartDate: '2025-01-01T00:00:00Z',
    plannedEndDate: '2025-09-30T00:00:00Z',
    location: {
      country: 'Albania',
      city: 'Tirana', // Assumed city
      region: ''
    },
    stakeholders: {
      donor: 'International Islamic Charity Organization',
      implementingPartner: 'Local Albanian Partner',
      targetBeneficiaries: '150 Albanian youth and orphans.',
      primaryContact: 'Project Manager'
    },
    goal: 'To build a single-story Islamic center (120m²) to serve as a hub for educating and caring for Albanian youth and orphans in various aspects of life, fostering their connection to their faith and community.',
    objectives: [
      'Establish a center for the Muslim community, providing a safe space for learning and worship.',
      'Organize religious rituals such as daily prayers, Friday sermons, and holiday events.',
      'Provide educational activities including Quran memorization circles, general lessons, and courses in Sharia sciences.',
      'Offer periodic lessons in Islamic creed and culture to strengthen identity.',
      'Provide Iftar meals during Ramadan and distribute Udhiyah (Qurbani) to the community, especially the elderly and women.'
    ],
    expectedOutcomes: [
      'Increased religious and cultural knowledge among youth and orphans.',
      'Strengthened community bonds.',
      'Provision of essential aid during Islamic holidays.'
    ],
    kpis: [
      { id: 'kpi-alb-1', name: 'Number of regular beneficiaries', unit: 'number', target: '150' },
      { id: 'kpi-alb-2', name: 'Number of educational activities per month', unit: 'number', target: '10' }
    ],
    progress: 5,
    budget: 55250, // 17,000 KWD * 3.25
    spent: 2500,
    documents: [],
    scopeStatement: {
      inScope: ['Construction of a 120m² single-story building', 'Furnishing a large hall, two classrooms, and a teachers\' office', 'Organizing educational and religious activities', 'Distributing food aid during specific holidays'],
      outOfScope: ['Residential facilities', 'Secular vocational training', 'Direct financial stipends to students'],
      assumptions: ['Availability of local construction permits and materials', 'Local community support and participation', 'Ability to recruit qualified teachers and facilitators'],
      constraints: ['Total budget of 17,000 KWD', '9-month project timeline'],
    },
    wbs: {
      id: 'wbs-alb-ic',
      name: 'Albania Islamic Center',
      type: 'deliverable',
      children: [
        { id: 'wbs-aic-1', name: 'Phase 1: Pre-construction', type: 'work-package' },
        { id: 'wbs-aic-2', name: 'Phase 2: Construction & Furnishing', type: 'work-package' },
        { id: 'wbs-aic-3', name: 'Phase 3: Program Launch', type: 'work-package' },
      ],
    },
    schedule: [
      { id: 'task-aic-1', name: 'Permits & Design', start: '2025-01-01', end: '2025-02-28', progress: 20 },
      { id: 'task-aic-2', name: 'Construction', start: '2025-03-01', end: '2025-07-31', progress: 0, dependencies: ['task-aic-1'] },
      { id: 'task-aic-3', name: 'Furnishing & Staffing', start: '2025-08-01', end: '2025-09-15', progress: 0, dependencies: ['task-aic-2'] },
      { id: 'task-aic-4', name: 'Center Inauguration', start: '2025-09-30', end: '2025-09-30', progress: 0, isMilestone: true, dependencies: ['task-aic-3'] },
    ],
    criticalPath: ['task-aic-1', 'task-aic-2', 'task-aic-3', 'task-aic-4'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 40250, actual: 2500 }, // Construction
        { category: 'equipment', planned: 15000, actual: 0 }, // Furnishing
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 5000, ev: 2762, ac: 2500, spi: 0.55, cpi: 1.10, eac: 50227, etc: 47727 }
    },
    humanResources: {
      projectTeam: [],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-alb-1', description: 'Potential for construction delays due to supply chain issues in the region.', category: 'operational', probability: 'medium', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Identify alternative local suppliers in advance.', owner: 'PM', status: 'open' }
        ]
    },
    qualityManagement: { standards: [], lessonsLearned: [] },
    monitoring: {
        evmHistory: [
            { month: 'Jan', pv: 2762, ev: 2762, ac: 2500 },
        ],
    },
    changeLog: []
  },
    {
    id: 'PROJ-2024-002',
    name: {
      en: 'Vocational Training Institute - Istanbul',
      ar: 'معهد التدريب المهني - اسطنبول',
      tr: 'Mesleki Eğitim Enstitüsü - İstanbul'
    },
    type: 'development',
    stage: 'planning',
    sdgGoals: [4, 8, 10], // Quality Education, Decent Work, Reduced Inequalities
    plannedStartDate: '2025-01-01T00:00:00Z',
    plannedEndDate: '2025-04-30T00:00:00Z',
    location: {
      country: 'Turkey',
      city: 'Istanbul',
      region: 'Esenyurt'
    },
    stakeholders: {
      donor: 'Sheikh Abdullah Al Nouri Charity & other partners',
      implementingPartner: 'Core Istanbul for Entrepreneurship',
      targetBeneficiaries: 'Over 1000 Arab, Turkish, and refugee youth (18-35), university graduates, and aspiring entrepreneurs in the first year.',
      primaryContact: 'Core Istanbul PM'
    },
    goal: 'To rehabilitate and renovate a new headquarters for the Vocational Training Institute to be an integrated space that combines technical training, entrepreneurship, co-working, and content production.',
    objectives: [
      'Increase training capacity to over 1000 youths in the first year.',
      'Expand project incubation and support for startups, connecting them with investors.',
      'Enhance training quality through modern facilities like an media studio and flexible spaces.',
      'Empower marginalized youth, refugees, and job seekers with economic opportunities.',
      'Achieve sustainability through income-generating facilities (offices, halls, studio, cafe).'
    ],
    expectedOutcomes: [
      'Increased employability and economic empowerment for marginalized youth.',
      'Growth of a vibrant startup ecosystem.',
      'A self-sustaining model for vocational training and incubation.'
    ],
    kpis: [
        { id: 'kpi-ist-1', name: 'Number of youths trained annually', unit: 'number', target: '1000' },
        { id: 'kpi-ist-2', name: 'Number of startups incubated', unit: 'number', target: '20' },
        { id: 'kpi-ist-3', name: 'Percentage of operational costs covered by generated income', unit: 'percentage', target: '30' }
    ],
    progress: 10,
    budget: 850000,
    spent: 194000, // Amount covered by Al Nouri Charity
    documents: [],
    scopeStatement: {
      inScope: ['Renovation of the new building', 'Furnishing training halls, co-working spaces, and a media studio', 'Developing and running vocational, technical, and entrepreneurship programs', 'Establishing income-generating facilities'],
      outOfScope: ['Construction of a new building from scratch', 'Direct cash grants to startups', 'Accredited university degrees'],
      assumptions: ['Partnerships with universities and municipalities will be successful', 'Income-generating facilities will attract renters', 'Sufficient enrollment from the target demographic'],
      constraints: ['4-month project execution timeline', 'Total budget of $850,000 with a funding gap of $496,000'],
    },
    wbs: {
      id: 'wbs-ist-vtc',
      name: 'Istanbul VTC',
      type: 'deliverable',
      children: [
        { id: 'wbs-ivtc-1', name: 'Phase 1: Renovation & Setup', type: 'work-package' },
        { id: 'wbs-ivtc-2', name: 'Phase 2: Program Development', type: 'work-package' },
        { id: 'wbs-ivtc-3', name: 'Phase 3: Launch & Operations', type: 'work-package' },
      ],
    },
    schedule: [
      { id: 'task-ivtc-1', name: 'Building Renovation', start: '2025-01-01', end: '2025-02-28', progress: 15 },
      { id: 'task-ivtc-2', name: 'Furnishing and Equipping', start: '2025-02-15', end: '2025-03-31', progress: 5, dependencies: ['task-ivtc-1'] },
      { id: 'task-ivtc-3', name: 'Staffing and Curriculum Finalization', start: '2025-03-01', end: '2025-04-15', progress: 10, dependencies: ['task-ivtc-1'] },
      { id: 'task-ivtc-4', name: 'Official Launch', start: '2025-04-30', end: '2025-04-30', progress: 0, isMilestone: true, dependencies: ['task-ivtc-2', 'task-ivtc-3'] },
    ],
    criticalPath: ['task-ivtc-1', 'task-ivtc-2', 'task-ivtc-4'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 400000, actual: 100000 }, // Renovation
        { category: 'equipment', planned: 300000, actual: 94000 }, // Equipment & Furnishing
        { category: 'salaries', planned: 150000, actual: 0 }, // Operational costs
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 250000, ev: 85000, ac: 194000, spi: 0.34, cpi: 0.44, eac: 1931818, etc: 1737818 }
    },
    humanResources: {
      projectTeam: [],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-ist-1', description: 'Funding gap of $496,000 is not filled, impacting project scope.', category: 'financial', probability: 'high', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Intensive fundraising campaign, phased implementation based on available funds.', owner: 'PM', status: 'open' }
        ]
    },
    qualityManagement: { standards: [], lessonsLearned: [] },
    monitoring: {
        evmHistory: [
             { month: 'Jan', pv: 125000, ev: 42500, ac: 97000 },
        ],
    },
    changeLog: []
  },
  {
    id: 'PROJ-2020-003',
    name: {
      en: 'Technical and Vocational Training Center',
      ar: 'مركز التدريب الفني والتأهيل المهني',
      tr: 'Teknik ve Mesleki Eğitim Merkezi'
    },
    type: 'education',
    stage: 'implementation',
    sdgGoals: [4, 8], // Quality Education, Decent Work and Economic Growth
    plannedStartDate: '2020-01-01T00:00:00Z',
    plannedEndDate: '2020-12-31T00:00:00Z',
    location: {
      country: 'Yemen',
      city: 'Ataq',
      region: 'Shabwah'
    },
    stakeholders: {
      donor: 'International Islamic Charitable Organization & Al-Twasul for Human Development',
      implementingPartner: 'Maharati Aden Institute',
      targetBeneficiaries: '600 youth trainees annually in Shabwah, Yemen.',
      primaryContact: 'Project Manager'
    },
    goal: 'To reduce unemployment among youth by providing quality vocational and technical training that meets local market needs and contributes to community development.',
    objectives: [
        'Reduce unemployment rates among youth (male and female).',
        'Supply the labor market with skilled technicians and professionals.',
        'Provide vocational training programs that empower individuals to participate in community development.',
        'Address the skills gap in the Yemeni community.'
    ],
    expectedOutcomes: [
        '600 skilled graduates annually ready for the job market.',
        'Increased income-generating opportunities for beneficiaries.',
        'Preservation and development of local crafts and technical skills.'
    ],
    kpis: [
        { id: 'kpi-yemen-1', name: 'Number of trainees graduated annually', unit: 'number', target: '600' },
        { id: 'kpi-yemen-2', name: 'Post-graduation employment rate within 6 months', unit: 'percentage', target: '75' }
    ],
    progress: 45,
    budget: 178750, // 55,000 KWD * 3.25
    spent: 80000,
    documents: [],
    scopeStatement: {
      inScope: ['Construction of a two-story training center (2360m²)', 'Furnishing workshops and labs for Carpentry, IT, Electronics, Solar Energy, and Mobile Maintenance', 'Implementing training programs for 600 students/year'],
      outOfScope: ['Job placement services', 'Student stipends', 'Advanced degree programs'],
      assumptions: ['Stable security situation allows for construction and operation', 'Availability of qualified trainers', 'Continuous demand from students for vocational training'],
      constraints: ['Fixed budget of 55,000 KWD', 'Timeline dependent on local construction conditions'],
    },
    wbs: {
      id: 'wbs-yemen-vtc',
      name: 'Yemen VTC',
      type: 'deliverable',
      children: [
        { id: 'wbs-yvtc-1', name: 'Phase 1: Construction', type: 'work-package' },
        { id: 'wbs-yvtc-2', name: 'Phase 2: Equipping', type: 'work-package' },
        { id: 'wbs-yvtc-3', name: 'Phase 3: Program Launch', type: 'work-package' },
      ],
    },
    schedule: [
      { id: 'task-yvtc-1', name: 'Construction Phase', start: '2020-01-01', end: '2020-08-31', progress: 60 },
      { id: 'task-yvtc-2', name: 'Equipment Procurement', start: '2020-07-01', end: '2020-10-31', progress: 20, dependencies: ['task-yvtc-1'] },
      { id: 'task-yvtc-3', name: 'Staffing and Curriculum', start: '2020-09-01', end: '2020-11-30', progress: 10, dependencies: ['task-yvtc-1'] },
      { id: 'task-yvtc-4', name: 'Launch', start: '2020-12-01', end: '2020-12-31', progress: 0, dependencies: ['task-yvtc-2', 'task-yvtc-3'] },
    ],
    criticalPath: ['task-yvtc-1', 'task-yvtc-2', 'task-yvtc-4'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 135850, actual: 70000 }, // Construction
        { category: 'equipment', planned: 42900, actual: 10000 }, // Furnishing & Equipment
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 90000, ev: 80437, ac: 80000, spi: 0.89, cpi: 1.01, eac: 177777, etc: 97777 }
    },
    humanResources: {
      projectTeam: [],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-yemen-1', description: 'Security instability affecting project timeline', category: 'security', probability: 'high', impact: 'high', responseStrategy: 'accept', contingencyPlan: 'Buffer in schedule, coordinate with local authorities.', owner: 'PM', status: 'open' }
        ]
    },
    qualityManagement: { standards: [], lessonsLearned: [] },
    monitoring: {
        evmHistory: [
            { month: 'Mar', pv: 44687, ev: 40000, ac: 42000 },
            { month: 'Jun', pv: 89375, ev: 80437, ac: 80000 },
        ],
    },
    changeLog: []
  },
  {
    id: 'PROJ-2020-001',
    name: {
      en: 'Clinic Construction in Niger',
      ar: 'بناء مستوصف في النيجر',
      tr: 'Nijer\'de Klinik İnşaatı'
    },
    type: 'health',
    stage: 'closure', // Assuming a 2020 project is complete
    sdgGoals: [3, 8], // Good Health and Well-being, Decent Work and Economic Growth
    plannedStartDate: '2020-01-01T00:00:00Z',
    plannedEndDate: '2020-08-31T00:00:00Z',
    location: {
      country: 'Niger',
      city: 'Niger', // No specific city mentioned
      region: ''
    },
    stakeholders: {
      donor: 'Rahma International Society',
      implementingPartner: 'Local Partner in Niger',
      targetBeneficiaries: '2000 individuals in poor villages in Niger.',
      primaryContact: 'Rahma International Society'
    },
    goal: 'Contribute to providing distinguished health care services to the people of Niger, spread health awareness, and combat prevalent diseases.',
    objectives: [
        'Construct a 150m² clinic with 2 clinics, administration, pharmacy, lab, and nursing rooms.',
        'Contribute to combating malaria and typhoid.',
        'Provide medical services to poor villages.',
        'Create job opportunities for youth.'
    ],
    expectedOutcomes: [
        'Improved access to healthcare for 2000 individuals.',
        'Reduction in common diseases in the target area.',
        'Increased health awareness in the community.'
    ],
    kpis: [
        { id: 'kpi-niger-1', name: 'Number of beneficiaries served annually', unit: 'number', target: '2000' },
        { id: 'kpi-niger-2', name: 'Clinic construction status', unit: 'text', target: 'Completed' }
    ],
    progress: 100,
    budget: 35750, // Approx 11,000 KWD
    spent: 35750, // Assuming completed
    documents: [],
    scopeStatement: {
      inScope: ['Construction of a 150m² clinic', 'Furnishing the clinic', 'Hiring local staff'],
      outOfScope: ['Mobile clinic services (beyond initial convoys)', 'Advanced surgical procedures'],
      assumptions: ['Availability of construction materials locally', 'Government permits are obtainable'],
      constraints: ['Fixed budget of 11,000 K.D.', '8-month timeline'],
    },
    wbs: {
      id: 'wbs-niger-clinic',
      name: 'Niger Clinic Construction',
      type: 'deliverable',
      children: [
        { id: 'wbs-nc-1', name: 'Phase 1: Foundations', type: 'work-package', children: [
            { id: 'wbs-nc-1-1', name: 'Excavation and Foundation Pouring', type: 'task' }
        ]},
        { id: 'wbs-nc-2', name: 'Phase 2: Structure', type: 'work-package', children: [
            { id: 'wbs-nc-2-1', name: 'Pouring columns and raising walls', type: 'task' },
            { id: 'wbs-nc-2-2', name: 'Roofing works', type: 'task' }
        ]},
        { id: 'wbs-nc-3', name: 'Phase 3: Finishing', type: 'work-package', children: [
            { id: 'wbs-nc-3-1', name: 'Electrical and plumbing', type: 'task' },
            { id: 'wbs-nc-3-2', name: 'Doors, windows, and painting', type: 'task' },
            { id: 'wbs-nc-3-3', name: 'Ceramic flooring', type: 'task' }
        ]},
        { id: 'wbs-nc-4', name: 'Phase 4: Furnishing & Opening', type: 'work-package', children: [
            { id: 'wbs-nc-4-1', name: 'Furnishing and equipment setup', type: 'task' },
            { id: 'wbs-nc-4-2', name: 'Grand Opening', type: 'task' }
        ]},
      ],
    },
    schedule: [
      { id: 'task-nc-1', name: 'Foundation Works', start: '2020-01-01', end: '2020-02-15', progress: 100 },
      { id: 'task-nc-2', name: 'Structural Works', start: '2020-02-16', end: '2020-04-30', progress: 100, dependencies: ['task-nc-1'] },
      { id: 'task-nc-3', name: 'Finishing Works', start: '2020-05-01', end: '2020-07-31', progress: 100, dependencies: ['task-nc-2'] },
      { id: 'task-nc-4', name: 'Furnishing & Opening', start: '2020-08-01', end: '2020-08-31', progress: 100, dependencies: ['task-nc-3'] },
    ],
    criticalPath: ['task-nc-1', 'task-nc-2', 'task-nc-3', 'task-nc-4'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 25750, actual: 25750 }, // Construction
        { category: 'equipment', planned: 10000, actual: 10000 }, // Furnishing
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 35750, ev: 35750, ac: 35750, spi: 1, cpi: 1, eac: 35750, etc: 0 }
    },
    humanResources: {
      projectTeam: [
        { userId: 'user-rh', name: 'Rahma International PM', photo: 'https://picsum.photos/seed/rahma/100/100', projectRole: 'Project Manager', effort: 20, availability: 'Part-time' },
      ],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: []
    },
    qualityManagement: {
        standards: [],
        lessonsLearned: []
    },
    monitoring: {
        evmHistory: [],
    },
    changeLog: []
  },
  {
    id: 'PROJ-2020-002',
    name: {
      en: 'Vocational Training Center',
      ar: 'مركز تدريب مهني',
      tr: 'Mesleki Eğitim Merkezi'
    },
    type: 'education',
    stage: 'planning',
    sdgGoals: [4, 8],
    plannedStartDate: '2020-01-01T00:00:00Z',
    plannedEndDate: '2020-06-30T00:00:00Z',
    location: {
      country: 'Syria',
      city: 'Afrin',
      region: 'Aleppo Countryside'
    },
    stakeholders: {
      donor: 'Şam Hayır ve Yardımlaşma Derneği',
      implementingPartner: 'Local Partner',
      targetBeneficiaries: 'Syrian people, youth, and craftsmen in Northern Syria',
      primaryContact: 'Project Manager'
    },
    goal: 'Establish a specialized vocational training center to provide skilled graduates who can contribute to rebuilding the country and find suitable employment.',
    objectives: [
      "Establish a vocational training center.",
      "Secure 100 temporary job opportunities for the construction of the project.",
      "Secure approximately 4 permanent job opportunities.",
      "Promote a culture of work and mitigate the negative social impacts of reliance on humanitarian aid.",
      "Generate financial returns to help cover operating expenses for the city's basic facilities."
    ],
    expectedOutcomes: [
      'Increased employability for graduates.',
      'Preservation of industrial and commercial crafts.',
      'Sustainable operational income from commercial shops.'
    ],
    kpis: [
      { id: 'kpi-vtc-1', name: 'Number of graduates per year', unit: 'number', target: '200' },
      { id: 'kpi-vtc-2', name: 'Employment rate of graduates within 6 months', unit: 'percentage', target: '70' }
    ],
    progress: 25,
    budget: 176610,
    spent: 45000,
    documents: [],
    scopeStatement: {
      inScope: ["Construction of a 2-floor building (1000m²)", "Establishment of 12 commercial shops on ground floor", "Equipping 7 training rooms for Tailoring, Media, Computers, and Maintenance", "Creating a library, prayer room, and administrative offices"],
      outOfScope: ["Direct financial aid to students", "Job placement services", "Advanced IT certifications"],
      assumptions: ["Availability of skilled trainers", "Sufficient student enrollment", "Commercial shops can be rented out to generate income"],
      constraints: ["6-month timeline", "Total budget of $176,610", "Operating in a conflict/post-conflict zone"],
    },
    wbs: {
      id: 'wbs-vtc', name: 'Vocational Center Construction', type: 'deliverable',
      children: [
        { id: 'wbs-vtc-1', name: 'Phase 1: Site & Foundation', type: 'work-package', children: [
          { id: 'wbs-vtc-1-1', name: 'Land Preparation', type: 'task' },
          { id: 'wbs-vtc-1-2', name: 'Foundation Pouring', type: 'task' }
        ]},
        { id: 'wbs-vtc-2', name: 'Phase 2: Superstructure', type: 'work-package', children: [
          { id: 'wbs-vtc-2-1', name: 'Column Erection & Roof Pouring', type: 'task' },
          { id: 'wbs-vtc-2-2', name: 'Wall Construction', type: 'task' }
        ]},
        { id: 'wbs-vtc-3', name: 'Phase 3: Finishing & Equipping', type: 'work-package', children: [
          { id: 'wbs-vtc-3-1', name: 'Finishing Works (Plumbing, Electrical, Plastering)', type: 'task' },
          { id: 'wbs-vtc-3-2', name: 'Equipment Procurement & Installation', type: 'task' }
        ]}
      ]
    },
    schedule: [
      { id: 'task-vtc-1', name: 'Land Prep & Foundations', start: '2020-01-01', end: '2020-02-29', progress: 100 },
      { id: 'task-vtc-2', name: 'Superstructure Works', start: '2020-03-01', end: '2020-04-30', progress: 25, dependencies: ['task-vtc-1'] },
      { id: 'task-vtc-3', name: 'Finishing & Equipping', start: '2020-05-01', end: '2020-06-30', progress: 0, dependencies: ['task-vtc-2'] }
    ],
    criticalPath: ['task-vtc-1', 'task-vtc-2', 'task-vtc-3'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 60000, actual: 60000 }, // Land
        { category: 'other', planned: 58500, actual: 15000 }, // Construction
        { category: 'equipment', planned: 22000, actual: 0 }, // Training Rooms
        { category: 'equipment', planned: 27700, actual: 0 }, // Furniture
        { category: 'other', planned: 8410, actual: 0 }, // Admin
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 60000, ev: 44152, ac: 45000, spi: 0.74, cpi: 0.98, eac: 180214, etc: 135214 }
    },
    humanResources: {
      projectTeam: [
        { userId: 'user-sh', name: 'Sham Al Khair PM', photo: 'https://picsum.photos/seed/sham/100/100', projectRole: 'Project Manager', effort: 100, availability: 'Full-time' },
      ],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
      riskRegister: [
        { id: 'risk-vtc-1', description: 'Project sustainability after initial phase', category: 'financial', probability: 'medium', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Renting out 12 commercial shops to cover operational expenses.', owner: 'Project Manager', status: 'in-progress' },
        { id: 'risk-vtc-2', description: 'Security issues in the region affecting construction', category: 'security', probability: 'medium', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Selecting a location under Turkish supervision for better security.', owner: 'Project Manager', status: 'open' }
      ]
    },
    qualityManagement: { standards: [], lessonsLearned: [] },
    monitoring: {
      evmHistory: [
        { month: 'Jan', pv: 29435, ev: 28000, ac: 30000 },
        { month: 'Feb', pv: 58870, ev: 44152, ac: 45000 },
      ]
    },
    changeLog: []
  },
  {
    id: 'PROJ-2025-003',
    name: {
      en: "Rise Aleppo: Women's Empowerment through Vocational Training, Entrepreneurship and Traditional Crafts",
      ar: 'انهضي يا حلب: تمكين المرأة عبر التدريب المهني، ريادة الأعمال والحرف التقليدية',
      tr: 'Yüksel Halep: Mesleki Eğitim, Girişimcilik ve Geleneksel El Sanatları ile Kadınların Güçlendirilmesi'
    },
    type: 'development',
    stage: 'planning',
    sdgGoals: [5, 8, 10],
    plannedStartDate: '2025-01-01T00:00:00Z',
    plannedEndDate: '2025-12-31T00:00:00Z',
    location: {
      country: 'Syria',
      city: 'Aleppo',
      region: 'Aleppo Governorate'
    },
    stakeholders: {
      donor: 'Various Donors (TBD)',
      implementingPartner: 'Core Aleppo Business Hub',
      targetBeneficiaries: '130 vulnerable women and youth (18-35) in Aleppo, with a focus on female-headed households, low-income families, and returnees.',
      primaryContact: 'Project Manager'
    },
    goal: 'Empower vulnerable women and youth in Aleppo by enhancing their employability, entrepreneurial capabilities, and traditional craft skills, while providing access to fully-equipped training and co-working spaces, thereby contributing to sustainable livelihoods, cultural heritage preservation, and local economic recovery.',
    objectives: [
        'Provide market-driven vocational training for 70 women to enhance their employability.',
        'Support 30 women in launching or expanding their micro-enterprises through a business incubator program.',
        'Train 30 women in traditional Aleppo crafts to preserve cultural heritage and create market-linked products.',
        'Establish and fully equip a multi-purpose training and co-working space accessible to the community.'
    ],
    expectedOutcomes: [
        'Improved household income for beneficiaries.',
        'Increased rate of female employment and entrepreneurship in target areas.',
        'Creation of sustainable, women-led businesses.',
        'Preservation and monetization of traditional Syrian crafts.'
    ],
    kpis: [
        { id: 'kpi-ra-1', name: 'Number of women completing vocational training', unit: 'number', target: '70' },
        { id: 'kpi-ra-2', name: 'Number of startups launched or expanded', unit: 'number', target: '30' },
        { id: 'kpi-ra-3', name: 'Number of women trained in traditional crafts', unit: 'number', target: '30' },
        { id: 'kpi-ra-4', name: '% of trainees employed or self-employed within 6 months', unit: 'percentage', target: '60' },
        { id: 'kpi-ra-5', name: '% of startups still active after 12 months', unit: 'percentage', target: '70' }
    ],
    progress: 0,
    budget: 150000,
    spent: 0,
    documents: [],
    scopeStatement: {
      inScope: ['Vocational training in 3 fields', 'Business incubation program with mentorship', 'Entrepreneurship bootcamps', 'Renovation and furnishing of physical space', 'Traditional crafts training and product development', 'Market linkage events'],
      outOfScope: ['Direct cash assistance', 'Long-term financing for businesses', 'Job placement services (direct hiring)'],
      assumptions: ['Relative security stability in Aleppo allows for project activities.', 'Qualified and willing participants are available.', 'Local private sector is open to collaboration and partnerships.'],
      constraints: ['Fixed budget of $150,000.', 'Strict 12-month timeframe.', 'Volatile economic conditions and inflation in Syria.'],
    },
    wbs: {
      id: 'wbs-ra',
      name: 'Rise Aleppo Project',
      type: 'deliverable',
      children: [
        { id: 'wbs-ra-1', name: 'Project Management', type: 'work-package', children: [
            { id: 'wbs-ra-1-1', name: 'Planning & Coordination', type: 'task' },
            { id: 'wbs-ra-1-2', name: 'M&E and Reporting', type: 'task' },
        ]},
        { id: 'wbs-ra-2', name: 'Component 1: Skills Development', type: 'work-package', children: [
            { id: 'wbs-ra-2-1', name: 'Market Needs Assessment', type: 'task' },
            { id: 'wbs-ra-2-2', name: 'Curriculum Design & Participant Selection', type: 'task' },
            { id: 'wbs-ra-2-3', name: 'Conduct 3 Training Cycles', type: 'task' },
        ]},
        { id: 'wbs-ra-3', name: 'Component 2: Entrepreneurship', type: 'work-package', children: [
            { id: 'wbs-ra-3-1', name: 'Incubator Program', type: 'task' },
            { id: 'wbs-ra-3-2', name: 'Bootcamps', type: 'task' },
            { id: 'wbs-ra-3-3', name: 'Final Pitching Event', type: 'task' },
        ]},
         { id: 'wbs-ra-4', name: 'Component 3: Infrastructure', type: 'work-package', children: [
            { id: 'wbs-ra-4-1', name: 'Space Renovation', type: 'task' },
            { id: 'wbs-ra-4-2', name: 'Procurement & Installation', type: 'task' },
            { id: 'wbs-ra-4-3', name: 'Launch of Co-working Space', type: 'task' },
        ]},
        { id: 'wbs-ra-5', name: 'Component 4: Traditional Crafts', type: 'work-package', children: [
            { id: 'wbs-ra-5-1', name: 'Crafts Training', type: 'task' },
            { id: 'wbs-ra-5-2', name: 'Product Development & Market Linkage', type: 'task' },
        ]},
      ],
    },
    schedule: [
      { id: 'task-ra-1', name: 'Phase 1: Launch & Setup', start: '2025-01-01', end: '2025-02-28', progress: 0 },
      { id: 'task-ra-2', name: 'Phase 2: Core Implementation', start: '2025-03-01', end: '2025-08-31', progress: 0, dependencies: ['task-ra-1'] },
      { id: 'task-ra-3', name: 'Phase 3: Consolidation & Linkages', start: '2025-09-01', end: '2025-11-30', progress: 0, dependencies: ['task-ra-2'] },
      { id: 'task-ra-4', name: 'Phase 4: Closure & Transition', start: '2025-12-01', end: '2025-12-31', progress: 0, dependencies: ['task-ra-3'] },
      { id: 'task-ra-5', name: 'Co-working Space Launch', start: '2025-08-31', end: '2025-08-31', progress: 0, isMilestone: true, dependencies: ['task-ra-2'] },
      { id: 'task-ra-6', name: 'Final Pitching Event', start: '2025-11-30', end: '2025-11-30', progress: 0, isMilestone: true, dependencies: ['task-ra-3'] },
    ],
    criticalPath: ['task-ra-1', 'task-ra-2', 'task-ra-3', 'task-ra-4'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'other', planned: 37500, actual: 0 }, // Skills Dev
        { category: 'other', planned: 30000, actual: 0 }, // Entrepreneurship
        { category: 'equipment', planned: 60000, actual: 0 }, // Infrastructure
        { category: 'other', planned: 15000, actual: 0 }, // Crafts
        { category: 'salaries', planned: 7500, actual: 0 }, // Project Mgmt
      ],
      expenseLog: [],
      financialSummary: { burnRate: [], pv: 0, ev: 0, ac: 0, spi: 0, cpi: 0, eac: 0, etc: 0 }
    },
    humanResources: {
      projectTeam: [
        { userId: 'user-pm', name: 'Project Manager', photo: 'https://picsum.photos/seed/pm/100/100', projectRole: 'Project Manager', effort: 100, availability: 'Full-time' },
        { userId: 'user-skills', name: 'Skills Dev Coordinator', photo: 'https://picsum.photos/seed/skills/100/100', projectRole: 'Coordinator', effort: 100, availability: 'Full-time' },
        { userId: 'user-ent', name: 'Entrepreneurship Coordinator', photo: 'https://picsum.photos/seed/ent/100/100', projectRole: 'Coordinator', effort: 100, availability: 'Full-time' },
        { userId: 'user-me', name: 'M&E Officer', photo: 'https://picsum.photos/seed/me/100/100', projectRole: 'M&E Officer', effort: 100, availability: 'Full-time' },
      ],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-ra-1', description: "Social/cultural barriers prevent women's participation", category: 'reputational', probability: 'medium', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Community awareness sessions, engage families, highlight success stories.', owner: 'Project Coordinator', status: 'open' },
            { id: 'risk-ra-2', description: 'Delays in procurement and renovation', category: 'operational', probability: 'medium', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Phased procurement plan, identify multiple suppliers, add buffer time.', owner: 'Infra Coordinator', status: 'open' },
            { id: 'risk-ra-3', description: 'Economic instability and inflation', category: 'financial', probability: 'high', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Periodic price reviews, access to regional markets, financial literacy training.', owner: 'Project Manager', status: 'open' },
            { id: 'risk-ra-4', description: 'High participant dropout rate', category: 'operational', probability: 'low', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Clear selection criteria, participation stipends, ongoing support, over-recruitment by 10%.', owner: 'Coordinators', status: 'open' },
            { id: 'risk-ra-5', description: 'Security situation deteriorates', category: 'security', probability: 'low', impact: 'high', responseStrategy: 'accept', contingencyPlan: 'Continuous monitoring, contingency plans for remote activities, staff safety protocols.', owner: 'Project Manager', status: 'open' },
        ]
    },
    qualityManagement: {
        standards: [
            { id: 'qs-ra-1', name: 'Training Quality', description: 'Ensures effectiveness of training programs.', type: 'process', checklist: [{item: 'Attendance rate > 80%', checked: false}, {item: 'Participant satisfaction > 85%', checked: false}, {item: 'Pre/post test score improvement > 40%', checked: false}] },
            { id: 'qs-ra-2', name: 'Startup Viability', description: 'Ensures new businesses are well-planned.', type: 'deliverable', checklist: [{item: 'Completed business plan for each startup', checked: false}] },
        ],
        lessonsLearned: []
    },
    monitoring: {
        evmHistory: [],
    },
    changeLog: []
  },
  {
    id: 'PROJ-2024-001',
    name: {
      en: 'Clean Water Initiative for Rural Villages',
      ar: 'مبادرة المياه النظيفة للقرى الريفية',
      tr: 'Kırsal Köyler İçin Temiz Su Girişimi'
    },
    type: 'development',
    stage: 'implementation',
    sdgGoals: [3, 6, 11],
    plannedStartDate: '2024-03-01T00:00:00Z',
    plannedEndDate: '2025-02-28T00:00:00Z',
    location: {
      country: 'Uganda',
      city: 'Gulu',
      region: 'Northern Region'
    },
    stakeholders: {
      donor: 'Global Philanthropy Foundation',
      implementingPartner: 'Local Water Org',
      targetBeneficiaries: 'Approx. 5,000 villagers across 10 communities',
      primaryContact: 'John Doe'
    },
    goal: 'Improve health and sanitation by providing access to clean and safe drinking water.',
    objectives: [
        'Construct 10 new wells by Q4 2024.',
        'Train 20 community members on well maintenance.'
    ],
    expectedOutcomes: [
        'Reduction in waterborne diseases by 50%.',
        'Time spent collecting water reduced by an average of 2 hours per household daily.'
    ],
    kpis: [
        { id: 'kpi-1', name: 'Number of new wells constructed', unit: 'number', target: '10' },
        { id: 'kpi-2', name: 'Percentage of households with access to clean water', unit: 'percentage', target: '95' }
    ],
    progress: 65,
    budget: 150000,
    spent: 95000,
    documents: mockDocuments,
    scopeStatement: {
      inScope: ['Construction of 10 wells', 'Community training sessions', 'Water quality testing'],
      outOfScope: ['Household plumbing', 'Irrigation systems'],
      assumptions: ['Community participation is high', 'Materials are available locally'],
      constraints: ['Annual rainy season may delay construction', 'Budget is fixed'],
    },
    wbs: {
      id: 'wbs-1',
      name: 'Clean Water Initiative',
      type: 'deliverable',
      children: [
        { 
          id: 'wbs-1-1', 
          name: 'Well Construction', 
          type: 'work-package',
          children: [
            { id: 'wbs-1-1-1', name: 'Site Survey', type: 'task' },
            { id: 'wbs-1-1-2', name: 'Drilling', type: 'task' },
          ]
        },
        { id: 'wbs-1-2', name: 'Community Training', type: 'work-package' },
      ],
    },
    schedule: [
      { id: 'task-1', name: 'Project Kick-off', start: '2024-03-01', end: '2024-03-05', progress: 100, isMilestone: true },
      { id: 'task-2', name: 'Site Surveys', start: '2024-03-06', end: '2024-04-15', progress: 100, dependencies: ['task-1'] },
      { id: 'task-3', name: 'Drilling Phase 1 (5 wells)', start: '2024-04-16', end: '2024-08-30', progress: 80, dependencies: ['task-2'] },
      { id: 'task-4', name: 'Training Program Development', start: '2024-05-01', end: '2024-06-30', progress: 100, dependencies: ['task-1'] },
      { id: 'task-5', name: 'Community Training Session 1', start: '2024-09-01', end: '2024-09-15', progress: 0, dependencies: ['task-3', 'task-4'] },
    ],
    criticalPath: ['task-1', 'task-2', 'task-3', 'task-5'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'salaries', planned: 40000, actual: 35000 },
        { category: 'equipment', planned: 70000, actual: 55000 },
        { category: 'travel', planned: 10000, actual: 5000 },
        { category: 'other', planned: 30000, actual: 10000 },
      ],
      expenseLog: [
        { id: 'exp-1', date: '2024-07-15', category: 'equipment', description: 'Drilling rig rental', amount: 15000, wbsId: 'wbs-1-1-2' },
        { id: 'exp-2', date: '2024-07-20', category: 'travel', description: 'Field staff transportation', amount: 500, wbsId: 'wbs-1-1-1' },
      ],
      financialSummary: {
        burnRate: [{month: 'Mar', value: 10000}, {month: 'Apr', value: 20000}, {month: 'May', value: 25000}, {month: 'Jun', value: 20000}, {month: 'Jul', value: 20000}],
        pv: 100000, // Planned Value
        ev: 97500,  // Earned Value (65% of 150k)
        ac: 95000,  // Actual Cost
        spi: 0.975, // EV/PV
        cpi: 1.026, // EV/AC
        eac: 146153, // BAC/CPI
        etc: 51153, // EAC - AC
      }
    },
    humanResources: {
      projectTeam: [
        { userId: 'user-2', name: 'Fatma Kaya', photo: 'https://picsum.photos/id/402/100/100', projectRole: 'Project Manager', effort: 100, availability: 'Full-time' },
        { userId: 'user-3', name: 'John Doe', photo: 'https://picsum.photos/id/403/100/100', projectRole: 'Field Engineer', effort: 100, availability: 'Full-time' },
        { userId: 'user-4', name: 'Jane Smith', photo: 'https://picsum.photos/id/404/100/100', projectRole: 'Community Officer', effort: 50, availability: 'Part-time' },
      ],
      raciMatrix: {
        'wbs-1-1-1': { 'user-2': 'A', 'user-3': 'R', 'user-4': 'C' },
        'wbs-1-1-2': { 'user-2': 'A', 'user-3': 'R' },
        'wbs-1-2': { 'user-2': 'A', 'user-4': 'R', 'user-3': 'C' },
      },
      timesheet: [
        { id: 'ts-1', userId: 'user-3', wbsId: 'wbs-1-1-1', date: '2024-07-19', hours: 8 },
        { id: 'ts-2', userId: 'user-4', wbsId: 'wbs-1-2', date: '2024-07-19', hours: 4 },
      ]
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-1', description: 'Unexpected rise in cost of drilling equipment', category: 'financial', probability: 'medium', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Allocate contingency budget; pre-negotiate prices.', owner: 'user-2', status: 'open' },
            { id: 'risk-2', description: 'Political instability delays project activities', category: 'political', probability: 'low', impact: 'high', responseStrategy: 'accept', contingencyPlan: 'Monitor situation; have evacuation plan for staff.', owner: 'user-2', status: 'open' },
            { id: 'risk-3', description: 'Heavy rainy season floods construction sites', category: 'operational', probability: 'high', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Schedule drilling outside of peak rainy months.', owner: 'user-3', status: 'in-progress' },
            { id: 'risk-4', description: 'Local community members not willing to participate in training', category: 'reputational', probability: 'medium', impact: 'medium', responseStrategy: 'mitigate', contingencyPlan: 'Engage community leaders early; offer incentives.', owner: 'user-4', status: 'open' },
        ]
    },
    qualityManagement: {
        standards: [
            { id: 'qs-1', name: 'Well Water Quality', description: 'Ensures water from new wells is safe for consumption.', type: 'deliverable', checklist: [{item: 'WHO standards for drinking water met', checked: true}, {item: 'Water tested for E.coli', checked: true}, {item: 'Local community accepts taste', checked: false}] },
            { id: 'qs-2', name: 'Community Training Protocol', description: 'Ensures training sessions are effective and consistent.', type: 'process', checklist: [{item: 'Training manual used', checked: true}, {item: 'Attendance rate > 80%', checked: true}, {item: 'Post-training assessment conducted', checked: true}] },
        ],
        lessonsLearned: [
            { id: 'll-1', category: 'positive', description: 'Engaging female community leaders early greatly increased participation.', recommendation: 'Make this a mandatory step in all future community projects.' },
            { id: 'll-2', category: 'negative', description: 'The initial supplier for drilling pipes was unreliable, causing a 2-week delay.', recommendation: 'Vet at least two suppliers for critical materials in the planning phase.' },
        ]
    },
    monitoring: {
        evmHistory: [
            { month: 'Mar', pv: 12500, ev: 12000, ac: 13000 },
            { month: 'Apr', pv: 37500, ev: 35000, ac: 36000 },
            { month: 'May', pv: 62500, ev: 60000, ac: 58000 },
            { month: 'Jun', pv: 87500, ev: 85000, ac: 82000 },
            { month: 'Jul', pv: 100000, ev: 97500, ac: 95000 },
        ],
    },
    changeLog: [
        { id: 'CR-001', description: 'Increase budget for drilling equipment due to unforeseen price hikes.', requester: 'John Doe', date: '2024-05-10T00:00:00Z', status: 'approved', impact: { cost: '+ $10,000' }, approvalDate: '2024-05-12T00:00:00Z' },
        { id: 'CR-002', description: 'Extend timeline for Phase 1 drilling by 2 weeks due to customs delay on parts.', requester: 'Fatma Kaya', date: '2024-06-20T00:00:00Z', status: 'implemented', impact: { time: '+ 2 weeks' }, approvalDate: '2024-06-21T00:00:00Z' },
        { id: 'CR-003', description: 'Add a new training module on water sanitation.', requester: 'Jane Smith', date: '2024-07-15T00:00:00Z', status: 'pending', impact: { scope: 'Additional training module' } },
    ]
  },
  {
    id: 'PROJ-2024-002',
    name: {
      en: 'Emergency Food Aid for Conflict Zones',
      ar: 'مساعدات غذائية طارئة لمناطق النزاع',
      tr: 'Çatışma Bölgeleri İçin Acil Gıda Yardımı'
    },
    type: 'humanitarian',
    stage: 'monitoring',
    sdgGoals: [1, 2, 16],
    plannedStartDate: '2024-06-15T00:00:00Z',
    plannedEndDate: '2024-09-15T00:00:00Z',
    location: {
      country: 'Syria',
      city: 'Idlib'
    },
    stakeholders: {
      donor: 'European Development Agency',
      implementingPartner: 'Local Aid Partner',
      targetBeneficiaries: '10,000 Internally Displaced Persons (IDPs)',
      primaryContact: 'Ali Veli'
    },
    goal: 'Provide life-saving food assistance to conflict-affected populations.',
    objectives: [
        'Distribute 10,000 food baskets within 3 months.',
        'Ensure nutritional needs of 2,000 children under 5 are met.'
    ],
    expectedOutcomes: [
        'Reduction in acute malnutrition rates.',
        'Improved food security for target households.'
    ],
    kpis: [
        { id: 'kpi-3', name: 'Number of food baskets distributed', unit: 'number', target: '10000' },
        { id: 'kpi-4', name: 'Percentage of beneficiaries reporting improved food access', unit: 'percentage', target: '85' }
    ],
    progress: 35,
    budget: 500000,
    spent: 175000,
    documents: [],
    scopeStatement: {
      inScope: ['Procurement of food items', 'Distribution logistics', 'Beneficiary registration'],
      outOfScope: ['Cash assistance', 'Non-food items'],
      assumptions: ['Safe access to distribution points is maintained'],
      constraints: ['Security situation is volatile', 'Supply chain disruptions'],
    },
    wbs: {
      id: 'wbs-2',
      name: 'Emergency Food Aid',
      type: 'deliverable',
      children: [
        { id: 'wbs-2-1', name: 'Logistics', type: 'work-package', children: [] },
        { id: 'wbs-2-2', name: 'Distribution', type: 'work-package', children: [] },
      ],
    },
    schedule: [
      { id: 'task-p2-1', name: 'Procurement', start: '2024-06-15', end: '2024-07-15', progress: 90 },
      { id: 'task-p2-2', name: 'Distribution Cycle 1', start: '2024-07-16', end: '2024-08-15', progress: 20, dependencies: ['task-p2-1'] },
    ],
    criticalPath: ['task-p2-1', 'task-p2-2'],
    costManagement: {
      currency: 'USD',
      budgetDetails: [
        { category: 'salaries', planned: 50000, actual: 25000 },
        { category: 'equipment', planned: 400000, actual: 140000 }, // for food
        { category: 'travel', planned: 20000, actual: 10000 },
        { category: 'other', planned: 30000, actual: 0 },
      ],
      expenseLog: [],
      financialSummary: {
        burnRate: [{month: 'Jun', value: 50000}, {month: 'Jul', value: 125000}],
        pv: 200000,
        ev: 175000,
        ac: 175000,
        spi: 0.875,
        cpi: 1.0,
        eac: 571428,
        etc: 396428,
      }
    },
    humanResources: {
      projectTeam: [
        { userId: 'user-2', name: 'Fatma Kaya', photo: 'https://picsum.photos/id/402/100/100', projectRole: 'Project Manager', effort: 50, availability: 'Part-time' },
      ],
      raciMatrix: {},
      timesheet: []
    },
    riskManagement: {
        riskRegister: [
            { id: 'risk-5', description: 'Distribution routes become inaccessible due to conflict', category: 'security', probability: 'high', impact: 'high', responseStrategy: 'mitigate', contingencyPlan: 'Establish alternative routes; coordinate with local authorities.', owner: 'user-2', status: 'open' }
        ]
    },
    qualityManagement: {
        standards: [],
        lessonsLearned: []
    },
    monitoring: {
        evmHistory: [],
    },
    changeLog: []
  },
];
