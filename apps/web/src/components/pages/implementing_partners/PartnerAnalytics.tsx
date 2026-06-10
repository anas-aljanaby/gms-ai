import React, { useMemo } from 'react';
import { CheckCircle, Clock, Star, Users } from 'lucide-react';
import type { Partner } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useCountUp } from '../../../hooks/useCountUp';
import { formatNumber } from '../../../lib/utils';

interface KpiTileProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    format?: 'number' | 'rating';
    colorClass: string;
}

const KpiTile: React.FC<KpiTileProps> = ({ title, value, icon, format = 'number', colorClass }) => {
    const { language } = useLocalization(['partners']);
    const animated = useCountUp(value, 1500);

    const display = format === 'rating'
        ? animated.toFixed(1)
        : formatNumber(Math.round(animated), language);

    return (
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-3xl font-bold text-gray-800 dark:text-dark-foreground">{display}</p>
            </div>
        </div>
    );
};

interface PartnerAnalyticsProps {
    partners: Partner[];
}

const PartnerAnalytics: React.FC<PartnerAnalyticsProps> = ({ partners }) => {
    const { t } = useLocalization(['partners']);

    const stats = useMemo(() => {
        const totalPartners = partners.length;
        const activePartners = partners.filter((p) => p.status === 'نشط').length;
        const pendingReview = partners.filter((p) => p.status === 'قيد المراجعة').length;
        const avgPerformance = totalPartners > 0
            ? partners.reduce((sum, p) => sum + p.rating, 0) / totalPartners
            : 0;
        return { totalPartners, activePartners, pendingReview, avgPerformance };
    }, [partners]);

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow p-6 mb-6 border dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-dark-foreground mb-4">{t('partners.summaryTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiTile title={t('partners.kpi.total')} value={stats.totalPartners} icon={<Users />} colorClass="bg-blue-100 text-blue-600" />
                <KpiTile title={t('partners.kpi.active')} value={stats.activePartners} icon={<CheckCircle />} colorClass="bg-green-100 text-green-600" />
                <KpiTile title={t('partners.kpi.pendingReview')} value={stats.pendingReview} icon={<Clock />} colorClass="bg-yellow-100 text-yellow-600" />
                <KpiTile title={t('partners.kpi.avgPerformance')} value={stats.avgPerformance} icon={<Star />} format="rating" colorClass="bg-purple-100 text-purple-600" />
            </div>
        </div>
    );
};

export default PartnerAnalytics;
