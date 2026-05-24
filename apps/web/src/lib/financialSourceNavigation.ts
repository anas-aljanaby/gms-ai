import type { ApprovalItem, Disbursement } from '../types/financials';

export type FinancialSourceRoute = {
    hash: string;
};

export function getDisbursementSourceRoute(disbursement: Disbursement): FinancialSourceRoute | null {
    if (!disbursement.beneficiaryId) return null;
    return { hash: `beneficiaries/${disbursement.beneficiaryId}/aid_log` };
}

export function getApprovalSourceRoute(
    item: ApprovalItem,
    disbursementById?: Map<string, Disbursement>,
): FinancialSourceRoute | null {
    if (item.type !== 'disbursement') return null;

    const beneficiaryId = item.metadata?.beneficiaryId;
    if (beneficiaryId) {
        return { hash: `beneficiaries/${beneficiaryId}/aid_log` };
    }

    if (item.relatedEntityId && disbursementById) {
        const linked = disbursementById.get(item.relatedEntityId);
        if (linked) return getDisbursementSourceRoute(linked);
    }

    return null;
}

export function navigateToFinancialSource(route: FinancialSourceRoute) {
    window.location.hash = route.hash;
}
