import type { Language } from '../types';

export type LocalizedValue = Record<Language, string>;
export type ShariaPriority = 'low' | 'medium' | 'high' | 'critical';
export type FatwaStatus = 'draft' | 'submitted' | 'underReview' | 'issued' | 'archived';
export type ReviewStatus =
  | 'submitted'
  | 'underReview'
  | 'needsClarification'
  | 'approved'
  | 'approvedWithConditions'
  | 'rejected';
export type ReviewType = 'contract' | 'policy' | 'investmentProposal' | 'grantAgreement' | 'procurementContract' | 'financialProduct';
export type ReviewDecision = 'approved' | 'approvedWithConditions' | 'rejected' | 'needsClarification';
export type ZakatEligibilityStatus = 'eligible' | 'ineligible' | 'needsReview' | 'certified';
export type ExceptionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ExceptionStatus = 'open' | 'inReview' | 'resolved' | 'closed';

export interface ShariaStatusHistoryItem {
  status: string;
  actor: string;
  date: string;
}

export interface ShariaFatwa {
  id: string;
  referenceNumber: string;
  topic: LocalizedValue;
  question: LocalizedValue;
  requester: string;
  relatedModule: string;
  relatedRecord: string;
  status: FatwaStatus;
  priority: ShariaPriority;
  assignedReviewerId: string;
  requestedDate: string;
  dueDate: string;
  issuedDate?: string;
  rulingSummary: LocalizedValue;
  reviewNotes: LocalizedValue;
  attachmentsCount: number;
  statusHistory: ShariaStatusHistoryItem[];
}

export interface ShariaReview {
  id: string;
  title: LocalizedValue;
  type: ReviewType;
  description: LocalizedValue;
  sourceModule: string;
  sourceRecord: string;
  counterpartyOrProject: string;
  status: ReviewStatus;
  riskFlag: ShariaPriority;
  priority: ShariaPriority;
  assignedReviewerId: string;
  dueDate: string;
  submittedDate: string;
  decision?: ReviewDecision;
  conditions: LocalizedValue;
  reviewNotes: LocalizedValue;
  attachmentsCount: number;
  activityHistory: ShariaStatusHistoryItem[];
}

export interface ZakatAllocationReview {
  id: string;
  beneficiaryOrProgram: LocalizedValue;
  category: string;
  amount: number;
  date: string;
  eligibilityStatus: ZakatEligibilityStatus;
  financialTransaction: string;
  reviewerId: string;
  notes: LocalizedValue;
}

export interface ZakatPolicyRule {
  id: string;
  category: string;
  rule: LocalizedValue;
  threshold: string;
  effectiveDate: string;
  status: 'active' | 'review';
}

export interface ShariaException {
  id: string;
  title: LocalizedValue;
  severity: ExceptionSeverity;
  source: string;
  linkedRecord: string;
  owner: string;
  status: ExceptionStatus;
  createdDate: string;
  resolutionNotes: LocalizedValue;
  followUpDate?: string;
}

export interface ShariaActivityEvent {
  id: string;
  eventType: string;
  actor: string;
  timestamp: string;
  linkedRecord: string;
  description: LocalizedValue;
}

export interface ShariaTrendPoint {
  month: 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun';
  compliance: number;
  resolvedExceptions: number;
  completedReviews: number;
}

export const MOCK_SHARIA_FATWAS: ShariaFatwa[] = [
  {
    id: 'fatwa-001',
    referenceNumber: 'FTW-2026-014',
    topic: { en: 'Zakat eligibility for education grants', ar: 'أهلية الزكاة لمنح التعليم' },
    question: {
      en: 'Can restricted zakat funds support vocational education grants for families below the nisab threshold?',
      ar: 'هل يجوز استخدام أموال الزكاة المقيدة لدعم منح التعليم المهني للأسر دون حد النصاب؟',
    },
    requester: 'Programs Department',
    relatedModule: 'projects',
    relatedRecord: 'Education Pathways 2026',
    status: 'underReview',
    priority: 'high',
    assignedReviewerId: 'sbm-004',
    requestedDate: '2026-06-02',
    dueDate: '2026-06-18',
    rulingSummary: { en: '', ar: '' },
    reviewNotes: {
      en: 'Eligibility analysis is complete. Awaiting board confirmation on category treatment.',
      ar: 'اكتمل تحليل الأهلية. بانتظار تأكيد الهيئة حول معالجة الفئة.',
    },
    attachmentsCount: 3,
    statusHistory: [
      { status: 'submitted', actor: 'Programs Department', date: '2026-06-02' },
      { status: 'underReview', actor: 'Dr. Aisha Ibrahim', date: '2026-06-05' },
    ],
  },
  {
    id: 'fatwa-002',
    referenceNumber: 'FTW-2026-011',
    topic: { en: 'Late payment clause in supplier agreement', ar: 'شرط التأخير في اتفاقية مورد' },
    question: {
      en: 'Does the proposed damages clause in the clinic equipment contract create a prohibited interest-like penalty?',
      ar: 'هل يشكل شرط التعويض المقترح في عقد معدات العيادة غرامة شبيهة بالربا؟',
    },
    requester: 'Procurement',
    relatedModule: 'financials',
    relatedRecord: 'Supplier Contract C-456',
    status: 'submitted',
    priority: 'critical',
    assignedReviewerId: 'sbm-001',
    requestedDate: '2026-06-08',
    dueDate: '2026-06-14',
    rulingSummary: { en: '', ar: '' },
    reviewNotes: { en: 'Contract text uploaded for review.', ar: 'تم رفع نص العقد للمراجعة.' },
    attachmentsCount: 2,
    statusHistory: [{ status: 'submitted', actor: 'Procurement', date: '2026-06-08' }],
  },
  {
    id: 'fatwa-003',
    referenceNumber: 'FTW-2026-009',
    topic: { en: 'Digital wallet donation settlement', ar: 'تسوية تبرعات المحفظة الرقمية' },
    question: {
      en: 'Are service-fee deductions in the digital wallet settlement acceptable for sadaqah campaigns?',
      ar: 'هل تعتبر خصومات رسوم الخدمة في تسوية المحفظة الرقمية مقبولة لحملات الصدقة؟',
    },
    requester: 'Donor Relations',
    relatedModule: 'donors',
    relatedRecord: 'Ramadan Digital Campaign',
    status: 'issued',
    priority: 'medium',
    assignedReviewerId: 'sbm-002',
    requestedDate: '2026-05-15',
    dueDate: '2026-05-29',
    issuedDate: '2026-05-28',
    rulingSummary: {
      en: 'Permissible when fee terms are disclosed and donor restricted amounts are reconciled net of service charges.',
      ar: 'جائز عند الإفصاح عن شروط الرسوم وتسوية المبالغ المقيدة للمانح بعد خصم رسوم الخدمة.',
    },
    reviewNotes: {
      en: 'Finance must document fee treatment in the campaign closeout.',
      ar: 'يجب على المالية توثيق معالجة الرسوم في إغلاق الحملة.',
    },
    attachmentsCount: 4,
    statusHistory: [
      { status: 'submitted', actor: 'Donor Relations', date: '2026-05-15' },
      { status: 'underReview', actor: 'Sheikh Fatima Al-Mansour', date: '2026-05-18' },
      { status: 'issued', actor: 'Sheikh Fatima Al-Mansour', date: '2026-05-28' },
    ],
  },
];

export const MOCK_SHARIA_REVIEWS: ShariaReview[] = [
  {
    id: 'review-001',
    title: { en: 'Clinic equipment procurement contract', ar: 'عقد توريد معدات العيادة' },
    type: 'procurementContract',
    description: {
      en: 'Review compensation, warranty, and late delivery clauses before signature.',
      ar: 'مراجعة بنود التعويض والضمان والتأخر في التسليم قبل التوقيع.',
    },
    sourceModule: 'financials',
    sourceRecord: 'PO-2026-044',
    counterpartyOrProject: 'Global Med Supply',
    status: 'underReview',
    riskFlag: 'critical',
    priority: 'critical',
    assignedReviewerId: 'sbm-001',
    dueDate: '2026-06-15',
    submittedDate: '2026-06-06',
    decision: 'needsClarification',
    conditions: { en: '', ar: '' },
    reviewNotes: {
      en: 'Penalty clause requires clarification from Legal and Procurement.',
      ar: 'يتطلب شرط الغرامة توضيحا من الشؤون القانونية والمشتريات.',
    },
    attachmentsCount: 5,
    activityHistory: [
      { status: 'submitted', actor: 'Procurement', date: '2026-06-06' },
      { status: 'underReview', actor: 'Dr. Abdullah Al-Fahim', date: '2026-06-07' },
    ],
  },
  {
    id: 'review-002',
    title: { en: 'Sukuk reserve investment proposal', ar: 'مقترح استثمار احتياطي الصكوك' },
    type: 'investmentProposal',
    description: {
      en: 'Confirm instrument screening, income purification, and exit conditions.',
      ar: 'تأكيد فحص الأداة وتنقية الدخل وشروط الخروج.',
    },
    sourceModule: 'financials',
    sourceRecord: 'INV-2026-008',
    counterpartyOrProject: 'Reserve Liquidity Portfolio',
    status: 'submitted',
    riskFlag: 'high',
    priority: 'high',
    assignedReviewerId: 'sbm-004',
    dueDate: '2026-06-20',
    submittedDate: '2026-06-10',
    conditions: { en: '', ar: '' },
    reviewNotes: { en: '', ar: '' },
    attachmentsCount: 2,
    activityHistory: [{ status: 'submitted', actor: 'Finance', date: '2026-06-10' }],
  },
  {
    id: 'review-003',
    title: { en: 'Emergency grant agreement template', ar: 'نموذج اتفاقية منحة الطوارئ' },
    type: 'grantAgreement',
    description: {
      en: 'Review restricted fund language and beneficiary obligations.',
      ar: 'مراجعة صياغة الأموال المقيدة والتزامات المستفيد.',
    },
    sourceModule: 'projects',
    sourceRecord: 'Grant Template v4',
    counterpartyOrProject: 'Emergency Relief Program',
    status: 'approvedWithConditions',
    riskFlag: 'medium',
    priority: 'medium',
    assignedReviewerId: 'sbm-002',
    dueDate: '2026-05-25',
    submittedDate: '2026-05-10',
    decision: 'approvedWithConditions',
    conditions: {
      en: 'Add a paragraph requiring documented eligibility review before disbursement.',
      ar: 'إضافة فقرة تشترط توثيق مراجعة الأهلية قبل الصرف.',
    },
    reviewNotes: {
      en: 'Template may be used after Legal applies the required wording.',
      ar: 'يمكن استخدام النموذج بعد أن تطبق الشؤون القانونية الصياغة المطلوبة.',
    },
    attachmentsCount: 3,
    activityHistory: [
      { status: 'submitted', actor: 'Programs Department', date: '2026-05-10' },
      { status: 'approvedWithConditions', actor: 'Sheikh Fatima Al-Mansour', date: '2026-05-23' },
    ],
  },
];

export const MOCK_ZAKAT_ALLOCATION_REVIEWS: ZakatAllocationReview[] = [
  {
    id: 'zakat-001',
    beneficiaryOrProgram: { en: 'Debt relief disbursement batch', ar: 'دفعة صرف تفريج الديون' },
    category: 'debtRelief',
    amount: 68000,
    date: '2026-06-04',
    eligibilityStatus: 'certified',
    financialTransaction: 'DISB-2026-091',
    reviewerId: 'sbm-003',
    notes: {
      en: 'Beneficiary debt records and hardship evidence reviewed.',
      ar: 'تمت مراجعة سجلات ديون المستفيدين وأدلة التعثر.',
    },
  },
  {
    id: 'zakat-002',
    beneficiaryOrProgram: { en: 'Vocational education vouchers', ar: 'قسائم التعليم المهني' },
    category: 'education',
    amount: 47000,
    date: '2026-06-07',
    eligibilityStatus: 'needsReview',
    financialTransaction: 'DISB-2026-104',
    reviewerId: 'sbm-004',
    notes: {
      en: 'Awaiting final fatwa on education category treatment.',
      ar: 'بانتظار الفتوى النهائية حول معالجة فئة التعليم.',
    },
  },
  {
    id: 'zakat-003',
    beneficiaryOrProgram: { en: 'Monthly food assistance', ar: 'مساعدات الغذاء الشهرية' },
    category: 'poorNeedy',
    amount: 92000,
    date: '2026-05-28',
    eligibilityStatus: 'eligible',
    financialTransaction: 'DISB-2026-077',
    reviewerId: 'sbm-002',
    notes: {
      en: 'Household means testing completed before payment release.',
      ar: 'اكتمل اختبار احتياج الأسر قبل إطلاق الدفعة.',
    },
  },
  {
    id: 'zakat-004',
    beneficiaryOrProgram: { en: 'General operations allocation', ar: 'تخصيص العمليات العامة' },
    category: 'operations',
    amount: 12000,
    date: '2026-06-09',
    eligibilityStatus: 'ineligible',
    financialTransaction: 'JRN-2026-230',
    reviewerId: 'sbm-001',
    notes: {
      en: 'Expense should be moved to unrestricted sadaqah funding.',
      ar: 'ينبغي نقل المصروف إلى تمويل صدقة غير مقيد.',
    },
  },
];

export const MOCK_ZAKAT_POLICY_RULES: ZakatPolicyRule[] = [
  {
    id: 'rule-001',
    category: 'poorNeedy',
    rule: {
      en: 'Direct assistance to verified poor and needy households remains the primary category.',
      ar: 'تظل المساعدة المباشرة للأسر الفقيرة والمحتاجة بعد التحقق هي الفئة الأساسية.',
    },
    threshold: 'No cap',
    effectiveDate: '2026-01-01',
    status: 'active',
  },
  {
    id: 'rule-002',
    category: 'debtRelief',
    rule: {
      en: 'Debt relief requires documented debt, inability to repay, and no duplicate coverage.',
      ar: 'يتطلب تفريج الديون توثيق الدين وعدم القدرة على السداد وعدم وجود تغطية مكررة.',
    },
    threshold: '25%',
    effectiveDate: '2026-01-01',
    status: 'active',
  },
  {
    id: 'rule-003',
    category: 'education',
    rule: {
      en: 'Education support is allowed only when tied to verified hardship and employability outcomes.',
      ar: 'يسمح بدعم التعليم فقط عند ارتباطه بتعثر موثق ومخرجات قابلة للتوظيف.',
    },
    threshold: '30%',
    effectiveDate: '2026-03-01',
    status: 'review',
  },
];

export const MOCK_SHARIA_EXCEPTIONS: ShariaException[] = [
  {
    id: 'exception-001',
    title: { en: 'Interest-bearing transaction detected', ar: 'رصد معاملة ذات فائدة ربوية' },
    severity: 'critical',
    source: 'financials',
    linkedRecord: 'Bank account ****1234',
    owner: 'Finance Controller',
    status: 'open',
    createdDate: '2026-06-11',
    resolutionNotes: {
      en: 'Finance is isolating the transaction and preparing purification entry.',
      ar: 'تعمل المالية على عزل المعاملة وتجهيز قيد التنقية.',
    },
    followUpDate: '2026-06-14',
  },
  {
    id: 'exception-002',
    title: { en: 'Education zakat category approaching policy limit', ar: 'فئة تعليم الزكاة تقترب من حد السياسة' },
    severity: 'high',
    source: 'zakat',
    linkedRecord: 'Vocational education vouchers',
    owner: 'Programs Department',
    status: 'inReview',
    createdDate: '2026-06-09',
    resolutionNotes: {
      en: 'Hold further allocations until the pending ruling is issued.',
      ar: 'إيقاف التخصيصات الإضافية حتى صدور الحكم المعلق.',
    },
    followUpDate: '2026-06-18',
  },
  {
    id: 'exception-003',
    title: { en: 'Procurement contract clause needs Sharia revision', ar: 'بند عقد مشتريات يحتاج إلى تعديل شرعي' },
    severity: 'medium',
    source: 'reviews',
    linkedRecord: 'PO-2026-044',
    owner: 'Procurement',
    status: 'open',
    createdDate: '2026-06-07',
    resolutionNotes: {
      en: 'Clarification requested from supplier.',
      ar: 'تم طلب توضيح من المورد.',
    },
  },
];

export const MOCK_COMPLIANCE_TREND_DATA: ShariaTrendPoint[] = [
  { month: 'jan', compliance: 94.8, resolvedExceptions: 7, completedReviews: 11 },
  { month: 'feb', compliance: 95.7, resolvedExceptions: 9, completedReviews: 13 },
  { month: 'mar', compliance: 94.9, resolvedExceptions: 6, completedReviews: 10 },
  { month: 'apr', compliance: 96.3, resolvedExceptions: 10, completedReviews: 16 },
  { month: 'may', compliance: 97.4, resolvedExceptions: 12, completedReviews: 18 },
  { month: 'jun', compliance: 96.8, resolvedExceptions: 8, completedReviews: 14 },
];

export const MOCK_SHARIA_ACTIVITIES: ShariaActivityEvent[] = [
  {
    id: 'activity-001',
    eventType: 'fatwaIssued',
    actor: 'Sheikh Fatima Al-Mansour',
    timestamp: '2026-06-12T11:30:00.000Z',
    linkedRecord: 'FTW-2026-009',
    description: {
      en: 'Issued ruling for the digital wallet donation settlement.',
      ar: 'أصدرت الحكم الخاص بتسوية تبرعات المحفظة الرقمية.',
    },
  },
  {
    id: 'activity-002',
    eventType: 'reviewUpdated',
    actor: 'Dr. Abdullah Al-Fahim',
    timestamp: '2026-06-11T14:10:00.000Z',
    linkedRecord: 'PO-2026-044',
    description: {
      en: 'Marked procurement contract review as needing clarification.',
      ar: 'صنف مراجعة عقد المشتريات على أنها تحتاج إلى توضيح.',
    },
  },
  {
    id: 'activity-003',
    eventType: 'zakatReviewLogged',
    actor: 'Mr. Omar Hassan',
    timestamp: '2026-06-10T09:40:00.000Z',
    linkedRecord: 'DISB-2026-091',
    description: {
      en: 'Certified debt relief disbursement batch as zakat eligible.',
      ar: 'صدق أهلية دفعة تفريج الديون للزكاة.',
    },
  },
  {
    id: 'activity-004',
    eventType: 'exceptionCreated',
    actor: 'System',
    timestamp: '2026-06-09T08:15:00.000Z',
    linkedRecord: 'Vocational education vouchers',
    description: {
      en: 'Opened exception for education category policy limit.',
      ar: 'فتح استثناء لحد سياسة فئة التعليم.',
    },
  },
  {
    id: 'activity-005',
    eventType: 'fatwaRequested',
    actor: 'Programs Department',
    timestamp: '2026-06-08T12:20:00.000Z',
    linkedRecord: 'FTW-2026-014',
    description: {
      en: 'Requested ruling for zakat eligibility of education grants.',
      ar: 'طلب حكما حول أهلية الزكاة لمنح التعليم.',
    },
  },
];
