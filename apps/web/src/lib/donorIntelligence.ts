
import type { IndividualDonor, Donation, DonorCategory } from '../types';

export const classifyAndEnrichDonor = (donor: IndividualDonor, allDonations: Donation[]): IndividualDonor => {
    const donorDonations = allDonations.filter(d => d.donorId === donor.id);

    if (donorDonations.length === 0) {
        return {
            ...donor,
            donationsCount: 0,
            totalDonations: 0,
            avgGift: 0,
            lastDonationDate: '',
            donorCategory: 'New Donor',
            primaryProgramInterest: 'N/A',
            averageDaysBetweenDonations: undefined,
            categoryUpdatedAt: new Date().toISOString(),
        };
    }

    donorDonations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const donationsCount = donorDonations.length;
    const totalDonations = donorDonations.reduce((sum, d) => sum + d.amount, 0);
    const avgGift = donationsCount > 0 ? totalDonations / donationsCount : 0;
    const lastDonationDate = new Date(donorDonations[0].date);
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Calculate average days between donations
    let averageDaysBetweenDonations: number | undefined;
    if (donationsCount > 1) {
        let totalDays = 0;
        const sortedDates = donorDonations.map(d => new Date(d.date).getTime()).sort((a, b) => a - b);
        for (let i = 1; i < sortedDates.length; i++) {
            totalDays += (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
        }
        averageDaysBetweenDonations = Math.round(totalDays / (donationsCount - 1));
    }

    // Find primary program interest
    const programCounts = donorDonations.reduce((acc, donation) => {
        acc[donation.program] = (acc[donation.program] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const primaryProgramInterest = Object.keys(programCounts).reduce((a, b) => programCounts[a] > programCounts[b] ? a : b, 'N/A');

    let category: DonorCategory = 'General Donor';

    // --- Classification Logic ---

    // 1. Hero Donor
    if (totalDonations > 5000 || donationsCount >= 10) {
        category = 'Hero Donor';
    } 
    // 2. Dormant Donor
    else if (lastDonationDate < sixMonthsAgo) {
        category = 'Dormant Donor';
    } 
    // 3. Recurring Donor
    else {
        const donationsInLast6Months = donorDonations.filter(d => new Date(d.date) >= sixMonthsAgo);
        if (donationsInLast6Months.length >= 3) {
            const sortedDates = donationsInLast6Months.map(d => new Date(d.date).getTime()).sort((a, b) => a - b);
            let isConsistent = true;
            for (let i = 1; i < sortedDates.length; i++) {
                const diffDays = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
                if (diffDays > 45) {
                    isConsistent = false;
                    break;
                }
            }
            if (isConsistent) {
                category = 'Recurring Donor';
            }
        }
    }
    
    // 4. Seasonal Donor (only if not Hero/Dormant/Recurring)
    if (category === 'General Donor' && donationsCount >= 2) {
        const firstMonth = new Date(donorDonations[0].date).getMonth();
        const allSameMonth = donorDonations.every(d => new Date(d.date).getMonth() === firstMonth);
        if (allSameMonth) {
            category = 'Seasonal Donor';
        }
    }
    
    // 5. Event Donor (only if not any of the above)
    if (category === 'General Donor' && donationsCount <= 2 && lastDonationDate >= sixMonthsAgo) {
        category = 'Event Donor';
    }

    return {
        ...donor,
        donationsCount,
        totalDonations,
        avgGift,
        lastDonationDate: donorDonations[0].date,
        donorCategory: category,
        primaryProgramInterest,
        averageDaysBetweenDonations,
        categoryUpdatedAt: new Date().toISOString(),
    };
};