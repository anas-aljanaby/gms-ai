import type { KpiDataPoint, Anomaly } from '../types';

const calculateStats = (data: number[]) => {
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    const stdDev = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / data.length);
    return { mean, stdDev };
};

const calculateIQR = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const q1 = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const q3 = sorted.length % 2 === 0 ? (sorted[mid * 2 - 1] + sorted[mid * 2]) / 2 : sorted[mid * 2];
    
    const q1Index = Math.floor(sorted.length / 4);
    const q3Index = Math.floor(sorted.length * 3 / 4);

    const q1Value = sorted.length % 4 === 0 ? (sorted[q1Index - 1] + sorted[q1Index]) / 2 : sorted[q1Index];
    const q3Value = sorted.length % 4 === 0 ? (sorted[q3Index - 1] + sorted[q3Index]) / 2 : sorted[q3Index];

    const iqr = q3Value - q1Value;
    return { q1: q1Value, q3: q3Value, iqr };
};


export const detectAnomalies = (
    data: KpiDataPoint[],
    algorithm: 'z-score' | 'iqr' = 'z-score',
    sensitivity: number = 2.5
): Anomaly[] => {
    const anomalies: Anomaly[] = [];
    const values = data.map(d => d.value);
    
    if (algorithm === 'z-score') {
        const { mean, stdDev } = calculateStats(values);
        const threshold = sensitivity * stdDev;
        const lowerBound = mean - threshold;
        const upperBound = mean + threshold;

        data.forEach(point => {
            if (point.value > upperBound) {
                anomalies.push({ date: point.date, value: point.value, reason: 'spike', expectedRange: [Math.round(lowerBound), Math.round(upperBound)] });
            } else if (point.value < lowerBound && point.value > 0) { // check for > 0 to not conflict with missing
                anomalies.push({ date: point.date, value: point.value, reason: 'drop', expectedRange: [Math.round(lowerBound), Math.round(upperBound)] });
            }
        });
    } else if (algorithm === 'iqr') {
        const { q1, q3, iqr } = calculateIQR(values);
        const lowerBound = q1 - (sensitivity * iqr);
        const upperBound = q3 + (sensitivity * iqr);

        data.forEach(point => {
            if (point.value > upperBound) {
                anomalies.push({ date: point.date, value: point.value, reason: 'spike', expectedRange: [Math.round(lowerBound), Math.round(upperBound)] });
            } else if (point.value < lowerBound && point.value > 0) {
                anomalies.push({ date: point.date, value: point.value, reason: 'drop', expectedRange: [Math.round(lowerBound), Math.round(upperBound)] });
            }
        });
    }

    // Always check for missing data
    data.forEach(point => {
        if (point.value === 0) {
            anomalies.push({ date: point.date, value: point.value, reason: 'missing', expectedRange: [0, 0] });
        }
    });

    return anomalies;
};
