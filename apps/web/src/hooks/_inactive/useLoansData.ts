
import { useReducer, useEffect } from 'react';
import type { LoansData, Loan } from '../types';
import { MOCK_LOANS_DATA } from '../data/loansData';

// Actions can be defined here later if needed
type Action = 
    | { type: 'DUMMY_ACTION' }
    | { type: 'ADD_LOAN'; payload: Loan }
    | { type: 'RECORD_PAYMENT'; payload: { loanId: string; installmentId: string } }
    | { type: 'SIMULATE_FINANCE_POST'; payload: { loanId: string; reason: 'creation' | 'payment' } };

const LOCAL_STORAGE_KEY = 'mss2-erp-loans-data';

const getInitialState = (): LoansData => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to load loans data from localStorage:", error);
    }
    // If no stored data, initialize and save mock data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_LOANS_DATA));
    return MOCK_LOANS_DATA;
};

const loansReducer = (state: LoansData, action: Action): LoansData => {
  switch (action.type) {
    case 'ADD_LOAN':
        return {
            ...state,
            loans: [action.payload, ...state.loans],
        };
    case 'RECORD_PAYMENT': {
        const { loanId, installmentId } = action.payload;
        const newLoans = state.loans.map(loan => {
            if (loan.id === loanId) {
                const newSchedule = loan.repaymentSchedule.map(inst => {
                    if (inst.id === installmentId) {
                        return { ...inst, status: 'Paid' as const, paidDate: new Date().toISOString() };
                    }
                    return inst;
                });

                const allPaid = newSchedule.every(inst => inst.status === 'Paid');
                const newStatus = allPaid ? 'Paid Off' : loan.status;

                return { ...loan, repaymentSchedule: newSchedule, status: newStatus };
            }
            return loan;
        });
        return { ...state, loans: newLoans };
    }
    case 'SIMULATE_FINANCE_POST': {
        const { loanId, reason } = action.payload;
        return {
            ...state,
            loans: state.loans.map(loan => 
                loan.id === loanId 
                    ? { ...loan, financeEntryId: `FIN-${loanId}-${reason.toUpperCase()}-${Date.now().toString().slice(-4)}` } 
                    : loan
            ),
        };
    }
    default:
      return state;
  }
};

export const useLoansData = () => {
  const [loansData, dispatchLoansAction] = useReducer(loansReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loansData));
    } catch (error) {
      console.error("Failed to save loans data to localStorage:", error);
    }
  }, [loansData]);

  return { loansData, dispatchLoansAction };
};
