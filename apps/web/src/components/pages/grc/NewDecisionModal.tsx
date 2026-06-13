import React from 'react';
import { X } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';

interface NewDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDecisionModal: React.FC<NewDecisionModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization(['common', 'grc']);
  const { showSuccess } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(t('grc.governance.toasts.decisionLogged'));
    onClose();
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl font-bold">{t('grc.governance.newDecision')}</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('grc.governance.table.decisionTitle')}
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('grc.governance.table.date')}
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('grc.governance.decisionImpact')}
                </label>
                <select className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                  <option value="low">{t('grc.governance.impactLevels.low')}</option>
                  <option value="medium">{t('grc.governance.impactLevels.medium')}</option>
                  <option value="high">{t('grc.governance.impactLevels.high')}</option>
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
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDecisionModal;
