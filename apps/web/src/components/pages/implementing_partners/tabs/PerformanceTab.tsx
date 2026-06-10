import React from 'react';
import { Plus, Star } from 'lucide-react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { MOCK_EVALUATION_KPIS, MOCK_PARTNER_REVIEWS } from '../partnerStaticData';

const TOTAL_EVALUATIONS = 15;

const StarRating: React.FC<{ rating: number; size?: number; showValue?: boolean }> = ({ rating, size = 16, showValue = false }) => (
    <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={size}
                className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ))}
        {showValue && <span className="font-bold text-sm ml-1">({rating.toFixed(1)})</span>}
    </div>
);

const EvaluationRecordCard: React.FC<{ review: (typeof MOCK_PARTNER_REVIEWS)[0] }> = ({ review }) => {
    const { t } = useLocalization(['partners']);

    return (
        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border dark:border-slate-600">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold">{review.reviewer}</h4>
                    <p className="text-xs text-gray-500">
                        {review.date} · {t('partners.performance.projectLabel')}: {review.project}
                    </p>
                </div>
                <StarRating rating={review.rating} />
            </div>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
        </div>
    );
};

interface PerformanceTabProps {
    partnerRating: number;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ partnerRating }) => {
    const { t } = useLocalization(['partners']);

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                    <p className="text-sm font-semibold text-gray-500">{t('partners.performance.overallScore')}</p>
                    <p className="text-5xl font-bold text-blue-600">{partnerRating.toFixed(1)}</p>
                    <StarRating rating={partnerRating} size={20} />
                    <p className="text-sm text-gray-500 mt-2">{t('partners.performance.basedOn', { count: TOTAL_EVALUATIONS })}</p>
                </div>
                <button type="button" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Plus size={16} /> {t('partners.performance.addEvaluation')}
                </button>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl">
                <h3 className="font-bold mb-4">{t('partners.performance.criteriaTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {MOCK_EVALUATION_KPIS.map((kpi) => (
                        <div key={kpi.label}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold">
                                    {t(`partners.performance.criteria.${kpi.label}`)}
                                </span>
                                <StarRating rating={kpi.rating} showValue />
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${kpi.progress > 85 ? 'bg-green-500' : kpi.progress > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${kpi.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">{t('partners.performance.recordsTitle')}</h3>
                <div className="space-y-4">
                    {MOCK_PARTNER_REVIEWS.map((review, index) => (
                        <EvaluationRecordCard key={index} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceTab;
