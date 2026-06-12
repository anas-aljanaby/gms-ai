import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BookOpen,
  CirclePlus,
  FileText,
  Shapes,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { useTheme } from '../../hooks/useTheme';
import { ShariaComplianceIcon } from '../icons/ModuleIcons';
import GaugeChart from '../common/GaugeChart';
import {
  MOCK_SHARIA_KPI_DATA,
  MOCK_SHARIA_ALERTS,
  MOCK_COMPLIANCE_TREND_DATA,
  MOCK_SHARIA_ACTIVITIES,
} from '../../data/shariaData';
import { MOCK_SHARIA_BOARD_MEMBERS } from '../../data/shariaBoardData';
import { formatCurrency, formatDate } from '../../lib/utils';

interface ShariaCompliancePageProps {
  setActiveModule?: (module: string) => void;
}

type ActionType = 'newFatwa' | 'submitContract' | 'logZakat';

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  subtext?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, subtext, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50 flex items-center gap-4 ${
      onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all' : ''
    }`}
  >
    <div className="p-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
    </div>
  </div>
);

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType | null;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, actionType }) => {
  const { t } = useLocalization(['sharia', 'misc']);

  const labels: Record<ActionType, string> = {
    newFatwa: t('sharia.actions.newFatwa'),
    submitContract: t('sharia.actions.submitContract'),
    logZakat: t('sharia.actions.logZakat'),
  };

  if (!isOpen || !actionType) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{labels[actionType]}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p>{t('placeholder.underConstruction', { moduleName: labels[actionType] })}</p>
      </div>
    </div>
  );
};

const ACTIVITY_ICONS: Record<string, string> = {
  scale: '⚖️',
  file: '📄',
  coins: '💰',
  users: '👥',
};

const ShariaCompliancePage: React.FC<ShariaCompliancePageProps> = ({ setActiveModule }) => {
  const { t, language, dir } = useLocalization(['common', 'compliance', 'sharia', 'sidebar', 'misc', 'projects']);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const kpi = MOCK_SHARIA_KPI_DATA;
  const boardMembers = MOCK_SHARIA_BOARD_MEMBERS.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const openAction = (action: ActionType) => {
    setActiveAction(action);
    setIsModalOpen(true);
  };

  const zakatProgress = (kpi.zakatDistribution.current / kpi.zakatDistribution.target) * 100;

  return (
    <>
      <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} actionType={activeAction} />

      <div className="space-y-6 animate-fade-in" dir={dir}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground flex items-center gap-3">
            <ShariaComplianceIcon className="w-8 h-8" />
            {t('sidebar.sharia_compliance')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft border dark:border-slate-700/50 flex items-center justify-center">
            <GaugeChart
              value={kpi.complianceRate}
              size={300}
              label={t('sharia.kpi.overallCompliance')}
            />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <KpiCard
              title={t('sharia.kpi.pendingFatwas')}
              value={kpi.pendingFatwas}
              icon={<BookOpen size={24} />}
            />
            <KpiCard
              title={t('sharia.kpi.contractsUnderReview')}
              value={kpi.contractsUnderReview}
              icon={<FileText size={24} />}
            />
            <KpiCard
              title={t('sharia.board.title')}
              value={boardMembers}
              icon={<Users className="w-6 h-6" />}
              subtext={t('sharia.board.members')}
              onClick={() => setActiveModule?.('sharia_board')}
            />
            <KpiCard
              title={t('sharia.kpi.recentAlerts')}
              value={kpi.recentAlerts}
              icon={<TriangleAlert size={24} />}
              subtext={t('sharia.kpi.last24h')}
            />
            <div className="sm:col-span-2 bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('sharia.kpi.zakatDistribution')}
              </h4>
              <p className="text-2xl font-bold text-foreground dark:text-dark-foreground mt-2">
                {formatCurrency(kpi.zakatDistribution.current, language)}
              </p>
              <p className="text-xs text-gray-400">
                {t('sharia.kpi.zakatTarget', {
                  amount: formatCurrency(kpi.zakatDistribution.target, language),
                })}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700 mt-4">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${zakatProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h3 className="font-semibold mb-4">{t('sharia.trend.title')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_COMPLIANCE_TREND_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                  <XAxis dataKey="name" tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }} />
                  <YAxis domain={[97, 100]} tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="compliance"
                    stroke="#f59e0b"
                    fill="url(#colorCompliance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h3 className="font-bold mb-4">{t('sharia.alerts.title')}</h3>
            <div className="space-y-3">
              {MOCK_SHARIA_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    alert.priority === 'critical'
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : 'bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  <TriangleAlert
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.priority === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}
                  />
                  <p className="text-sm">{alert.text[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h3 className="font-bold mb-4">{t('sharia.activity.title')}</h3>
            <ul className="space-y-4">
              {MOCK_SHARIA_ACTIVITIES.map((activity) => (
                <li key={activity.id} className="flex items-center gap-3">
                  <span className="text-xl p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
                    {ACTIVITY_ICONS[activity.icon] ?? <Shapes className="w-5 h-5" />}
                  </span>
                  <div className="flex-grow">
                    <p className="text-sm">{activity.text[language]}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp, language, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h3 className="font-bold mb-4">{t('sharia.actions.title')}</h3>
            <div className="space-y-3">
              {(
                [
                  { action: 'newFatwa' as const, label: t('sharia.actions.newFatwa') },
                  { action: 'submitContract' as const, label: t('sharia.actions.submitContract') },
                  { action: 'logZakat' as const, label: t('sharia.actions.logZakat') },
                ] as const
              ).map(({ action, label }) => (
                <button
                  key={action}
                  onClick={() => openAction(action)}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <CirclePlus className="text-primary" />
                  <span className="font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShariaCompliancePage;
