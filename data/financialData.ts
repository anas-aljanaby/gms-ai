import type { FinancialPeriod, ApprovalWorkflow, AuthorizationLimit, BankAccount, PaymentGateway, PaymentTerm, PaymentMethod } from '../types';

const generatePeriods = (): FinancialPeriod[] => {
    const year = 2024;
    const periods: FinancialPeriod[] = [];
    const monthNames = {
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    };

    for (let i = 0; i < 12; i++) {
        const startDate = new Date(year, i, 1);
        const endDate = new Date(year, i + 1, 0);
        
        let status: FinancialPeriod['status'];
        if (i < 5) {
            status = 'Hard-Closed';
        } else if (i === 5) {
            status = 'Soft-Closed';
        } else if (i === 6) {
            status = 'Open';
        } else {
            status = 'Future';
        }

        periods.push({
            id: `period-${year}-${i + 1}`,
            name: {
                en: `Period ${i + 1} - ${monthNames.en[i]}`,
                ar: `الفترة ${i + 1} - ${monthNames.ar[i]}`
            },
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: status
        });
    }
    return periods;
};

export const MOCK_FISCAL_YEAR_2024: FinancialPeriod[] = generatePeriods();

export const MOCK_WORKFLOWS: ApprovalWorkflow[] = [
    {
        id: 'purchaseRequisition',
        name: { en: 'Purchase Requisition', ar: 'طلب شراء' },
        description: { en: 'Workflow for approving all purchase requisitions before a PO is created.', ar: 'سير عمل للموافقة على جميع طلبات الشراء قبل إنشاء أمر الشراء.' },
        isEnabled: true,
        steps: [
            { id: 'pr-s1', stepNumber: 1, approverType: 'reportingManager', approverId: 'Manager', condition: null },
            { id: 'pr-s2', stepNumber: 2, approverType: 'role', approverId: 'Manager', condition: { field: 'amount', operator: 'greater_than', value: 5000 } },
            { id: 'pr-s3', stepNumber: 3, approverType: 'role', approverId: 'Admin', condition: { field: 'amount', operator: 'greater_than', value: 20000 } },
        ]
    },
    {
        id: 'vendorPayment',
        name: { en: 'Vendor Payment', ar: 'دفع للمورد' },
        description: { en: 'Approval process for initiating payments to registered vendors.', ar: 'عملية الموافقة على بدء المدفوعات للموردين المسجلين.' },
        isEnabled: true,
        steps: [
            { id: 'vp-s1', stepNumber: 1, approverType: 'role', approverId: 'Manager', condition: null },
            { id: 'vp-s2', stepNumber: 2, approverType: 'role', approverId: 'Admin', condition: { field: 'amount', operator: 'greater_than', value: 10000 } },
        ]
    },
    {
        id: 'expenseClaim',
        name: { en: 'Expense Claim', ar: 'مطالبة مصروفات' },
        description: { en: 'Process for reviewing and reimbursing employee expense claims.', ar: 'عملية مراجعة وتعويض مطالبات مصروفات الموظفين.' },
        isEnabled: false,
        steps: []
    },
    {
        id: 'grantDisbursement',
        name: { en: 'Grant Disbursement', ar: 'صرف منحة' },
        description: { en: 'Approval for disbursing funds for approved grants.', ar: 'الموافقة على صرف الأموال للمنح المعتمدة.' },
        isEnabled: true,
        steps: [
            { id: 'gd-s1', stepNumber: 1, approverType: 'role', approverId: 'Manager', condition: null }
        ]
    }
];

export const MOCK_AUTH_LIMITS: AuthorizationLimit[] = [
    { id: 'al-1', roleId: 'Staff', transactionType: 'purchaseRequisition', limitAmount: 500 },
    { id: 'al-2', roleId: 'Manager', transactionType: 'purchaseRequisition', limitAmount: 5000 },
    { id: 'al-3', roleId: 'Staff', transactionType: 'vendorPayment', limitAmount: 0 },
    { id: 'al-4', roleId: 'Manager', transactionType: 'vendorPayment', limitAmount: 10000 },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    {
        id: 'ba-1',
        accountName: 'Primary Operating Account',
        bankName: 'Kuveyt Türk',
        accountNumber: 'TR330006200000000000001234',
        currency: 'TRY',
        status: 'Active',
        bankFeedConnected: true,
    },
    {
        id: 'ba-2',
        accountName: 'International Donations Account',
        bankName: 'Bank of America',
        accountNumber: 'US120000000000000000005678',
        currency: 'USD',
        status: 'Active',
        bankFeedConnected: false,
    },
     {
        id: 'ba-3',
        accountName: 'Grant Restricted Funds',
        bankName: 'Ziraat Bankası',
        accountNumber: 'TR210001000000000000009012',
        currency: 'EUR',
        status: 'Inactive',
        bankFeedConnected: false,
    }
];

export const MOCK_PAYMENT_GATEWAYS: PaymentGateway[] = [
    {
        id: 'stripe',
        name: 'Stripe',
        isConnected: true,
        isLive: true,
    },
    {
        id: 'paypal',
        name: 'PayPal',
        isConnected: false,
        isLive: false,
    }
];

export const MOCK_PAYMENT_TERMS: PaymentTerm[] = [
    { id: 'pt-1', name: 'Due on Receipt', days: 0 },
    { id: 'pt-2', name: 'Net 15', days: 15 },
    { id: 'pt-3', name: 'Net 30', days: 30 },
    { id: 'pt-4', name: 'Net 60', days: 60 },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm-1', name: 'Bank Transfer', isEnabled: true },
    { id: 'pm-2', name: 'Credit Card', isEnabled: true },
    { id: 'pm-3', name: 'PayPal', isEnabled: false },
    { id: 'pm-4', name: 'Check', isEnabled: true },
    { id: 'pm-5', name: 'Cash', isEnabled: true },
];