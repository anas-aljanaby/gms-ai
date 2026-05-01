
import type { Loan, RepaymentInstallment, LoansData } from '../types';

const generateSchedule = (loanId: string, totalAmount: number, installments: number, issueDate: Date, paidCount: number): RepaymentInstallment[] => {
    const schedule: RepaymentInstallment[] = [];
    const installmentAmount = totalAmount / installments;

    for (let i = 1; i <= installments; i++) {
        const dueDate = new Date(issueDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        const isPaid = i <= paidCount;
        let status: RepaymentInstallment['status'] = 'Due';
        let paidDate: string | undefined = undefined;

        if (isPaid) {
            status = 'Paid';
            const paymentDate = new Date(dueDate);
            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 5)); // Paid a few days before due
            paidDate = paymentDate.toISOString();
        } else {
            if (new Date() > dueDate) {
                status = 'Overdue';
            }
        }
        
        schedule.push({
            id: `${loanId}-inst-${i}`,
            loanId,
            installmentNumber: i,
            dueDate: dueDate.toISOString(),
            amount: installmentAmount,
            status,
            paidDate,
        });
    }
    return schedule;
};


const MOCK_LOANS: Loan[] = [
    {
        id: 'L001',
        borrowerName: 'أحمد',
        type: 'educational',
        amount: 5000,
        currency: 'USD',
        issueDate: '2024-03-01T00:00:00Z',
        status: 'Active',
        repaymentSchedule: generateSchedule('L001', 5000, 12, new Date('2024-03-01T00:00:00Z'), 4),
        donorId: 'DN-001',
        stakeholderId: 2,
        projectId: 'PROJ-2024-001',
        financeEntryId: 'FIN-L001-INIT'
    },
    {
        id: 'L002',
        borrowerName: 'سارة',
        type: 'operational',
        amount: 12000,
        currency: 'USD',
        issueDate: '2024-01-15T00:00:00Z',
        status: 'Active',
        repaymentSchedule: generateSchedule('L002', 12000, 12, new Date('2024-01-15T00:00:00Z'), 6),
        donorId: 'DN-004',
        stakeholderId: 3,
        financeEntryId: 'FIN-L002-INIT'
    }
];

export const MOCK_LOANS_DATA: LoansData = {
    loans: MOCK_LOANS,
};
