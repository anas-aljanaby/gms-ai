import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { ComplianceRequirement } from '../../../types';

export interface RequirementPayload {
  code: string;
  title: { en: string; ar: string };
  source: string;
  sourceName: { en: string; ar: string };
  priority: ComplianceRequirement['priority'];
  nextDueDate: string;
  status: ComplianceRequirement['status'];
}

interface RequirementModalProps {
  requirement?: ComplianceRequirement;
  onClose: () => void;
  onSubmit: (payload: RequirementPayload) => void | Promise<void>;
}

const inputClass =
  'mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

const RequirementModal: React.FC<RequirementModalProps> = ({ requirement, onClose, onSubmit }) => {
  const { t } = useLocalization(['common', 'grc']);
  const isEdit = Boolean(requirement);

  const [code, setCode] = useState(requirement?.code ?? '');
  const [titleEn, setTitleEn] = useState(requirement?.title.en ?? '');
  const [titleAr, setTitleAr] = useState(requirement?.title.ar ?? '');
  const [source, setSource] = useState(requirement?.source ?? 'regulatory');
  const [sourceNameEn, setSourceNameEn] = useState(requirement?.sourceName.en ?? '');
  const [sourceNameAr, setSourceNameAr] = useState(requirement?.sourceName.ar ?? '');
  const [priority, setPriority] = useState<ComplianceRequirement['priority']>(
    requirement?.priority ?? 'medium',
  );
  const [nextDueDate, setNextDueDate] = useState(requirement?.nextDueDate ?? '');
  const [status, setStatus] = useState<ComplianceRequirement['status']>(
    requirement?.status ?? 'active',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    code.trim() &&
    titleEn.trim() &&
    titleAr.trim() &&
    sourceNameEn.trim() &&
    sourceNameAr.trim() &&
    nextDueDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    await Promise.resolve(
      onSubmit({
        code: code.trim(),
        title: { en: titleEn.trim(), ar: titleAr.trim() },
        source,
        sourceName: { en: sourceNameEn.trim(), ar: sourceNameAr.trim() },
        priority,
        nextDueDate,
        status,
      }),
    );
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
          <h2 className="text-xl font-bold">
            {isEdit ? t('grc.compliance.editRequirement') : t('grc.compliance.newRequirement')}
          </h2>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.form.code')}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g., REG-01"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.form.priority')}</label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as ComplianceRequirement['priority'])
                  }
                  className={inputClass}
                >
                  <option value="high">{t('grc.compliance.priorities.high')}</option>
                  <option value="medium">{t('grc.compliance.priorities.medium')}</option>
                  <option value="low">{t('grc.compliance.priorities.low')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.form.titleEn')}</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.form.titleAr')}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('grc.compliance.form.source')}</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={inputClass}
              >
                <option value="donor">{t('grc.compliance.sources.donor')}</option>
                <option value="internal">{t('grc.compliance.sources.internal')}</option>
                <option value="regulatory">{t('grc.compliance.sources.regulatory')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.form.sourceNameEn')}</label>
                <input
                  type="text"
                  value={sourceNameEn}
                  onChange={(e) => setSourceNameEn(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.form.sourceNameAr')}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={sourceNameAr}
                  onChange={(e) => setSourceNameAr(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('grc.compliance.form.nextDue')}</label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('grc.compliance.form.status')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplianceRequirement['status'])}
                  className={inputClass}
                >
                  <option value="active">{t('grc.compliance.form.active')}</option>
                  <option value="inactive">{t('grc.compliance.form.inactive')}</option>
                </select>
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

export default RequirementModal;
