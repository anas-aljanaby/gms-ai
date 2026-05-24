import type { Language } from '../types';
import type { ApprovalItem, Disbursement, DisbursementType } from '../types/financials';

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const DISBURSEMENT_TITLE_PATTERN = /^Disbursement approval:\s*(.+)$/i;
const DISBURSEMENT_FOR_PATTERN = /disbursement for\s+(.+)$/i;

export function resolveBeneficiaryName(
    item: ApprovalItem,
    language: Language,
    disbursementById?: Map<string, Disbursement>,
): string | undefined {
    const meta = item.metadata;
    if (meta?.beneficiaryNameEn) {
        return language === 'ar' && meta.beneficiaryNameAr
            ? meta.beneficiaryNameAr
            : meta.beneficiaryNameEn;
    }

    if (item.relatedEntityId && disbursementById) {
        const linked = disbursementById.get(item.relatedEntityId);
        if (linked) {
            const localized = linked.beneficiaryName[language]?.trim();
            if (localized) return localized;
            if (linked.beneficiaryName.en) return linked.beneficiaryName.en;
        }
    }

    if (item.relatedEntityName) return item.relatedEntityName;

    const match = item.title.match(DISBURSEMENT_TITLE_PATTERN) ?? item.title.match(DISBURSEMENT_FOR_PATTERN);
    return match?.[1]?.trim();
}

function disbursementTypeLabel(item: ApprovalItem, t: TranslateFn): string {
    const typeKey = item.metadata?.disbursementType as DisbursementType | undefined;
    if (typeKey) return t(`financials.disbursementType.${typeKey}`);
    return t('financials.approvalType.disbursement');
}

export function getApprovalTitle(
    item: ApprovalItem,
    t: TranslateFn,
    language: Language,
    disbursementById?: Map<string, Disbursement>,
): string {
    if (item.type === 'disbursement') {
        const name = resolveBeneficiaryName(item, language, disbursementById);
        if (name) return t('financials.approvals.disbursementTitle', { name });
    }
    return item.title;
}

export function getApprovalDescription(
    item: ApprovalItem,
    t: TranslateFn,
    language: Language,
    disbursementById?: Map<string, Disbursement>,
): string {
    if (item.type === 'disbursement') {
        const name = resolveBeneficiaryName(item, language, disbursementById);
        if (name) {
            return t('financials.approvals.disbursementDescription', {
                type: disbursementTypeLabel(item, t),
                name,
            });
        }
    }
    return item.description;
}

export function getApprovalRelatedEntityName(
    item: ApprovalItem,
    language: Language,
    disbursementById?: Map<string, Disbursement>,
): string | undefined {
    if (item.type === 'disbursement') {
        return resolveBeneficiaryName(item, language, disbursementById);
    }
    return item.relatedEntityName;
}
