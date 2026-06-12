import React, { useMemo, useState } from 'react';
import {
  TriangleAlert,
  BarChart3,
  Search,
  CirclePlus,
  ThumbsDown,
  Shield,
  TrendingDown,
  Gavel,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { COMMON_RISKS } from '../../../data/grcCommonRisks';
import type { GrcRisk, GrcRiskLevel } from '../../../types';
import AiCard from '../ai/AiCard';
import StatCard from './StatCard';
import RiskMatrix from './RiskMatrix';
import RiskStatusBadge from './RiskStatusBadge';
import CommonRiskCard from './CommonRiskCard';
import RiskDetailModal from './RiskDetailModal';
import LogRiskModal, { type LogRiskPayload } from './LogRiskModal';
import { getRiskLevelCardStyles } from './utils';

interface RiskTabProps {
  risks: GrcRisk[];
}

type CommonRiskFilter = 'all' | 'operational' | 'compliance' | 'reputation' | 'data' | 'funding';

const categoryFilterMap: Record<Exclude<CommonRiskFilter, 'all'>, string[]> = {
  funding: ['مالي'],
  data: ['سيبراني', 'تقني'],
  reputation: ['سمعة'],
  compliance: ['امتثال', 'قانوني'],
  operational: ['عمليات', 'تشغيلي'],
};

const LevelBadge: React.FC<{ level: GrcRiskLevel }> = ({ level }) => {
  const { text, bg } = getRiskLevelCardStyles(level);
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>{level}</span>
  );
};

const RiskTab: React.FC<RiskTabProps> = ({ risks: initialRisks }) => {
  const { t } = useLocalization(['common', 'grc', 'projects']);
  const [risks, setRisks] = useState(initialRisks);
  const [registerSearch, setRegisterSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<GrcRisk | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [commonSearch, setCommonSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CommonRiskFilter>('all');

  const filterButtons = [
    {
      id: 'operational' as const,
      label: t('grc.risk.common.operational'),
      icon: <TriangleAlert className="w-6 h-6 text-yellow-600" />,
      color: 'text-yellow-600',
    },
    {
      id: 'compliance' as const,
      label: t('grc.risk.common.compliance'),
      icon: <Gavel className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600',
    },
    {
      id: 'reputation' as const,
      label: t('grc.risk.common.reputation'),
      icon: <ThumbsDown className="w-6 h-6 text-orange-600" />,
      color: 'text-orange-600',
    },
    {
      id: 'data' as const,
      label: t('grc.risk.common.data'),
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
    },
    {
      id: 'funding' as const,
      label: t('grc.risk.common.funding'),
      icon: <TrendingDown className="w-6 h-6 text-red-600" />,
      color: 'text-red-600',
    },
  ];

  const filteredCommonRisks = useMemo(() => {
    return COMMON_RISKS.filter((risk) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        categoryFilterMap[categoryFilter].some((token) => risk.category.includes(token));
      const matchesSearch =
        commonSearch === '' || risk.risk.toLowerCase().includes(commonSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, commonSearch]);

  const stats = useMemo(
    () => ({
      total: risks.length,
      critical: risks.filter((r) => r.level === 'Critical').length,
      high: risks.filter((r) => r.level === 'High').length,
      medium: risks.filter((r) => r.level === 'Medium').length,
    }),
    [risks],
  );

  const filteredRegister = useMemo(
    () =>
      risks.filter(
        (risk) =>
          registerSearch === '' ||
          (risk.risk && risk.risk.toLowerCase().includes(registerSearch.toLowerCase())),
      ),
    [risks, registerSearch],
  );

  const handleLogRisk = (payload: LogRiskPayload) => {
    const newRisk: GrcRisk = {
      ...payload,
      id: `risk-${Date.now()}`,
      mitigation: ['Newly logged mitigation plan to be defined.'],
      status: 'identified',
    };
    setRisks((prev) => [newRisk, ...prev]);
    setIsLogModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('grc.risk.totalRisks')}
            value={stats.total}
            icon={<BarChart3 />}
          />
          <StatCard
            title={t('grc.risk.criticalRisks')}
            value={stats.critical}
            icon={<TriangleAlert className="text-red-500" />}
          />
          <StatCard
            title={t('grc.risk.highRisks')}
            value={stats.high}
            icon={<TriangleAlert className="text-orange-500" />}
          />
          <StatCard
            title={t('grc.risk.mediumRisks')}
            value={stats.medium}
            icon={<TriangleAlert className="text-yellow-500" />}
          />
        </div>

        <AiCard title={t('grc.risk.register')}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={registerSearch}
                onChange={(e) => setRegisterSearch(e.target.value)}
                placeholder={t('grc.risk.searchPlaceholder')}
                className="w-full p-2 pl-10 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg w-full sm:w-auto"
            >
              <CirclePlus size={16} />
              {t('grc.risk.logRisk')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-2">{t('grc.risk.table.description')}</th>
                  <th className="p-2">{t('projects.risks.category')}</th>
                  <th className="p-2 text-center">{t('grc.risk.table.score')}</th>
                  <th className="p-2">{t('grc.risk.level')}</th>
                  <th className="p-2">{t('projects.risks.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegister.map((risk) => {
                  const levelStyles = getRiskLevelCardStyles(risk.level);
                  return (
                    <tr
                      key={risk.id}
                      onClick={() => setSelectedRisk(risk)}
                      className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <td className="p-3 font-semibold text-foreground dark:text-dark-foreground">
                        {risk.risk}
                      </td>
                      <td className="p-3 capitalize">{risk.category}</td>
                      <td className="p-3 text-center">
                        <div
                          className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center font-bold ${levelStyles.bg} ${levelStyles.text}`}
                        >
                          {risk.score}
                        </div>
                      </td>
                      <td className="p-3">
                        <LevelBadge level={risk.level} />
                      </td>
                      <td className="p-3">
                        <RiskStatusBadge status={risk.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRegister.length === 0 && (
              <p className="text-center py-8 text-gray-500">{t('common.noResults')}</p>
            )}
          </div>
        </AiCard>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <RiskMatrix risks={risks} onCellClick={() => {}} activeCell={null} />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 h-full flex flex-col">
              <div className="p-4 border-b dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                  <h3 className="font-bold text-lg">{t('grc.risk.commonRisks')}</h3>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={commonSearch}
                        onChange={(e) => setCommonSearch(e.target.value)}
                        placeholder={t('grc.risk.searchPlaceholder')}
                        className="w-full p-2 pl-10 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() =>
                        setCategoryFilter((prev) => (prev === btn.id ? 'all' : btn.id))
                      }
                      className={`p-2 rounded-lg text-center transition-all duration-200 border-2 ${
                        categoryFilter === btn.id
                          ? 'bg-primary-light/50 border-primary'
                          : 'bg-gray-100 dark:bg-slate-800 border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="mx-auto w-10 h-10 flex items-center justify-center">
                        {btn.icon}
                      </div>
                      <p className={`text-xs font-semibold mt-1 ${btn.color}`}>{btn.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  {filteredCommonRisks.map((risk) => (
                    <CommonRiskCard key={risk.id} risk={risk} />
                  ))}
                </div>
                {filteredCommonRisks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">لا توجد مخاطر مطابقة.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRisk && (
        <RiskDetailModal risk={selectedRisk} onClose={() => setSelectedRisk(null)} />
      )}
      {isLogModalOpen && (
        <LogRiskModal onClose={() => setIsLogModalOpen(false)} onLog={handleLogRisk} />
      )}
    </>
  );
};

export default RiskTab;
