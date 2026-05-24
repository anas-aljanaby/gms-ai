const PLACEHOLDER_DONOR_EMAIL_DOMAIN = '@no-email.local';

export function isPlaceholderDonorEmail(email: string | null | undefined): boolean {
    if (!email?.trim()) return true;
    return email.toLowerCase().includes(PLACEHOLDER_DONOR_EMAIL_DOMAIN);
}

/** Strips internal placeholder emails so UI can treat the donor as having no email. */
export function normalizeDonorEmail(email: string | null | undefined): string {
    return isPlaceholderDonorEmail(email) ? '' : email!.trim();
}
