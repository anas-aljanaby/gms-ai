import type { AidStatus } from '../types';
import type { DisbursementStatus } from '../types/financials';

export const FINANCIALS_TAB_STORAGE_KEY = 'gms-financials-tab';

export function mapDisbursementToAidStatus(status: DisbursementStatus): AidStatus {
    if (status === 'completed') return 'Delivered';
    if (status === 'scheduled') return 'Scheduled';
    return 'Pending';
}

export function openFinancialsTab(tabId: string) {
    sessionStorage.setItem(FINANCIALS_TAB_STORAGE_KEY, tabId);
    window.location.hash = 'financials';
}
