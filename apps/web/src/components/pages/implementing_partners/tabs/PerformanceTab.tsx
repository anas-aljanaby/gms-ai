import React, { useMemo, useState } from 'react';
import { Plus, Star, X } from 'lucide-react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useToast } from '../../../../hooks/useToast';
import { MOCK_EVALUATION_KPIS, MOCK_PARTNER_REVIEWS, type PartnerReview } from '../partnerStaticData';
import ModalPortal from '../../../common/ModalPortal';
import { fieldClass } from '../shared';

// TODO: Replace local reviews with evaluations API when backend exists

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

const EvaluationRecordCard: React.FC<{ review: PartnerReview }> = ({ review }) => {
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
    onRatingChange: (rating: number) => void;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ partnerRating, onRatingChange }) => {
    const { t } = useLocalization(['partners', 'common']);
    const toast = useToast();
    const [reviews, setReviews] = useState<PartnerReview[]>(MOCK_PARTNER_REVIEWS);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ reviewer: '', project: '', rating: 5, comment: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const overallRating = useMemo(() => {
        if (reviews.length === 0) return partnerRating;
        return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }, [reviews, partnerRating]);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.reviewer.trim()) next.reviewer = t('partners.validation.required');
        if (!form.project.trim()) next.project = t('partners.validation.required');
        if (!form.comment.trim()) next.comment = t('partners.validation.required');
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const newReview: PartnerReview = {
            reviewer: form.reviewer.trim(),
            project: form.project.trim(),
            rating: form.rating,
            comment: form.comment.trim(),
            date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
        };
        const updated = [newReview, ...reviews];
        setReviews(updated);
        const newRating = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length;
        onRatingChange(newRating);
        toast.showSuccess(t('partners.performance.addSuccess'));
        setForm({ reviewer: '', project: '', rating: 5, comment: '' });
        setErrors({});
        setModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                    <p className="text-sm font-semibold text-gray-500">{t('partners.performance.overallScore')}</p>
                    <p className="text-5xl font-bold text-blue-600">{overallRating.toFixed(1)}</p>
                    <StarRating rating={overallRating} size={20} />
                    <p className="text-sm text-gray-500 mt-2">{t('partners.performance.basedOn', { count: reviews.length })}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
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
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                        <p>{t('partners.performance.empty')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review, index) => (
                            <EvaluationRecordCard key={`${review.reviewer}-${review.date}-${index}`} review={review} />
                        ))}
                    </div>
                )}
            </div>

            <ModalPortal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <form className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                                <h2 className="text-xl font-bold">{t('partners.performance.addModalTitle')}</h2>
                                <button type="button" onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                                    <X />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-semibold">{t('partners.performance.evaluatorLabel')} *</label>
                                    <input className={fieldClass} value={form.reviewer} onChange={(e) => setForm((f) => ({ ...f, reviewer: e.target.value }))} />
                                    {errors.reviewer && <p className="text-xs text-red-500 mt-1">{errors.reviewer}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">{t('partners.performance.projectLabel')} *</label>
                                    <input className={fieldClass} value={form.project} onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))} />
                                    {errors.project && <p className="text-xs text-red-500 mt-1">{errors.project}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">{t('partners.performance.ratingLabel')} *</label>
                                    <select className={fieldClass} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}>
                                        {[5, 4, 3, 2, 1].map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">{t('partners.performance.commentLabel')} *</label>
                                    <textarea className={fieldClass} rows={3} value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} />
                                    {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold border rounded-lg">{t('common.cancel')}</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">{t('common.save')}</button>
                            </div>
                </form>
            </ModalPortal>
        </div>
    );
};

export default PerformanceTab;
