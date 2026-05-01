import type { Donor } from '../types';

// Extend Donor type for this module if needed, but for now it's sufficient.
export type DataQualityRecord = Donor;

export interface AuditLogEntry {
    id: number;
    action: string;
    user: string;
    timestamp: string;
    details: string;
}

export const initialDataQualityData: DataQualityRecord[] = [
  // --- Valid Records ---
  {
    id: 1, name: 'Aisha Al-Farsi', email: 'aisha.f@example.com', totalDonated: 15250, donationCount: 12, firstDonation: '2021-03-15T10:00:00Z', lastDonation: '2024-05-20T10:00:00Z', country: 'UAE', avatar: 'https://picsum.photos/id/1027/100/100', stage: 'stewardship', potentialGift: 5000, relationshipHealth: 'Good', lastContact: '2024-07-10T10:00:00Z', tasks: [],
  },
  {
    id: 4, name: 'David Chen', email: 'david.chen@example.com', totalDonated: 25000, donationCount: 2, firstDonation: '2023-08-01T10:00:00Z', lastDonation: '2024-02-28T10:00:00Z', country: 'Canada', avatar: 'https://picsum.photos/id/1012/100/100', stage: 'solicited', potentialGift: 15000, relationshipHealth: 'Moderate', lastContact: '2024-06-20T10:00:00Z', tasks: [],
  },
  {
    id: 10, name: 'Abdullah Al-Jaber', email: 'abdullah.j@example.com', totalDonated: 35000, donationCount: 7, firstDonation: '2021-09-01T10:00:00Z', lastDonation: '2024-05-05T10:00:00Z', country: 'Saudi Arabia', avatar: 'https://picsum.photos/id/1036/100/100', stage: 'stewardship', potentialGift: 20000, relationshipHealth: 'Good', lastContact: '2024-07-12T10:00:00Z', tasks: [],
  },
  // --- DUPLICATE SET 1 ---
  {
    id: 2, name: 'John Smith', email: 'john.smith@example.com', totalDonated: 7800, donationCount: 5, firstDonation: '2022-01-10T10:00:00Z', lastDonation: '2024-06-01T10:00:00Z', country: 'USA', avatar: 'https://picsum.photos/id/1005/100/100', stage: 'stewardship', potentialGift: 2500, relationshipHealth: 'Good', lastContact: '2024-06-15T10:00:00Z', tasks: [],
  },
  {
    id: 12, name: 'Jon Smith', email: 'jsmith@work.com', totalDonated: 1200, donationCount: 1, firstDonation: '2024-07-15T10:00:00Z', lastDonation: '2024-07-15T10:00:00Z', country: 'USA', avatar: 'https://picsum.photos/id/1005/100/100', stage: 'contacted', potentialGift: 1000, relationshipHealth: 'Moderate', lastContact: '2024-07-16T10:00:00Z', tasks: [],
  },
  // --- DUPLICATE SET 2 ---
  {
    id: 3, name: 'Fatma Yılmaz', email: 'fatma.y@example.com', totalDonated: 3200, donationCount: 8, firstDonation: '2021-11-22T10:00:00Z', lastDonation: '2023-12-18T10:00:00Z', country: 'Turkey', avatar: 'https://picsum.photos/id/1011/100/100', stage: 'cultivating', potentialGift: 1000, relationshipHealth: 'At Risk', lastContact: '2024-01-05T10:00:00Z', tasks: [],
  },
  {
    id: 13, name: 'Fatma Yilmaz', email: 'fatmayilmaz@personal.com', totalDonated: 0, donationCount: 0, firstDonation: '', lastDonation: '', country: 'turkey', avatar: 'https://picsum.photos/id/1011/100/100', stage: 'prospect', potentialGift: 1500, relationshipHealth: 'Moderate', lastContact: '', tasks: [],
  },
  // --- FORMATTING ERRORS ---
  {
    id: 14, name: 'Maria Garcia', email: 'maria.g@examplecom', totalDonated: 500, donationCount: 1, firstDonation: '2024-05-15T10:00:00Z', lastDonation: '2024-05-15T10:00:00Z', country: 'Spain', avatar: 'https://picsum.photos/id/1013/100/100', stage: 'contacted', potentialGift: 1000, relationshipHealth: 'Good', lastContact: '2024-07-01T10:00:00Z', tasks: [],
  },
  // --- MISSING INFO ---
  {
    id: 7, name: 'Omar Hassan', email: '', totalDonated: 0, donationCount: 0, firstDonation: '', lastDonation: '', country: 'Egypt', avatar: 'https://picsum.photos/id/1025/100/100', stage: 'prospect', potentialGift: 2000, relationshipHealth: 'Moderate', lastContact: '', tasks: [],
  },
];


// --- MOCK AI LOGIC ---
// In a real app, this would be a complex backend service.
function calculateSimilarity(str1: string, str2: string): number {
    // Levenshtein distance for simplicity
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i++) track[0][i] = i;
    for (let j = 0; j <= s2.length; j++) track[j][0] = j;
    for (let j = 1; j <= s2.length; j++) {
        for (let i = 1; i <= s1.length; i++) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    const distance = track[s2.length][s1.length];
    const longer = Math.max(s1.length, s2.length);
    return (1 - distance / longer) * 100;
}

export const findDuplicates = (records: DataQualityRecord[]) => {
    const duplicates: { pair: [DataQualityRecord, DataQualityRecord], score: number }[] = [];
    const checkedIds = new Set<number>();

    for (let i = 0; i < records.length; i++) {
        if (checkedIds.has(records[i].id)) continue;
        for (let j = i + 1; j < records.length; j++) {
            if (checkedIds.has(records[j].id)) continue;

            const nameScore = calculateSimilarity(records[i].name, records[j].name);
            const countryScore = (records[i].country.toLowerCase() === records[j].country.toLowerCase()) ? 100 : 0;
            const emailUser1 = records[i].email.split('@')[0];
            const emailUser2 = records[j].email.split('@')[0];
            const emailScore = calculateSimilarity(emailUser1, emailUser2);

            const totalScore = (nameScore * 0.5) + (countryScore * 0.2) + (emailScore * 0.3);

            if (totalScore > 75) {
                duplicates.push({ pair: [records[i], records[j]], score: Math.round(totalScore) });
                checkedIds.add(records[i].id);
                checkedIds.add(records[j].id);
            }
        }
    }
    return duplicates;
};

export const findFormattingErrors = (records: DataQualityRecord[]) => {
    const errors: { record: DataQualityRecord, field: string, issue: string }[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    records.forEach(r => {
        if (r.email && !emailRegex.test(r.email)) {
            errors.push({ record: r, field: 'email', issue: 'Invalid email format' });
        }
    });
    return errors;
};

export const initialIssues = {
    duplicates: findDuplicates(initialDataQualityData),
    formatting: findFormattingErrors(initialDataQualityData)
};
