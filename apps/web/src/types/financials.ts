import type { Language } from '../types';

type BilingualText = Record<Language, string>;

// Transactions
export type TransactionStatus = 'draft' | 'pending' | 'approved' | 'posted' | 'reconciled' | 'voided';
export type TransactionDirection = 'inflow' | 'outflow';
export type TransactionCategory =
  | 'donation' | 'grant_income' | 'sponsorship_income' | 'investment_income' | 'other_income'
  | 'project_expense' | 'operational_expense' | 'disbursement' | 'payroll' | 'procurement' | 'refund';

export interface FinancialTransaction {
  id: string;
  date: string;
  description: BilingualText;
  amount: number;
  currency: string;
  direction: TransactionDirection;
  category: TransactionCategory;
  status: TransactionStatus;
  reference: string;
  relatedEntityId?: string;
  relatedEntityType?: 'donor' | 'project' | 'beneficiary' | 'institutional_donor' | 'vendor';
  relatedEntityName?: string;
  accountCode?: string;
  fundId?: string;
  bankAccountId?: string;
  approvedBy?: string;
  approvedDate?: string;
  postedBy?: string;
  postedDate?: string;
  notes?: string;
  attachments?: number;
}

// Donations
export type DonationMethod = 'bank_transfer' | 'credit_card' | 'cash' | 'check' | 'online_gateway' | 'in_kind';
export type ReceiptStatus = 'pending' | 'generated' | 'sent' | 'voided';

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: BilingualText;
  donorType: 'individual' | 'institutional';
  date: string;
  amount: number;
  currency: string;
  method: DonationMethod;
  designation?: string;
  projectId?: string;
  projectName?: BilingualText;
  fundId?: string;
  campaignId?: string;
  campaignName?: string;
  receiptId?: string;
  receiptStatus: ReceiptStatus;
  receiptNumber?: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
  transactionId: string;
}

// Pledges
export type FinancialPledgeStatus = 'active' | 'fulfilled' | 'partially_fulfilled' | 'overdue' | 'cancelled' | 'written_off';

export interface PledgeInstallment {
  id: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  transactionId?: string;
}

export interface FinancialPledge {
  id: string;
  donorId: string;
  donorName: BilingualText;
  donorType: 'individual' | 'institutional';
  pledgeDate: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  status: FinancialPledgeStatus;
  designation?: string;
  projectId?: string;
  projectName?: BilingualText;
  fundId?: string;
  startDate: string;
  endDate: string;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually';
  installments: PledgeInstallment[];
  notes?: string;
}

// Budgets
export type BudgetStatus = 'draft' | 'approved' | 'active' | 'closed' | 'over_budget';

export interface BudgetLine {
  id: string;
  accountCode: string;
  accountName: BilingualText;
  category: string;
  planned: number;
  actual: number;
  committed: number;
  variance: number;
  variancePercent: number;
}

export interface ProjectBudget {
  id: string;
  projectId: string;
  projectName: BilingualText;
  fiscalYear: string;
  totalPlanned: number;
  totalActual: number;
  totalCommitted: number;
  currency: string;
  status: BudgetStatus;
  lines: BudgetLine[];
  lastUpdated: string;
}

// Disbursements
export type DisbursementType = 'aid_payment' | 'sponsorship_stipend' | 'emergency_relief' | 'project_grant' | 'scholarship';
export type DisbursementStatus = 'scheduled' | 'pending_approval' | 'approved' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Disbursement {
  id: string;
  beneficiaryId: string;
  beneficiaryName: BilingualText;
  type: DisbursementType;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  scheduledDate: string;
  processedDate?: string;
  projectId?: string;
  projectName?: BilingualText;
  fundId?: string;
  method: 'bank_transfer' | 'cash' | 'mobile_money' | 'voucher';
  approvedBy?: string;
  notes?: string;
  transactionId?: string;
}

// Funds & Grants
export type FundType = 'unrestricted' | 'temporarily_restricted' | 'permanently_restricted';

export interface Fund {
  id: string;
  name: BilingualText;
  type: FundType;
  balance: number;
  currency: string;
  donorRestriction?: string;
  projectId?: string;
  projectName?: BilingualText;
  institutionalDonorId?: string;
  institutionalDonorName?: string;
  startDate: string;
  endDate?: string;
  totalReceived: number;
  totalSpent: number;
  totalCommitted: number;
}

export interface GrantInstallment {
  id: string;
  dueDate: string;
  amount: number;
  receivedAmount: number;
  receivedDate?: string;
  status: 'pending' | 'received' | 'overdue';
}

export interface Grant {
  id: string;
  grantorId: string;
  grantorName: string;
  grantNumber: string;
  title: BilingualText;
  totalAmount: number;
  receivedAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending' | 'suspended';
  fundId: string;
  projectId?: string;
  projectName?: BilingualText;
  installments: GrantInstallment[];
  reportingRequirements?: string;
}

// Approvals
export type ApprovalItemType = 'expense' | 'disbursement' | 'purchase_requisition' | 'journal_entry' | 'budget_amendment' | 'refund';

export interface ApprovalItem {
  id: string;
  type: ApprovalItemType;
  title: string;
  description: string;
  amount: number;
  currency: string;
  requestedBy: string;
  requestedDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  relatedEntityId?: string;
  relatedEntityName?: string;
  currentStep: number;
  totalSteps: number;
  workflowId: string;
  dueDate?: string;
}

// Reports
export type FinancialReportType = 'income_statement' | 'balance_sheet' | 'cash_flow' | 'donor_report' | 'project_financial' | 'fund_utilization' | 'budget_variance' | 'aging_report';

export interface FinancialReport {
  id: string;
  type: FinancialReportType;
  name: BilingualText;
  description: BilingualText;
  lastGenerated?: string;
  format: 'pdf' | 'xlsx' | 'csv';
  period?: string;
}

// Overview
export interface FinancialAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: BilingualText;
  date: string;
  relatedEntityId?: string;
  actionRequired: boolean;
}

export interface MonthlyFinancialData {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}
