import type {
  FinancialTransaction,
  DonationRecord,
  FinancialPledge,
  ProjectBudget,
  Disbursement,
  Fund,
  Grant,
  ApprovalItem,
  FinancialReport,
  FinancialAlert,
  MonthlyFinancialData,
} from '../types/financials';

// ─── Monthly Financial Data (12 months) ──────────────────────────────────────

export const MOCK_MONTHLY_DATA: MonthlyFinancialData[] = [
  { month: '2024-01', revenue: 82000, expenses: 61000, netIncome: 21000 },
  { month: '2024-02', revenue: 95000, expenses: 58000, netIncome: 37000 },
  { month: '2024-03', revenue: 78000, expenses: 72000, netIncome: 6000 },
  { month: '2024-04', revenue: 110000, expenses: 65000, netIncome: 45000 },
  { month: '2024-05', revenue: 125000, expenses: 80000, netIncome: 45000 },
  { month: '2024-06', revenue: 98000, expenses: 91000, netIncome: 7000 },
  { month: '2024-07', revenue: 140000, expenses: 75000, netIncome: 65000 },
  { month: '2024-08', revenue: 88000, expenses: 69000, netIncome: 19000 },
  { month: '2024-09', revenue: 105000, expenses: 84000, netIncome: 21000 },
  { month: '2024-10', revenue: 130000, expenses: 78000, netIncome: 52000 },
  { month: '2024-11', revenue: 115000, expenses: 92000, netIncome: 23000 },
  { month: '2024-12', revenue: 160000, expenses: 85000, netIncome: 75000 },
];

// ─── Transactions ────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TXN-001', date: '2024-12-15', description: { en: 'Monthly donation from Aisha Al-Farsi', ar: 'تبرع شهري من عائشة الفارسي' },
    amount: 1500, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0042', relatedEntityId: 'DN-001', relatedEntityType: 'donor', relatedEntityName: 'Aisha Al-Farsi',
    accountCode: '4100', fundId: 'fund-education', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-15', postedBy: 'System', postedDate: '2024-12-15',
  },
  {
    id: 'TXN-002', date: '2024-12-14', description: { en: 'Construction materials for Albania IC', ar: 'مواد بناء لمركز ألبانيا الإسلامي' },
    amount: 12500, currency: 'USD', direction: 'outflow', category: 'project_expense', status: 'posted',
    reference: 'EXP-2024-0118', relatedEntityId: 'PROJ-2024-004', relatedEntityType: 'project', relatedEntityName: 'Albania Islamic Center',
    accountCode: '6200', fundId: 'fund-albania', approvedBy: 'Fatma Kaya', approvedDate: '2024-12-14', postedBy: 'Ahmed Hassan', postedDate: '2024-12-14', attachments: 2,
  },
  {
    id: 'TXN-003', date: '2024-12-13', description: { en: 'Major gift from David Chen', ar: 'هبة كبيرة من ديفيد تشن' },
    amount: 50000, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0041', relatedEntityId: 'DN-004', relatedEntityType: 'donor', relatedEntityName: 'David Chen',
    accountCode: '4100', fundId: 'fund-endowment', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-13', postedBy: 'System', postedDate: '2024-12-13',
  },
  {
    id: 'TXN-004', date: '2024-12-12', description: { en: 'Qatar Charity grant installment Q4', ar: 'قسط منحة قطر الخيرية الربع الرابع' },
    amount: 28000, currency: 'USD', direction: 'inflow', category: 'grant_income', status: 'posted',
    reference: 'GRT-2024-0012', relatedEntityId: 'QA-001', relatedEntityType: 'institutional_donor', relatedEntityName: 'Qatar Charity',
    accountCode: '4200', fundId: 'fund-albania', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-12', postedBy: 'System', postedDate: '2024-12-12',
  },
  {
    id: 'TXN-005', date: '2024-12-11', description: { en: 'Monthly stipend for Yusuf Al-Ahmad', ar: 'راتب شهري ليوسف الأحمد' },
    amount: 250, currency: 'USD', direction: 'outflow', category: 'disbursement', status: 'posted',
    reference: 'DIS-2024-0067', relatedEntityId: 'ben-001', relatedEntityType: 'beneficiary', relatedEntityName: 'Yusuf Al-Ahmad',
    accountCode: '6400', fundId: 'fund-education', approvedBy: 'Fatma Kaya', approvedDate: '2024-12-10', postedBy: 'Ahmed Hassan', postedDate: '2024-12-11',
  },
  {
    id: 'TXN-006', date: '2024-12-10', description: { en: 'Office rent payment - December', ar: 'دفع إيجار المكتب - ديسمبر' },
    amount: 3200, currency: 'USD', direction: 'outflow', category: 'operational_expense', status: 'posted',
    reference: 'EXP-2024-0117', accountCode: '6100', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-09', postedBy: 'System', postedDate: '2024-12-10',
  },
  {
    id: 'TXN-007', date: '2024-12-09', description: { en: 'Online donation via Stripe', ar: 'تبرع إلكتروني عبر سترايب' },
    amount: 500, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0040', relatedEntityId: 'DN-005', relatedEntityType: 'donor', relatedEntityName: 'Hassan Ibrahim',
    accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-12-09',
  },
  {
    id: 'TXN-008', date: '2024-12-08', description: { en: 'GPF education program grant', ar: 'منحة برنامج التعليم من GPF' },
    amount: 62500, currency: 'USD', direction: 'inflow', category: 'grant_income', status: 'reconciled',
    reference: 'GRT-2024-0011', relatedEntityId: 'G-00123', relatedEntityType: 'institutional_donor', relatedEntityName: 'Global Philanthropy Foundation',
    accountCode: '4200', fundId: 'fund-education', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-08', postedBy: 'System', postedDate: '2024-12-08',
  },
  {
    id: 'TXN-009', date: '2024-12-07', description: { en: 'Emergency relief supplies', ar: 'مستلزمات إغاثة طارئة' },
    amount: 8750, currency: 'USD', direction: 'outflow', category: 'disbursement', status: 'approved',
    reference: 'DIS-2024-0066', accountCode: '6400', fundId: 'fund-emergency', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-07',
  },
  {
    id: 'TXN-010', date: '2024-12-06', description: { en: 'Donation from Fatma Yilmaz', ar: 'تبرع من فاطمة يلماز' },
    amount: 2000, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0039', relatedEntityId: 'DN-003', relatedEntityType: 'donor', relatedEntityName: 'Fatma Yilmaz',
    accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-12-06',
  },
  {
    id: 'TXN-011', date: '2024-12-05', description: { en: 'Software subscriptions', ar: 'اشتراكات البرمجيات' },
    amount: 1850, currency: 'USD', direction: 'outflow', category: 'operational_expense', status: 'posted',
    reference: 'EXP-2024-0116', accountCode: '6300', approvedBy: 'Fatma Kaya', approvedDate: '2024-12-04', postedBy: 'System', postedDate: '2024-12-05',
  },
  {
    id: 'TXN-012', date: '2024-12-04', description: { en: 'Sponsorship payment received', ar: 'دفعة كفالة مستلمة' },
    amount: 3600, currency: 'USD', direction: 'inflow', category: 'sponsorship_income', status: 'posted',
    reference: 'SPO-2024-0023', relatedEntityId: 'DN-002', relatedEntityType: 'donor', relatedEntityName: 'Omar Al-Rashid',
    accountCode: '4300', fundId: 'fund-education', postedBy: 'System', postedDate: '2024-12-04',
  },
  {
    id: 'TXN-013', date: '2024-12-03', description: { en: 'Staff training workshop expenses', ar: 'مصاريف ورشة تدريب الموظفين' },
    amount: 4200, currency: 'USD', direction: 'outflow', category: 'operational_expense', status: 'posted',
    reference: 'EXP-2024-0115', accountCode: '6100', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-02', postedBy: 'System', postedDate: '2024-12-03',
  },
  {
    id: 'TXN-014', date: '2024-12-02', description: { en: 'Anonymous cash donation', ar: 'تبرع نقدي مجهول' },
    amount: 750, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0038', accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-12-02',
  },
  {
    id: 'TXN-015', date: '2024-12-01', description: { en: 'Equipment purchase for VTC Istanbul', ar: 'شراء معدات لمركز إسطنبول المهني' },
    amount: 15800, currency: 'USD', direction: 'outflow', category: 'procurement', status: 'posted',
    reference: 'PO-2024-0034', relatedEntityId: 'PROJ-2024-002', relatedEntityType: 'project', relatedEntityName: 'Istanbul VTC',
    accountCode: '6200', approvedBy: 'Ahmed Hassan', approvedDate: '2024-11-30', postedBy: 'System', postedDate: '2024-12-01', attachments: 3,
  },
  {
    id: 'TXN-016', date: '2024-11-28', description: { en: 'Innovate Corp STEM grant installment', ar: 'قسط منحة إنوفيت كورب للعلوم' },
    amount: 25000, currency: 'USD', direction: 'inflow', category: 'grant_income', status: 'posted',
    reference: 'GRT-2024-0010', relatedEntityId: 'G-00245', relatedEntityType: 'institutional_donor', relatedEntityName: 'Innovate Corp',
    accountCode: '4200', fundId: 'fund-education', postedBy: 'System', postedDate: '2024-11-28',
  },
  {
    id: 'TXN-017', date: '2024-11-25', description: { en: 'Scholarship disbursement batch', ar: 'دفعة منح دراسية' },
    amount: 6000, currency: 'USD', direction: 'outflow', category: 'disbursement', status: 'posted',
    reference: 'DIS-2024-0065', accountCode: '6400', fundId: 'fund-education', approvedBy: 'Fatma Kaya', approvedDate: '2024-11-24', postedBy: 'Ahmed Hassan', postedDate: '2024-11-25',
  },
  {
    id: 'TXN-018', date: '2024-11-20', description: { en: 'Annual donation from Sarah Johnson', ar: 'تبرع سنوي من سارة جونسون' },
    amount: 10000, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0037', relatedEntityId: 'DN-006', relatedEntityType: 'donor', relatedEntityName: 'Sarah Johnson',
    accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-11-20',
  },
  {
    id: 'TXN-019', date: '2024-11-18', description: { en: 'Travel expenses - field visit', ar: 'مصاريف سفر - زيارة ميدانية' },
    amount: 2300, currency: 'USD', direction: 'outflow', category: 'project_expense', status: 'posted',
    reference: 'EXP-2024-0114', relatedEntityId: 'PROJ-2024-004', relatedEntityType: 'project', relatedEntityName: 'Albania Islamic Center',
    accountCode: '6200', fundId: 'fund-albania', approvedBy: 'Fatma Kaya', approvedDate: '2024-11-17', postedBy: 'System', postedDate: '2024-11-18', attachments: 1,
  },
  {
    id: 'TXN-020', date: '2024-11-15', description: { en: 'Recurring donation from Mohammed Al-Sayed', ar: 'تبرع متكرر من محمد السيد' },
    amount: 200, currency: 'USD', direction: 'inflow', category: 'donation', status: 'posted',
    reference: 'DON-2024-0036', relatedEntityId: 'DN-007', relatedEntityType: 'donor', relatedEntityName: 'Mohammed Al-Sayed',
    accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-11-15',
  },
  {
    id: 'TXN-021', date: '2024-12-16', description: { en: 'Pending vendor invoice - catering', ar: 'فاتورة مورد معلقة - تموين' },
    amount: 1200, currency: 'USD', direction: 'outflow', category: 'procurement', status: 'pending',
    reference: 'PO-2024-0035', accountCode: '6200',
  },
  {
    id: 'TXN-022', date: '2024-12-16', description: { en: 'Draft expense claim - conference', ar: 'مسودة مطالبة مصروفات - مؤتمر' },
    amount: 3500, currency: 'USD', direction: 'outflow', category: 'operational_expense', status: 'draft',
    reference: 'EXP-2024-0119', accountCode: '6100', notes: 'Annual NGO conference registration and travel',
  },
  {
    id: 'TXN-023', date: '2024-12-15', description: { en: 'Refund to donor - duplicate payment', ar: 'استرداد لمتبرع - دفعة مكررة' },
    amount: 500, currency: 'USD', direction: 'outflow', category: 'refund', status: 'approved',
    reference: 'REF-2024-0003', relatedEntityId: 'DN-005', relatedEntityType: 'donor', relatedEntityName: 'Hassan Ibrahim',
    accountCode: '4100', approvedBy: 'Ahmed Hassan', approvedDate: '2024-12-15',
  },
  {
    id: 'TXN-024', date: '2024-12-14', description: { en: 'Voided check - wrong amount', ar: 'شيك ملغي - مبلغ خاطئ' },
    amount: 5000, currency: 'USD', direction: 'outflow', category: 'project_expense', status: 'voided',
    reference: 'EXP-2024-0113', relatedEntityId: 'PROJ-2024-004', relatedEntityType: 'project', relatedEntityName: 'Albania Islamic Center',
    accountCode: '6200', notes: 'Voided due to incorrect amount. Replacement issued as EXP-2024-0118.',
  },
  {
    id: 'TXN-025', date: '2024-11-10', description: { en: 'Investment income - endowment fund', ar: 'دخل استثماري - صندوق الوقف' },
    amount: 4200, currency: 'USD', direction: 'inflow', category: 'investment_income', status: 'reconciled',
    reference: 'INV-2024-0008', accountCode: '4400', fundId: 'fund-endowment', postedBy: 'System', postedDate: '2024-11-10',
  },
  {
    id: 'TXN-026', date: '2024-11-05', description: { en: 'Payroll - November', ar: 'رواتب - نوفمبر' },
    amount: 28500, currency: 'USD', direction: 'outflow', category: 'payroll', status: 'reconciled',
    reference: 'PAY-2024-0011', accountCode: '6500', approvedBy: 'Ahmed Hassan', approvedDate: '2024-11-04', postedBy: 'System', postedDate: '2024-11-05',
  },
  {
    id: 'TXN-027', date: '2024-10-25', description: { en: 'Donation from Aisha Al-Farsi', ar: 'تبرع من عائشة الفارسي' },
    amount: 1500, currency: 'USD', direction: 'inflow', category: 'donation', status: 'reconciled',
    reference: 'DON-2024-0035', relatedEntityId: 'DN-001', relatedEntityType: 'donor', relatedEntityName: 'Aisha Al-Farsi',
    accountCode: '4100', fundId: 'fund-education', postedBy: 'System', postedDate: '2024-10-25',
  },
  {
    id: 'TXN-028', date: '2024-10-15', description: { en: 'Beneficiary aid - emergency housing', ar: 'مساعدة مستفيد - إسكان طارئ' },
    amount: 1800, currency: 'USD', direction: 'outflow', category: 'disbursement', status: 'reconciled',
    reference: 'DIS-2024-0060', relatedEntityId: 'ben-001', relatedEntityType: 'beneficiary', relatedEntityName: 'Yusuf Al-Ahmad',
    accountCode: '6400', fundId: 'fund-emergency', approvedBy: 'Ahmed Hassan', approvedDate: '2024-10-14', postedBy: 'System', postedDate: '2024-10-15',
  },
  {
    id: 'TXN-029', date: '2024-10-01', description: { en: 'Donation from Omar Al-Rashid', ar: 'تبرع من عمر الراشد' },
    amount: 5000, currency: 'USD', direction: 'inflow', category: 'donation', status: 'reconciled',
    reference: 'DON-2024-0034', relatedEntityId: 'DN-002', relatedEntityType: 'donor', relatedEntityName: 'Omar Al-Rashid',
    accountCode: '4100', fundId: 'fund-general', postedBy: 'System', postedDate: '2024-10-01',
  },
  {
    id: 'TXN-030', date: '2024-09-20', description: { en: 'Printing and marketing materials', ar: 'مواد طباعة وتسويق' },
    amount: 2100, currency: 'USD', direction: 'outflow', category: 'operational_expense', status: 'reconciled',
    reference: 'EXP-2024-0100', accountCode: '6300', approvedBy: 'Fatma Kaya', approvedDate: '2024-09-19', postedBy: 'System', postedDate: '2024-09-20',
  },
];

// ─── Donation Records ────────────────────────────────────────────────────────

export const MOCK_DONATIONS: DonationRecord[] = [
  {
    id: 'DON-2024-0042', donorId: 'DN-001', donorName: { en: 'Aisha Al-Farsi', ar: 'عائشة الفارسي' }, donorType: 'individual',
    date: '2024-12-15', amount: 1500, currency: 'USD', method: 'bank_transfer', designation: 'Education Fund',
    fundId: 'fund-education', receiptStatus: 'generated', receiptNumber: 'RCT-2024-0042', isRecurring: true, recurringFrequency: 'monthly', transactionId: 'TXN-001',
  },
  {
    id: 'DON-2024-0041', donorId: 'DN-004', donorName: { en: 'David Chen', ar: 'ديفيد تشن' }, donorType: 'individual',
    date: '2024-12-13', amount: 50000, currency: 'USD', method: 'bank_transfer', designation: 'Endowment Fund',
    fundId: 'fund-endowment', receiptStatus: 'sent', receiptNumber: 'RCT-2024-0041', isRecurring: false, transactionId: 'TXN-003',
  },
  {
    id: 'DON-2024-0040', donorId: 'DN-005', donorName: { en: 'Hassan Ibrahim', ar: 'حسن إبراهيم' }, donorType: 'individual',
    date: '2024-12-09', amount: 500, currency: 'USD', method: 'online_gateway', designation: 'General Fund',
    fundId: 'fund-general', receiptStatus: 'pending', isRecurring: false, transactionId: 'TXN-007',
  },
  {
    id: 'DON-2024-0039', donorId: 'DN-003', donorName: { en: 'Fatma Yilmaz', ar: 'فاطمة يلماز' }, donorType: 'individual',
    date: '2024-12-06', amount: 2000, currency: 'USD', method: 'credit_card', fundId: 'fund-general',
    receiptStatus: 'generated', receiptNumber: 'RCT-2024-0039', isRecurring: false, transactionId: 'TXN-010',
  },
  {
    id: 'DON-2024-0038', donorId: '', donorName: { en: 'Anonymous', ar: 'مجهول' }, donorType: 'individual',
    date: '2024-12-02', amount: 750, currency: 'USD', method: 'cash', fundId: 'fund-general',
    receiptStatus: 'pending', isRecurring: false, transactionId: 'TXN-014', notes: 'Cash donation at charity gala',
  },
  {
    id: 'DON-2024-0037', donorId: 'DN-006', donorName: { en: 'Sarah Johnson', ar: 'سارة جونسون' }, donorType: 'individual',
    date: '2024-11-20', amount: 10000, currency: 'USD', method: 'bank_transfer', fundId: 'fund-general',
    receiptStatus: 'sent', receiptNumber: 'RCT-2024-0037', isRecurring: false, transactionId: 'TXN-018',
  },
  {
    id: 'DON-2024-0036', donorId: 'DN-007', donorName: { en: 'Mohammed Al-Sayed', ar: 'محمد السيد' }, donorType: 'individual',
    date: '2024-11-15', amount: 200, currency: 'USD', method: 'online_gateway', fundId: 'fund-general',
    receiptStatus: 'generated', receiptNumber: 'RCT-2024-0036', isRecurring: true, recurringFrequency: 'monthly', transactionId: 'TXN-020',
  },
  {
    id: 'DON-2024-0035', donorId: 'DN-001', donorName: { en: 'Aisha Al-Farsi', ar: 'عائشة الفارسي' }, donorType: 'individual',
    date: '2024-10-25', amount: 1500, currency: 'USD', method: 'bank_transfer', designation: 'Education Fund',
    fundId: 'fund-education', receiptStatus: 'sent', receiptNumber: 'RCT-2024-0035', isRecurring: true, recurringFrequency: 'monthly', transactionId: 'TXN-027',
  },
  {
    id: 'DON-2024-0034', donorId: 'DN-002', donorName: { en: 'Omar Al-Rashid', ar: 'عمر الراشد' }, donorType: 'individual',
    date: '2024-10-01', amount: 5000, currency: 'USD', method: 'bank_transfer', fundId: 'fund-general',
    receiptStatus: 'sent', receiptNumber: 'RCT-2024-0034', isRecurring: false, transactionId: 'TXN-029',
  },
  {
    id: 'DON-2024-0033', donorId: 'DN-001', donorName: { en: 'Aisha Al-Farsi', ar: 'عائشة الفارسي' }, donorType: 'individual',
    date: '2024-09-15', amount: 1500, currency: 'USD', method: 'bank_transfer', designation: 'Education Fund',
    fundId: 'fund-education', receiptStatus: 'sent', receiptNumber: 'RCT-2024-0033', isRecurring: true, recurringFrequency: 'monthly', transactionId: 'TXN-027',
  },
  {
    id: 'DON-2024-0032', donorId: 'DN-004', donorName: { en: 'David Chen', ar: 'ديفيد تشن' }, donorType: 'individual',
    date: '2024-08-10', amount: 25000, currency: 'USD', method: 'bank_transfer', designation: 'Endowment Fund',
    fundId: 'fund-endowment', receiptStatus: 'sent', receiptNumber: 'RCT-2024-0032', isRecurring: false, transactionId: 'TXN-003',
  },
  {
    id: 'DON-2024-0031', donorId: 'DN-002', donorName: { en: 'Omar Al-Rashid', ar: 'عمر الراشد' }, donorType: 'individual',
    date: '2024-07-20', amount: 3000, currency: 'USD', method: 'check', fundId: 'fund-general',
    receiptStatus: 'sent', receiptNumber: 'RCT-2024-0031', isRecurring: false, transactionId: 'TXN-029',
  },
  {
    id: 'DON-2024-0030', donorId: 'DN-005', donorName: { en: 'Hassan Ibrahim', ar: 'حسن إبراهيم' }, donorType: 'individual',
    date: '2024-07-05', amount: 350, currency: 'USD', method: 'online_gateway', fundId: 'fund-general',
    receiptStatus: 'sent', receiptNumber: 'RCT-2024-0030', isRecurring: false, transactionId: 'TXN-007',
  },
  {
    id: 'DON-2024-0029', donorId: 'DN-006', donorName: { en: 'Sarah Johnson', ar: 'سارة جونسون' }, donorType: 'individual',
    date: '2024-06-15', amount: 5000, currency: 'USD', method: 'bank_transfer',
    designation: 'Albania Islamic Center', projectId: 'PROJ-2024-004', projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    fundId: 'fund-albania', receiptStatus: 'sent', receiptNumber: 'RCT-2024-0029', isRecurring: false, transactionId: 'TXN-018',
  },
  {
    id: 'DON-2024-0028', donorId: 'DN-003', donorName: { en: 'Fatma Yilmaz', ar: 'فاطمة يلماز' }, donorType: 'individual',
    date: '2024-05-01', amount: 1000, currency: 'USD', method: 'credit_card', fundId: 'fund-education',
    receiptStatus: 'sent', receiptNumber: 'RCT-2024-0028', isRecurring: false, transactionId: 'TXN-010',
  },
  {
    id: 'DON-2024-0027', donorId: '', donorName: { en: 'Anonymous', ar: 'مجهول' }, donorType: 'individual',
    date: '2024-04-20', amount: 5000, currency: 'USD', method: 'cash', fundId: 'fund-emergency',
    receiptStatus: 'voided', receiptNumber: 'RCT-2024-0027', isRecurring: false, transactionId: 'TXN-014',
    notes: 'Receipt voided - donor requested no receipt',
  },
  {
    id: 'DON-INST-001', donorId: 'QA-001', donorName: { en: 'Qatar Charity', ar: 'قطر الخيرية' }, donorType: 'institutional',
    date: '2024-12-12', amount: 28000, currency: 'USD', method: 'bank_transfer',
    designation: 'Albania Islamic Center', projectId: 'PROJ-2024-004', projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    fundId: 'fund-albania', receiptStatus: 'sent', receiptNumber: 'RCT-INST-2024-001', isRecurring: false, transactionId: 'TXN-004',
  },
  {
    id: 'DON-INST-002', donorId: 'G-00123', donorName: { en: 'Global Philanthropy Foundation', ar: 'مؤسسة الأعمال الخيرية العالمية' }, donorType: 'institutional',
    date: '2024-12-08', amount: 62500, currency: 'USD', method: 'bank_transfer',
    designation: 'Education Programs', fundId: 'fund-education',
    receiptStatus: 'sent', receiptNumber: 'RCT-INST-2024-002', isRecurring: false, transactionId: 'TXN-008',
  },
];

// ─── Pledges ─────────────────────────────────────────────────────────────────

export const MOCK_PLEDGES: FinancialPledge[] = [
  {
    id: 'PLG-001', donorId: 'DN-001', donorName: { en: 'Aisha Al-Farsi', ar: 'عائشة الفارسي' }, donorType: 'individual',
    pledgeDate: '2024-01-15', totalAmount: 24000, paidAmount: 18000, currency: 'USD',
    status: 'active', designation: 'Education Fund', fundId: 'fund-education',
    startDate: '2024-01-15', endDate: '2025-12-15', frequency: 'monthly',
    installments: [
      { id: 'PLG-001-01', dueDate: '2024-01-15', amount: 1500, paidAmount: 1500, paidDate: '2024-01-15', status: 'paid' },
      { id: 'PLG-001-02', dueDate: '2024-02-15', amount: 1500, paidAmount: 1500, paidDate: '2024-02-14', status: 'paid' },
      { id: 'PLG-001-03', dueDate: '2024-03-15', amount: 1500, paidAmount: 1500, paidDate: '2024-03-15', status: 'paid' },
      { id: 'PLG-001-04', dueDate: '2024-04-15', amount: 1500, paidAmount: 1500, paidDate: '2024-04-15', status: 'paid' },
      { id: 'PLG-001-05', dueDate: '2024-05-15', amount: 1500, paidAmount: 1500, paidDate: '2024-05-16', status: 'paid' },
      { id: 'PLG-001-06', dueDate: '2024-06-15', amount: 1500, paidAmount: 1500, paidDate: '2024-06-15', status: 'paid' },
      { id: 'PLG-001-07', dueDate: '2024-07-15', amount: 1500, paidAmount: 1500, paidDate: '2024-07-15', status: 'paid' },
      { id: 'PLG-001-08', dueDate: '2024-08-15', amount: 1500, paidAmount: 1500, paidDate: '2024-08-15', status: 'paid' },
      { id: 'PLG-001-09', dueDate: '2024-09-15', amount: 1500, paidAmount: 1500, paidDate: '2024-09-15', status: 'paid' },
      { id: 'PLG-001-10', dueDate: '2024-10-15', amount: 1500, paidAmount: 1500, paidDate: '2024-10-25', status: 'paid' },
      { id: 'PLG-001-11', dueDate: '2024-11-15', amount: 1500, paidAmount: 1500, paidDate: '2024-11-15', status: 'paid' },
      { id: 'PLG-001-12', dueDate: '2024-12-15', amount: 1500, paidAmount: 1500, paidDate: '2024-12-15', status: 'paid' },
      { id: 'PLG-001-13', dueDate: '2025-01-15', amount: 1500, paidAmount: 0, status: 'pending' },
      { id: 'PLG-001-14', dueDate: '2025-02-15', amount: 1500, paidAmount: 0, status: 'pending' },
      { id: 'PLG-001-15', dueDate: '2025-03-15', amount: 1500, paidAmount: 0, status: 'pending' },
      { id: 'PLG-001-16', dueDate: '2025-04-15', amount: 1500, paidAmount: 0, status: 'pending' },
    ],
  },
  {
    id: 'PLG-002', donorId: 'DN-004', donorName: { en: 'David Chen', ar: 'ديفيد تشن' }, donorType: 'individual',
    pledgeDate: '2024-03-01', totalAmount: 100000, paidAmount: 100000, currency: 'USD',
    status: 'fulfilled', designation: 'Endowment Fund', fundId: 'fund-endowment',
    startDate: '2024-03-01', endDate: '2024-12-31', frequency: 'quarterly',
    installments: [
      { id: 'PLG-002-01', dueDate: '2024-03-01', amount: 25000, paidAmount: 25000, paidDate: '2024-03-01', status: 'paid' },
      { id: 'PLG-002-02', dueDate: '2024-06-01', amount: 25000, paidAmount: 25000, paidDate: '2024-05-28', status: 'paid' },
      { id: 'PLG-002-03', dueDate: '2024-09-01', amount: 25000, paidAmount: 25000, paidDate: '2024-08-30', status: 'paid' },
      { id: 'PLG-002-04', dueDate: '2024-12-01', amount: 25000, paidAmount: 25000, paidDate: '2024-12-13', status: 'paid' },
    ],
  },
  {
    id: 'PLG-003', donorId: 'DN-003', donorName: { en: 'Fatma Yilmaz', ar: 'فاطمة يلماز' }, donorType: 'individual',
    pledgeDate: '2024-06-01', totalAmount: 12000, paidAmount: 3000, currency: 'USD',
    status: 'overdue', designation: 'Education Fund', fundId: 'fund-education',
    startDate: '2024-06-01', endDate: '2025-05-31', frequency: 'quarterly',
    installments: [
      { id: 'PLG-003-01', dueDate: '2024-06-01', amount: 3000, paidAmount: 3000, paidDate: '2024-06-05', status: 'paid' },
      { id: 'PLG-003-02', dueDate: '2024-09-01', amount: 3000, paidAmount: 0, status: 'overdue' },
      { id: 'PLG-003-03', dueDate: '2024-12-01', amount: 3000, paidAmount: 0, status: 'overdue' },
      { id: 'PLG-003-04', dueDate: '2025-03-01', amount: 3000, paidAmount: 0, status: 'pending' },
    ],
  },
  {
    id: 'PLG-004', donorId: 'DN-002', donorName: { en: 'Omar Al-Rashid', ar: 'عمر الراشد' }, donorType: 'individual',
    pledgeDate: '2024-07-01', totalAmount: 36000, paidAmount: 12600, currency: 'USD',
    status: 'partially_fulfilled', designation: 'General Operations', fundId: 'fund-general',
    startDate: '2024-07-01', endDate: '2025-06-30', frequency: 'monthly',
    installments: [
      { id: 'PLG-004-01', dueDate: '2024-07-01', amount: 3000, paidAmount: 3000, paidDate: '2024-07-01', status: 'paid' },
      { id: 'PLG-004-02', dueDate: '2024-08-01', amount: 3000, paidAmount: 3000, paidDate: '2024-08-02', status: 'paid' },
      { id: 'PLG-004-03', dueDate: '2024-09-01', amount: 3000, paidAmount: 3000, paidDate: '2024-09-01', status: 'paid' },
      { id: 'PLG-004-04', dueDate: '2024-10-01', amount: 3000, paidAmount: 3000, paidDate: '2024-10-01', status: 'paid' },
      { id: 'PLG-004-05', dueDate: '2024-11-01', amount: 3000, paidAmount: 600, status: 'partial' },
      { id: 'PLG-004-06', dueDate: '2024-12-01', amount: 3000, paidAmount: 0, status: 'pending' },
      { id: 'PLG-004-07', dueDate: '2025-01-01', amount: 3000, paidAmount: 0, status: 'pending' },
    ],
  },
  {
    id: 'PLG-005', donorId: 'DN-006', donorName: { en: 'Sarah Johnson', ar: 'سارة جونسون' }, donorType: 'individual',
    pledgeDate: '2024-09-01', totalAmount: 20000, paidAmount: 10000, currency: 'USD',
    status: 'active', designation: 'Albania Islamic Center', projectId: 'PROJ-2024-004',
    projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' }, fundId: 'fund-albania',
    startDate: '2024-09-01', endDate: '2025-03-01', frequency: 'quarterly',
    installments: [
      { id: 'PLG-005-01', dueDate: '2024-09-01', amount: 5000, paidAmount: 5000, paidDate: '2024-09-01', status: 'paid' },
      { id: 'PLG-005-02', dueDate: '2024-12-01', amount: 5000, paidAmount: 5000, paidDate: '2024-11-20', status: 'paid' },
      { id: 'PLG-005-03', dueDate: '2025-01-01', amount: 5000, paidAmount: 0, status: 'pending' },
      { id: 'PLG-005-04', dueDate: '2025-03-01', amount: 5000, paidAmount: 0, status: 'pending' },
    ],
  },
  {
    id: 'PLG-006', donorId: 'DN-007', donorName: { en: 'Mohammed Al-Sayed', ar: 'محمد السيد' }, donorType: 'individual',
    pledgeDate: '2024-10-01', totalAmount: 2400, paidAmount: 600, currency: 'USD',
    status: 'active', fundId: 'fund-general',
    startDate: '2024-10-01', endDate: '2025-09-30', frequency: 'monthly',
    installments: [
      { id: 'PLG-006-01', dueDate: '2024-10-01', amount: 200, paidAmount: 200, paidDate: '2024-10-01', status: 'paid' },
      { id: 'PLG-006-02', dueDate: '2024-11-01', amount: 200, paidAmount: 200, paidDate: '2024-11-15', status: 'paid' },
      { id: 'PLG-006-03', dueDate: '2024-12-01', amount: 200, paidAmount: 200, paidDate: '2024-12-05', status: 'paid' },
      { id: 'PLG-006-04', dueDate: '2025-01-01', amount: 200, paidAmount: 0, status: 'pending' },
      { id: 'PLG-006-05', dueDate: '2025-02-01', amount: 200, paidAmount: 0, status: 'pending' },
    ],
  },
];

// ─── Project Budgets ─────────────────────────────────────────────────────────

export const MOCK_BUDGETS: ProjectBudget[] = [
  {
    id: 'BDG-001', projectId: 'PROJ-2024-004',
    projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    fiscalYear: '2024-2025', totalPlanned: 55250, totalActual: 17100, totalCommitted: 8500, currency: 'USD',
    status: 'active', lastUpdated: '2024-12-15',
    lines: [
      { id: 'BL-001', accountCode: '6210', accountName: { en: 'Construction & Materials', ar: 'البناء والمواد' }, category: 'Construction', planned: 30000, actual: 12500, committed: 5000, variance: 12500, variancePercent: 41.7 },
      { id: 'BL-002', accountCode: '6220', accountName: { en: 'Travel & Field Visits', ar: 'السفر والزيارات الميدانية' }, category: 'Travel', planned: 8000, actual: 2300, committed: 1500, variance: 4200, variancePercent: 52.5 },
      { id: 'BL-003', accountCode: '6230', accountName: { en: 'Professional Services', ar: 'الخدمات المهنية' }, category: 'Services', planned: 12000, actual: 2300, committed: 2000, variance: 7700, variancePercent: 64.2 },
      { id: 'BL-004', accountCode: '6240', accountName: { en: 'Equipment & Furnishing', ar: 'المعدات والتأثيث' }, category: 'Equipment', planned: 5250, actual: 0, committed: 0, variance: 5250, variancePercent: 100 },
    ],
  },
  {
    id: 'BDG-002', projectId: 'PROJ-2024-002',
    projectName: { en: 'Istanbul Vocational Training Center', ar: 'مركز إسطنبول للتدريب المهني' },
    fiscalYear: '2024-2025', totalPlanned: 180000, totalActual: 142800, totalCommitted: 15000, currency: 'USD',
    status: 'active', lastUpdated: '2024-12-10',
    lines: [
      { id: 'BL-005', accountCode: '6210', accountName: { en: 'Renovation & Setup', ar: 'التجديد والإعداد' }, category: 'Construction', planned: 80000, actual: 78500, committed: 0, variance: 1500, variancePercent: 1.9 },
      { id: 'BL-006', accountCode: '6240', accountName: { en: 'Equipment & Tools', ar: 'المعدات والأدوات' }, category: 'Equipment', planned: 45000, actual: 31800, committed: 10000, variance: 3200, variancePercent: 7.1 },
      { id: 'BL-007', accountCode: '6250', accountName: { en: 'Personnel & Training', ar: 'الموظفون والتدريب' }, category: 'Personnel', planned: 35000, actual: 28500, committed: 5000, variance: 1500, variancePercent: 4.3 },
      { id: 'BL-008', accountCode: '6260', accountName: { en: 'Operations & Utilities', ar: 'التشغيل والمرافق' }, category: 'Operations', planned: 20000, actual: 4000, committed: 0, variance: 16000, variancePercent: 80 },
    ],
  },
  {
    id: 'BDG-003', projectId: 'PROJ-2024-003',
    projectName: { en: 'Community Outreach Program', ar: 'برنامج التوعية المجتمعية' },
    fiscalYear: '2024-2025', totalPlanned: 25000, totalActual: 27800, totalCommitted: 1200, currency: 'USD',
    status: 'over_budget', lastUpdated: '2024-12-08',
    lines: [
      { id: 'BL-009', accountCode: '6250', accountName: { en: 'Program Delivery', ar: 'تنفيذ البرنامج' }, category: 'Personnel', planned: 12000, actual: 14500, committed: 0, variance: -2500, variancePercent: -20.8 },
      { id: 'BL-010', accountCode: '6270', accountName: { en: 'Marketing & Outreach', ar: 'التسويق والتواصل' }, category: 'Marketing', planned: 5000, actual: 6200, committed: 1200, variance: -2400, variancePercent: -48 },
      { id: 'BL-011', accountCode: '6280', accountName: { en: 'Venue & Logistics', ar: 'المكان واللوجستيات' }, category: 'Logistics', planned: 8000, actual: 7100, committed: 0, variance: 900, variancePercent: 11.3 },
    ],
  },
];

// ─── Disbursements ───────────────────────────────────────────────────────────

export const MOCK_DISBURSEMENTS: Disbursement[] = [
  {
    id: 'DIS-067', beneficiaryId: 'ben-001', beneficiaryName: { en: 'Yusuf Al-Ahmad', ar: 'يوسف الأحمد' },
    type: 'sponsorship_stipend', amount: 250, currency: 'USD', status: 'completed',
    scheduledDate: '2024-12-01', processedDate: '2024-12-11', fundId: 'fund-education',
    method: 'bank_transfer', approvedBy: 'Fatma Kaya', transactionId: 'TXN-005',
  },
  {
    id: 'DIS-066', beneficiaryId: 'ben-002', beneficiaryName: { en: 'Amira Hassan', ar: 'أميرة حسن' },
    type: 'emergency_relief', amount: 1800, currency: 'USD', status: 'completed',
    scheduledDate: '2024-12-05', processedDate: '2024-12-07', fundId: 'fund-emergency',
    method: 'cash', approvedBy: 'Ahmed Hassan', transactionId: 'TXN-009',
  },
  {
    id: 'DIS-065', beneficiaryId: 'ben-003', beneficiaryName: { en: 'Khalid Mahmoud', ar: 'خالد محمود' },
    type: 'scholarship', amount: 2000, currency: 'USD', status: 'completed',
    scheduledDate: '2024-11-25', processedDate: '2024-11-25', fundId: 'fund-education',
    projectId: 'PROJ-2024-002', projectName: { en: 'Istanbul VTC', ar: 'مركز إسطنبول المهني' },
    method: 'bank_transfer', approvedBy: 'Fatma Kaya', transactionId: 'TXN-017',
  },
  {
    id: 'DIS-064', beneficiaryId: 'ben-001', beneficiaryName: { en: 'Yusuf Al-Ahmad', ar: 'يوسف الأحمد' },
    type: 'sponsorship_stipend', amount: 250, currency: 'USD', status: 'completed',
    scheduledDate: '2024-11-01', processedDate: '2024-11-01', fundId: 'fund-education',
    method: 'bank_transfer', approvedBy: 'Fatma Kaya',
  },
  {
    id: 'DIS-063', beneficiaryId: 'ben-004', beneficiaryName: { en: 'Layla Ibrahim', ar: 'ليلى إبراهيم' },
    type: 'scholarship', amount: 2000, currency: 'USD', status: 'completed',
    scheduledDate: '2024-11-25', processedDate: '2024-11-25', fundId: 'fund-education',
    method: 'bank_transfer', approvedBy: 'Fatma Kaya',
  },
  {
    id: 'DIS-062', beneficiaryId: 'ben-001', beneficiaryName: { en: 'Yusuf Al-Ahmad', ar: 'يوسف الأحمد' },
    type: 'sponsorship_stipend', amount: 250, currency: 'USD', status: 'completed',
    scheduledDate: '2024-10-01', processedDate: '2024-10-01', fundId: 'fund-education',
    method: 'bank_transfer', approvedBy: 'Fatma Kaya',
  },
  {
    id: 'DIS-061', beneficiaryId: 'ben-005', beneficiaryName: { en: 'Nour Al-Din', ar: 'نور الدين' },
    type: 'aid_payment', amount: 500, currency: 'USD', status: 'completed',
    scheduledDate: '2024-10-15', processedDate: '2024-10-15', fundId: 'fund-general',
    method: 'cash', approvedBy: 'Ahmed Hassan',
  },
  {
    id: 'DIS-060', beneficiaryId: 'ben-001', beneficiaryName: { en: 'Yusuf Al-Ahmad', ar: 'يوسف الأحمد' },
    type: 'sponsorship_stipend', amount: 250, currency: 'USD', status: 'completed',
    scheduledDate: '2024-09-01', processedDate: '2024-09-02', fundId: 'fund-education',
    method: 'bank_transfer', approvedBy: 'Fatma Kaya',
  },
  // Upcoming / pending
  {
    id: 'DIS-068', beneficiaryId: 'ben-001', beneficiaryName: { en: 'Yusuf Al-Ahmad', ar: 'يوسف الأحمد' },
    type: 'sponsorship_stipend', amount: 250, currency: 'USD', status: 'scheduled',
    scheduledDate: '2025-01-01', fundId: 'fund-education', method: 'bank_transfer',
  },
  {
    id: 'DIS-069', beneficiaryId: 'ben-006', beneficiaryName: { en: 'Fatima Al-Zahra', ar: 'فاطمة الزهراء' },
    type: 'project_grant', amount: 3500, currency: 'USD', status: 'pending_approval',
    scheduledDate: '2024-12-20', fundId: 'fund-albania',
    projectId: 'PROJ-2024-004', projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    method: 'bank_transfer',
  },
  {
    id: 'DIS-070', beneficiaryId: 'ben-007', beneficiaryName: { en: 'Ahmad Saleh', ar: 'أحمد صالح' },
    type: 'emergency_relief', amount: 800, currency: 'USD', status: 'failed',
    scheduledDate: '2024-12-10', fundId: 'fund-emergency', method: 'mobile_money',
    notes: 'Mobile money transfer failed - invalid recipient number',
  },
  {
    id: 'DIS-071', beneficiaryId: 'ben-003', beneficiaryName: { en: 'Khalid Mahmoud', ar: 'خالد محمود' },
    type: 'scholarship', amount: 2000, currency: 'USD', status: 'approved',
    scheduledDate: '2024-12-25', fundId: 'fund-education',
    projectId: 'PROJ-2024-002', projectName: { en: 'Istanbul VTC', ar: 'مركز إسطنبول المهني' },
    method: 'bank_transfer', approvedBy: 'Fatma Kaya',
  },
];

// ─── Funds ───────────────────────────────────────────────────────────────────

export const MOCK_FUNDS: Fund[] = [
  {
    id: 'fund-general', name: { en: 'General Operating Fund', ar: 'صندوق التشغيل العام' },
    type: 'unrestricted', balance: 187500, currency: 'USD',
    startDate: '2024-01-01', totalReceived: 425000, totalSpent: 215000, totalCommitted: 22500,
  },
  {
    id: 'fund-education', name: { en: 'Education Fund', ar: 'صندوق التعليم' },
    type: 'temporarily_restricted', balance: 92300, currency: 'USD',
    donorRestriction: 'Must be used for educational programs, scholarships, and training activities',
    startDate: '2024-01-01', totalReceived: 185000, totalSpent: 78700, totalCommitted: 14000,
  },
  {
    id: 'fund-albania', name: { en: 'Albania IC Project Fund', ar: 'صندوق مشروع مركز ألبانيا' },
    type: 'temporarily_restricted', balance: 38150, currency: 'USD',
    donorRestriction: 'Restricted to Albania Islamic Center construction and operations',
    projectId: 'PROJ-2024-004', projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    institutionalDonorId: 'QA-001', institutionalDonorName: 'Qatar Charity',
    startDate: '2024-03-01', totalReceived: 56000, totalSpent: 14850, totalCommitted: 3000,
  },
  {
    id: 'fund-endowment', name: { en: 'Endowment Fund', ar: 'صندوق الوقف' },
    type: 'permanently_restricted', balance: 154200, currency: 'USD',
    donorRestriction: 'Principal must be preserved; only investment income may be spent',
    startDate: '2023-01-01', totalReceived: 150000, totalSpent: 0, totalCommitted: 0,
  },
  {
    id: 'fund-emergency', name: { en: 'Emergency Relief Fund', ar: 'صندوق الإغاثة الطارئة' },
    type: 'temporarily_restricted', balance: 15450, currency: 'USD',
    donorRestriction: 'For emergency relief and humanitarian aid only',
    startDate: '2024-01-01', totalReceived: 35000, totalSpent: 18550, totalCommitted: 1000,
  },
];

// ─── Grants ──────────────────────────────────────────────────────────────────

export const MOCK_GRANTS: Grant[] = [
  {
    id: 'GR-2024-001', grantorId: 'QA-001', grantorName: 'Qatar Charity',
    grantNumber: 'QC-ALB-2024-001',
    title: { en: 'Albania Islamic Center Construction Grant', ar: 'منحة بناء مركز ألبانيا الإسلامي' },
    totalAmount: 85000, receivedAmount: 56000, currency: 'USD',
    startDate: '2024-03-01', endDate: '2025-06-30', status: 'active',
    fundId: 'fund-albania', projectId: 'PROJ-2024-004',
    projectName: { en: 'Albania Islamic Center', ar: 'مركز ألبانيا الإسلامي' },
    installments: [
      { id: 'GI-001-01', dueDate: '2024-03-15', amount: 28000, receivedAmount: 28000, receivedDate: '2024-03-18', status: 'received' },
      { id: 'GI-001-02', dueDate: '2024-09-15', amount: 28000, receivedAmount: 28000, receivedDate: '2024-12-12', status: 'received' },
      { id: 'GI-001-03', dueDate: '2025-03-15', amount: 29000, receivedAmount: 0, status: 'pending' },
    ],
    reportingRequirements: 'Quarterly progress reports due within 30 days of quarter end',
  },
  {
    id: 'GR-2023-001', grantorId: 'G-00123', grantorName: 'Global Philanthropy Foundation',
    grantNumber: 'GPF-EDU-2023-045',
    title: { en: 'Education Programs Support Grant', ar: 'منحة دعم البرامج التعليمية' },
    totalAmount: 250000, receivedAmount: 187500, currency: 'USD',
    startDate: '2023-07-01', endDate: '2025-06-30', status: 'active',
    fundId: 'fund-education',
    installments: [
      { id: 'GI-002-01', dueDate: '2023-07-01', amount: 62500, receivedAmount: 62500, receivedDate: '2023-07-05', status: 'received' },
      { id: 'GI-002-02', dueDate: '2024-01-01', amount: 62500, receivedAmount: 62500, receivedDate: '2024-01-03', status: 'received' },
      { id: 'GI-002-03', dueDate: '2024-07-01', amount: 62500, receivedAmount: 62500, receivedDate: '2024-12-08', status: 'received' },
      { id: 'GI-002-04', dueDate: '2025-01-01', amount: 62500, receivedAmount: 0, status: 'pending' },
    ],
    reportingRequirements: 'Semi-annual financial and narrative reports',
  },
  {
    id: 'GR-2024-002', grantorId: 'G-00245', grantorName: 'Innovate Corp',
    grantNumber: 'IC-STEM-2024-012',
    title: { en: 'STEM Education Initiative Grant', ar: 'منحة مبادرة تعليم العلوم والتكنولوجيا' },
    totalAmount: 50000, receivedAmount: 25000, currency: 'USD',
    startDate: '2024-06-01', endDate: '2025-05-31', status: 'active',
    fundId: 'fund-education',
    installments: [
      { id: 'GI-003-01', dueDate: '2024-06-01', amount: 25000, receivedAmount: 25000, receivedDate: '2024-11-28', status: 'received' },
      { id: 'GI-003-02', dueDate: '2025-01-01', amount: 25000, receivedAmount: 0, status: 'pending' },
    ],
    reportingRequirements: 'Annual impact report with beneficiary data',
  },
];

// ─── Approval Items ──────────────────────────────────────────────────────────

export const MOCK_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'APR-001', type: 'expense', title: 'NGO Conference Registration & Travel',
    description: 'Annual NGO conference in Geneva - registration fees, flights, and accommodation for 2 staff members.',
    amount: 3500, currency: 'USD', requestedBy: 'Fatma Kaya', requestedDate: '2024-12-16',
    priority: 'medium', status: 'pending', currentStep: 1, totalSteps: 2, workflowId: 'expenseClaim',
    dueDate: '2024-12-20',
  },
  {
    id: 'APR-002', type: 'disbursement', title: 'Project Grant - Albania IC Community Leader',
    description: 'Grant disbursement for community engagement activities at the Albania Islamic Center.',
    amount: 3500, currency: 'USD', requestedBy: 'Ahmed Hassan', requestedDate: '2024-12-15',
    priority: 'high', status: 'pending', relatedEntityId: 'PROJ-2024-004', relatedEntityName: 'Albania Islamic Center',
    currentStep: 1, totalSteps: 2, workflowId: 'grantDisbursement',
    dueDate: '2024-12-18',
  },
  {
    id: 'APR-003', type: 'budget_amendment', title: 'Community Outreach Budget Increase',
    description: 'Request to increase marketing budget by $3,000 to cover additional outreach activities.',
    amount: 3000, currency: 'USD', requestedBy: 'Sarah Ahmed', requestedDate: '2024-12-14',
    priority: 'medium', status: 'pending', relatedEntityId: 'PROJ-2024-003', relatedEntityName: 'Community Outreach Program',
    currentStep: 2, totalSteps: 3, workflowId: 'purchaseRequisition',
  },
  {
    id: 'APR-004', type: 'purchase_requisition', title: 'IT Equipment - New Laptops',
    description: '3x laptops for new staff members joining the education program team.',
    amount: 4500, currency: 'USD', requestedBy: 'Omar Demir', requestedDate: '2024-12-13',
    priority: 'low', status: 'pending', currentStep: 1, totalSteps: 3, workflowId: 'purchaseRequisition',
  },
  {
    id: 'APR-005', type: 'refund', title: 'Donor Refund - Duplicate Payment',
    description: 'Refund for duplicate online payment from Hassan Ibrahim.',
    amount: 500, currency: 'USD', requestedBy: 'System', requestedDate: '2024-12-15',
    priority: 'high', status: 'pending', relatedEntityId: 'DN-005', relatedEntityName: 'Hassan Ibrahim',
    currentStep: 1, totalSteps: 1, workflowId: 'vendorPayment',
    dueDate: '2024-12-17',
  },
  {
    id: 'APR-006', type: 'expense', title: 'Emergency Vehicle Repair',
    description: 'Urgent repair for field visit vehicle - engine and brake service.',
    amount: 1800, currency: 'USD', requestedBy: 'Yusuf Kara', requestedDate: '2024-12-12',
    priority: 'high', status: 'escalated', currentStep: 2, totalSteps: 2, workflowId: 'expenseClaim',
    dueDate: '2024-12-15',
  },
];

// ─── Financial Alerts ────────────────────────────────────────────────────────

export const MOCK_ALERTS: FinancialAlert[] = [
  {
    id: 'ALR-001', type: 'danger',
    message: { en: 'Overdue pledge from Fatma Yilmaz — $6,000 outstanding since September', ar: 'تعهد متأخر من فاطمة يلماز — 6,000 دولار مستحقة منذ سبتمبر' },
    date: '2024-12-15', relatedEntityId: 'PLG-003', actionRequired: true,
  },
  {
    id: 'ALR-002', type: 'warning',
    message: { en: 'Community Outreach Program budget exceeded by 11.2% — review required', ar: 'تجاوزت ميزانية برنامج التوعية المجتمعية بنسبة 11.2% — مراجعة مطلوبة' },
    date: '2024-12-14', relatedEntityId: 'BDG-003', actionRequired: true,
  },
  {
    id: 'ALR-003', type: 'warning',
    message: { en: 'GPF grant quarterly report due by January 15, 2025', ar: 'تقرير منحة GPF الربعي مستحق بحلول 15 يناير 2025' },
    date: '2024-12-13', relatedEntityId: 'GR-2023-001', actionRequired: true,
  },
  {
    id: 'ALR-004', type: 'info',
    message: { en: 'Emergency Relief Fund balance below $20,000 threshold', ar: 'رصيد صندوق الإغاثة الطارئة أقل من حد 20,000 دولار' },
    date: '2024-12-12', relatedEntityId: 'fund-emergency', actionRequired: false,
  },
  {
    id: 'ALR-005', type: 'danger',
    message: { en: 'Failed disbursement to Ahmad Saleh — mobile money transfer rejected', ar: 'فشل صرف لأحمد صالح — تحويل الأموال عبر الهاتف مرفوض' },
    date: '2024-12-10', relatedEntityId: 'DIS-070', actionRequired: true,
  },
];

// ─── Financial Reports ───────────────────────────────────────────────────────

export const MOCK_REPORTS: FinancialReport[] = [
  {
    id: 'RPT-001', type: 'income_statement',
    name: { en: 'Income Statement', ar: 'قائمة الدخل' },
    description: { en: 'Revenue and expenses summary for the fiscal period', ar: 'ملخص الإيرادات والمصروفات للفترة المالية' },
    lastGenerated: '2024-12-01', format: 'pdf', period: 'Q4 2024',
  },
  {
    id: 'RPT-002', type: 'balance_sheet',
    name: { en: 'Balance Sheet', ar: 'الميزانية العمومية' },
    description: { en: 'Assets, liabilities, and net assets at a point in time', ar: 'الأصول والخصوم وصافي الأصول في نقطة زمنية محددة' },
    lastGenerated: '2024-12-01', format: 'pdf', period: 'Dec 2024',
  },
  {
    id: 'RPT-003', type: 'cash_flow',
    name: { en: 'Cash Flow Statement', ar: 'قائمة التدفقات النقدية' },
    description: { en: 'Cash inflows and outflows from operations, investing, and financing', ar: 'التدفقات النقدية الداخلة والخارجة من العمليات والاستثمار والتمويل' },
    lastGenerated: '2024-11-30', format: 'xlsx', period: 'Nov 2024',
  },
  {
    id: 'RPT-004', type: 'donor_report',
    name: { en: 'Donor Giving Report', ar: 'تقرير تبرعات المتبرعين' },
    description: { en: 'Donations breakdown by donor, campaign, period, and fund', ar: 'تفصيل التبرعات حسب المتبرع والحملة والفترة والصندوق' },
    lastGenerated: '2024-12-05', format: 'xlsx', period: '2024 YTD',
  },
  {
    id: 'RPT-005', type: 'project_financial',
    name: { en: 'Project Financial Report', ar: 'التقرير المالي للمشروع' },
    description: { en: 'Budget vs actuals, burn rate, and cost performance for all projects', ar: 'الميزانية مقابل الفعلي ومعدل الإنفاق وأداء التكلفة لجميع المشاريع' },
    lastGenerated: '2024-12-10', format: 'pdf', period: 'Q4 2024',
  },
  {
    id: 'RPT-006', type: 'fund_utilization',
    name: { en: 'Fund Utilization Report', ar: 'تقرير استخدام الصناديق' },
    description: { en: 'Restricted and unrestricted fund balances, spending, and compliance', ar: 'أرصدة الصناديق المقيدة وغير المقيدة والإنفاق والامتثال' },
    format: 'pdf',
  },
  {
    id: 'RPT-007', type: 'budget_variance',
    name: { en: 'Budget Variance Analysis', ar: 'تحليل فروق الميزانية' },
    description: { en: 'Planned vs actual analysis across all budget categories', ar: 'تحليل المخطط مقابل الفعلي عبر جميع فئات الميزانية' },
    lastGenerated: '2024-12-01', format: 'xlsx', period: 'Nov 2024',
  },
  {
    id: 'RPT-008', type: 'aging_report',
    name: { en: 'Pledge Aging Report', ar: 'تقرير أعمار التعهدات' },
    description: { en: 'Overdue pledges and receivables aged by period', ar: 'التعهدات المتأخرة والمستحقات مصنفة حسب الفترة' },
    format: 'xlsx',
  },
];
