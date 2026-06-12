import React from 'react';
import { X } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { GrcRisk } from '../../../types';
import { getRiskLevelBadgeStyles } from './utils';

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className="text-md font-bold">{value}</p>
  </div>
);

interface RiskDetailModalProps {
  risk: GrcRisk | null;
  onClose: () => void;
}

const RiskDetailModal: React.FC<RiskDetailModalProps> = ({ risk, onClose }) => {
  const { t } = useLocalization(['common', 'grc', 'projects']);

  if (!risk) return null;

  const { text, bg } = getRiskLevelBadgeStyles(risk.level);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold">{risk.risk}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className={`p-3 rounded-lg ${bg}`}>
              <p className="text-xs font-bold">{t('grc.risk.level')}</p>
              <p className={`text-lg font-extrabold ${text}`}>{risk.level}</p>
            </div>
            <DetailField label={t('grc.risk.table.score')} value={risk.score} />
            <DetailField label={t('projects.risks.impact')} value={risk.impact} />
            <DetailField label={t('projects.risks.probability')} value={risk.probability} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailField label={t('projects.risks.category')} value={risk.category} />
            <DetailField label={t('grc.risk.scope')} value={risk.scope} />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">{t('grc.risk.mitigation.title')}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm bg-gray-50 dark:bg-slate-800/50 p-4 rounded-md">
              {risk.mitigation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold"
          >
            {t('common.close')}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            {t('grc.risk.mitigation.update')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskDetailModal;
