import type { KpiDataPoint } from '../types';

function generateNormalData(days: number, base: number, volatility: number): KpiDataPoint[] {
    const data: KpiDataPoint[] = [];
    let value = base;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value)
        });
        value += (Math.random() - 0.5) * volatility * 2;
        value = Math.max(0, value); // Ensure value is not negative
    }
    return data;
}

export const KPI_TIME_SERIES_DATA: Record<string, KpiDataPoint[]> = {
    dailyDonations: [
        ...generateNormalData(20, 1500, 100),
        // Sudden Spike
        { date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0], value: 5000 },
        ...generateNormalData(9, 1600, 120).slice(1),
    ],
    websiteVisitors: [
        ...generateNormalData(15, 800, 50),
        // Sudden Drop
        { date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0], value: 150 },
        ...generateNormalData(14, 820, 60).slice(1),
    ],
    newSignups: [
         ...generateNormalData(10, 50, 5),
        // Missing Data
        { date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString().split('T')[0], value: 0 },
        { date: new Date(new Date().setDate(new Date().getDate() - 19)).toISOString().split('T')[0], value: 0 },
        ...generateNormalData(18, 55, 6).slice(2),
    ],
};
