export const DONOR_STATUSES = ['Active', 'Lapsed', 'On Hold', 'Deceased', 'Disqualified'] as const;

export const DONOR_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Major Donor'] as const;

export const PIPELINE_STAGES = [
    'prospect',
    'researching',
    'contacted',
    'cultivating',
    'solicited',
    'pledged',
    'donated',
    'dormant',
] as const;

export const INTERACTION_TYPES = ['email', 'whatsapp', 'sms', 'call', 'meeting', 'note', 'event'] as const;

export const TASK_TYPES = ['Follow-up', 'Call', 'Email', 'Meeting', 'Review', 'Other'] as const;
