import type { IndividualDonor, Donation, Communication, DonorCategory } from '../types';

function getMode(arr: number[]): number | null {
    if (arr.length === 0) return null;
    const modeMap: { [key: number]: number } = {};
    let maxCount = 0;
    let modes: number[] = [];

    arr.forEach(el => {
        modeMap[el] = (modeMap[el] || 0) + 1;
        if (modeMap[el] > maxCount) {
            maxCount = modeMap[el];
            modes = [el];
        } else if (modeMap[el] === maxCount) {
            modes.push(el);
        }
    });
    return modes[0]; // Return first mode if multiple
}

function getDayOfWeek(dayIndex: number): IndividualDonor['best_contact_day_of_week'] {
    const days: IndividualDonor['best_contact_day_of_week'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

export const analyzeDonorTiming = (donor: IndividualDonor, allDonations: Donation[], allCommunications: Communication[]): IndividualDonor => {
    const donorDonations = allDonations.filter(d => d.donorId === donor.id);
    const donorCommunications = allCommunications.filter(c => c.donor_id === donor.id);

    let updatedDonor: Partial<IndividualDonor> = {};

    // 1. Analyze donation patterns
    if (donorDonations.length > 0) {
        const donationDaysOfMonth = donorDonations.map(d => new Date(d.date).getDate());
        updatedDonor.best_contact_day_of_month = getMode(donationDaysOfMonth) || undefined;

        if (donorDonations.length > 1) {
            const sortedDates = donorDonations.map(d => new Date(d.date).getTime()).sort((a, b) => a - b);
            let totalDaysDiff = 0;
            for (let i = 1; i < sortedDates.length; i++) {
                totalDaysDiff += (sortedDates[i] - sortedDates[i-1]);
            }
            const avgDays = totalDaysDiff / (sortedDates.length - 1) / (1000 * 60 * 60 * 24);
            updatedDonor.averageDaysBetweenDonations = Math.round(avgDays);
            
            const lastDonationDate = new Date(sortedDates[sortedDates.length - 1]);
            const nextDate = new Date(lastDonationDate.getTime() + avgDays * (1000 * 60 * 60 * 24));
            updatedDonor.next_predicted_donation_date = nextDate.toISOString().split('T')[0];
        }
    }

    // 2. Analyze communication patterns
    if (donorCommunications.length > 0) {
        const openedComms = donorCommunications.filter(c => c.opened_at);
        if (openedComms.length > 0) {
            const openHours = openedComms.map(c => new Date(c.opened_at!).getHours());
            const bestHour = getMode(openHours);
            if (bestHour !== null) {
                updatedDonor.best_contact_time = `${String(bestHour).padStart(2, '0')}:00`;
            }

            const openDays = openedComms.map(c => new Date(c.opened_at!).getDay());
            const bestDayIndex = getMode(openDays);
            if (bestDayIndex !== null) {
                updatedDonor.best_contact_day_of_week = getDayOfWeek(bestDayIndex);
            }
        }
        
        const channelCounts = donorCommunications.reduce((acc, c) => {
            acc[c.communication_type] = (acc[c.communication_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        updatedDonor.preferred_contact_channel = Object.keys(channelCounts).reduce((a, b) => channelCounts[a] > channelCounts[b] ? a : b, 'email') as IndividualDonor['preferred_contact_channel'];
    }

    // 3. Calculate engagement score
    const sentCount = donorCommunications.length;
    if (sentCount > 0) {
        const openedCount = donorCommunications.filter(c => c.opened_at).length;
        const clickedCount = donorCommunications.filter(c => c.clicked_at).length;
        const respondedCount = donorCommunications.filter(c => c.response_at).length;
        const openRate = (openedCount / sentCount);
        const clickRate = (clickedCount / sentCount);
        const responseRate = (respondedCount / sentCount);
        updatedDonor.engagement_score = Math.round((openRate * 30) + (clickRate * 30) + (responseRate * 40));
    } else {
        updatedDonor.engagement_score = 0;
    }

    // 4. Determine contact frequency
    switch (donor.donorCategory) {
        case 'Hero Donor':
        case 'Recurring Donor':
            updatedDonor.contact_frequency_days = 30;
            break;
        case 'Seasonal Donor':
            updatedDonor.contact_frequency_days = 365; // Special logic needed
            break;
        case 'Event Donor':
            updatedDonor.contact_frequency_days = 60;
            break;
        case 'Dormant Donor':
            updatedDonor.contact_frequency_days = 21;
            break;
        default:
            updatedDonor.contact_frequency_days = 90;
    }

    // 5. Predict next donation amount
    if (donorDonations.length >= 3) {
        const lastThree = donorDonations.slice(0, 3).map(d => d.amount);
        const avgAmount = lastThree.reduce((sum, amt) => sum + amt, 0) / 3;
        
        // Simple trend check
        if (lastThree[0] > lastThree[1] * 1.2 && lastThree[1] > lastThree[2] * 1.2) { // Trending up
            updatedDonor.next_predicted_amount = avgAmount * 1.15;
        } else if (lastThree[0] < lastThree[1] * 0.8 && lastThree[1] < lastThree[2] * 0.8) { // Trending down
            updatedDonor.next_predicted_amount = avgAmount * 0.90;
        } else {
            updatedDonor.next_predicted_amount = avgAmount;
        }
    } else if (donorDonations.length > 0) {
        updatedDonor.next_predicted_amount = donorDonations.reduce((sum, d) => sum + d.amount, 0) / donorDonations.length;
    }

    return {
        ...donor,
        ...updatedDonor,
        timing_updated_at: new Date().toISOString(),
    };
};
