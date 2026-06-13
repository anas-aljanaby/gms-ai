import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Assessment, ComplianceRequirement, ComplianceStatus } from '../../../types';

export interface AssessmentPayload {
  date: string;
  status: ComplianceStatus;
  score: number;
  findings?: { en: string; ar: string };
}

interface AssessmentModalProps {
  requirement: ComplianceRequirement;
  latestAssessment?: Assessment;
  onClose: () => void;
  onSubmit: (payload: AssessmentPayload) => void | Promise<void>;
}

const inputClass =
  'mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

const STATUSES: ComplianceStatus[] = [
  'compliant',
  'partially-compliant',
  'non-compliant',
  'not-assessed',
];

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  requirement,
  latestAssessment,
  onClose,
  onSubmit,
}) => {
  const { t, language } = useLocalization(['common', 'grc']);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<ComplianceStatus>(
    latestAssessment?.status ?? 'compliant',
  );
  const [score, setScore] = useState<number>(latestAssessment?.score ?? 100);
  const [findingsEn, setFindingsEn] = useState(latestAssessment?.findings?.en ?? '');
  const [findingsAr, setFindingsAr] = useState(latestAssessment?.findings?.ar ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = Boolean(date) && score >= 0 && score <= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    const findings =
      findingsEn.trim() || findingsAr.trim()
        ? { en: findingsEn.trim(), ar: findingsAr.trim() }
        : undefined;
    await Promise.resolve(onSubmit({ date, status, score, findings }));
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold">{t('grc.compliance.assessment.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('grc.compliance.assessment.for')}:{' '}
              <span className="font-semibold text-foreground dark:text-dark-foreground">
                {requirement.title[language]}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.assessment.date')}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.assessment.score')}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('grc.compliance.assessment.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplianceStatus)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`grc.compliance.statuses.${s.replace('-', '_')}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.assessment.findingsEn')}</label>
                <textarea
                  rows={3}
                  value={findingsEn}
                  onChange={(e) => setFindingsEn(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.assessment.findingsAr')}</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={findingsAr}
                  onChange={(e) => setFindingsAr(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentModal;
