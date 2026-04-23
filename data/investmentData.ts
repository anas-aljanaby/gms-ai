import type { Portfolio, InvestmentKpi, InvestmentTransaction } from '../types';

export const MOCK_PORTFOLIO: Portfolio = {
    id: 'P001',
    name: { en: 'Endowment Fund', ar: 'صندوق الوقف', tr: 'Vakıf Fonu' },
    description: { en: 'Long-term growth portfolio for operational sustainability.', ar: 'محفظة نمو طويلة الأجل للاستدامة التشغيلية.', tr: 'Operasyonel sürdürülebilirlik için uzun vadeli büyüme portföyü.' },
    investments: [
        { id: 'INV-001', name: 'Apple Inc.', ticker: 'AAPL', assetClass: 'stocks', shariahCompliant: true, quantity: 100, purchasePrice: 150.00, currentPrice: 190.50, purchaseDate: '2023-01-15T00:00:00Z', currency: 'USD' },
        { id: 'INV-002', name: 'US Treasury Bond', ticker: 'US10Y', assetClass: 'bonds', shariahCompliant: false, quantity: 50, purchasePrice: 980.00, currentPrice: 1020.00, purchaseDate: '2022-06-20T00:00:00Z', currency: 'USD' },
        { id: 'INV-003', name: 'Downtown Office Building', assetClass: 'real_estate', shariahCompliant: true, quantity: 1, purchasePrice: 500000, currentPrice: 650000, purchaseDate: '2020-03-10T00:00:00Z', currency: 'USD' },
        { id: 'INV-004', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', assetClass: 'mutual_funds', shariahCompliant: false, quantity: 200, purchasePrice: 400.00, currentPrice: 480.00, purchaseDate: '2022-11-01T00:00:00Z', currency: 'USD' },
        { id: 'INV-005', name: 'Al-Rajhi REIT', ticker: '4339.SR', assetClass: 'real_estate', shariahCompliant: true, quantity: 5000, purchasePrice: 8.50, currentPrice: 9.20, purchaseDate: '2023-05-25T00:00:00Z', currency: 'SAR' },
        { id: 'INV-006', name: 'Cash Balance', assetClass: 'cash', shariahCompliant: true, quantity: 75000, purchasePrice: 1.00, currentPrice: 1.00, purchaseDate: '2024-01-01T00:00:00Z', currency: 'USD' },
    ]
};

export const MOCK_KPI_DATA: InvestmentKpi = {
    portfolioValue: 885000,
    overallRoi: 25.8,
    ytdReturn: 8.2,
    riskScore: 5.5, // on a scale of 1-10
    shariahPercentage: 82,
    annualizedReturn: 12.3,
};

export const MOCK_PERFORMANCE_HISTORY = [
    { date: '2023-07-01', value: 700000 },
    { date: '2023-08-01', value: 715000 },
    { date: '2023-09-01', value: 710000 },
    { date: '2023-10-01', value: 740000 },
    { date: '2023-11-01', value: 780000 },
    { date: '2023-12-01', value: 805000 },
    { date: '2024-01-01', value: 810000 },
    { date: '2024-02-01', value: 835000 },
    { date: '2024-03-01', value: 850000 },
    { date: '2024-04-01', value: 865000 },
    { date: '2024-05-01', value: 870000 },
    { date: '2024-06-01', value: 885000 },
];

export const MOCK_INVESTMENT_TRANSACTIONS: InvestmentTransaction[] = [
    { id: 'TR-001', investmentId: 'INV-001', investmentName: 'Apple Inc.', type: 'buy', quantity: 50, price: 180, date: '2024-05-10T00:00:00Z', totalValue: 9000, currency: 'USD' },
    { id: 'TR-002', investmentId: 'INV-002', investmentName: 'US Treasury Bond', type: 'sell', quantity: 10, price: 1025, date: '2024-04-20T00:00:00Z', totalValue: 10250, currency: 'USD' },
    { id: 'TR-003', investmentId: 'INV-005', investmentName: 'Al-Rajhi REIT', type: 'buy', quantity: 2000, price: 9.10, date: '2024-06-05T00:00:00Z', totalValue: 18200, currency: 'SAR' },
];
