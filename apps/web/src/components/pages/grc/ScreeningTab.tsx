import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import {
  saveEntity,
  getEntities,
  saveAlert,
  getAlerts,
  getStats,
} from '../../../data/compliance';
import type { ComplianceEntity, ComplianceEntityType, RiskLevel } from '../../../types';
import { formatDate, formatNumber } from '../../../lib/utils';

interface ScreeningResult {
  risk_score: number;
  risk_level: RiskLevel;
  recommendation: 'approve' | 'review' | 'reject';
  reasoning_en: string;
  reasoning_ar: string;
  matchDetails: string | null;
}

function simulateScreening(name: string, _type: ComplianceEntityType, country: string): ScreeningResult {
  const nameLower = name.trim().toLowerCase();
  const countryTrimmed = country.trim();

  if (!nameLower || !countryTrimmed) {
    return {
      risk_score: 10,
      risk_level: 'low',
      recommendation: 'approve',
      reasoning_en: 'Insufficient data provided for a meaningful match. No watchlist hits detected in simulated screening.',
      reasoning_ar: 'البيانات المقدمة غير كافية لمطابقة ذات معنى. لم يتم رصد أي تطابق في الفحص المحاكى.',
      matchDetails: null,
    };
  }

  const highKeywords = ['sanction', 'sanctions', 'terror', 'ofac', 'blocked', 'embargo'];
  if (highKeywords.some((k) => nameLower.includes(k) || countryTrimmed.toLowerCase().includes(k))) {
    return {
      risk_score: 88,
      risk_level: 'high',
      recommendation: 'reject',
      reasoning_en: `Strong simulated match for "${name}" on international sanctions lists (OFAC/UN). Direct name similarity requires rejection pending manual review.`,
      reasoning_ar: `تطابق محاكى قوي لـ "${name}" مع قوائم العقوبات الدولية (OFAC/UN). يتطلب التشابه المباشر الرفض بانتظار المراجعة اليدوية.`,
      matchDetails: `Potential OFAC SDN match: ${name} (${countryTrimmed})`,
    };
  }

  const mediumKeywords = ['global', 'international', 'trading', 'holdings', 'group'];
  if (
    mediumKeywords.some((k) => nameLower.includes(k)) ||
    nameLower.split(/\s+/).length === 1
  ) {
    return {
      risk_score: 55,
      risk_level: 'medium',
      recommendation: 'review',
      reasoning_en: `Partial or ambiguous simulated match for "${name}". Common name or corporate structure warrants enhanced due diligence.`,
      reasoning_ar: `تطابق محاكى جزئي أو غامض لـ "${name}". الاسم الشائع أو الهيكل المؤسسي يستدعي عناية واجبة معززة.`,
      matchDetails: `Ambiguous PEP/adverse media partial match: ${name}`,
    };
  }

  return {
    risk_score: 18,
    risk_level: 'low',
    recommendation: 'approve',
    reasoning_en: `No significant matches found for "${name}" in simulated OFAC, UN, EU, PEP, or adverse media lists.`,
    reasoning_ar: `لم يتم العثور على تطابقات مهمة لـ "${name}" في قوائم OFAC وUN وEU وPEP أو وسائل الإعلام السلبية المحاكاة.`,
    matchDetails: null,
  };
}

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9.5 14.5 5-5" />
    <path d="m14.5 14.5-5-5" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { language } = useLocalization();
  return (
    <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft flex items-center space-x-4 rtl:space-x-reverse">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">
          {formatNumber(value, language)}
        </p>
      </div>
    </div>
  );
};

const ScreeningTab: React.FC = () => {
  const { t, language } = useLocalization(['common', 'compliance', 'projects', 'sidebar', 'misc']);
  const toast = useToast();

  const [stats, setStats] = useState(getStats);
  const [entities, setEntities] = useState<ComplianceEntity[]>(getEntities);
  const [alerts, setAlerts] = useState(getAlerts);
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState<ComplianceEntityType>('individual');
  const [country, setCountry] = useState('');
  const [isScreening, setIsScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  const refreshData = () => {
    setStats(getStats());
    setEntities(getEntities());
    setAlerts(getAlerts());
  };

  const handleScreen = async () => {
    if (!entityName.trim() || !country.trim()) {
      toast.showWarning(t('compliance.toasts.missingInfoMessage'), {
        title: t('compliance.toasts.missingInfoTitle'),
      });
      return;
    }

    setIsScreening(true);
    setScreeningResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const result = simulateScreening(entityName, entityType, country);
      setScreeningResult(result);

      const savedEntity = saveEntity({
        name: entityName,
        type: entityType,
        country,
        riskLevel: result.risk_level,
        lastScreened: new Date().toISOString(),
      });

      if (result.risk_level === 'high' || result.risk_level === 'medium') {
        saveAlert({
          entityId: savedEntity.id,
          entityName: savedEntity.name,
          matchDetails: result.matchDetails || result.reasoning_en,
          listSource: t('compliance.simulatedWatchlist'),
        });
      }

      refreshData();
      setEntityName('');
      setCountry('');
    } catch {
      toast.showError(t('compliance.toasts.screeningFailedMessage'), {
        title: t('compliance.toasts.screeningFailedTitle'),
      });
    } finally {
      setIsScreening(false);
    }
  };

  const riskLevelStyles = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'low':
        return 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700 text-green-800 dark:text-green-200';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const riskEmoji = (level: RiskLevel) => {
    switch (level) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪️';
    }
  };

  const recommendationEmoji = (rec: string) => {
    switch (rec) {
      case 'approve': return '👍';
      case 'review': return '🤔';
      case 'reject': return '👎';
      default: return '❔';
    }
  };

  const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
    const styles: Record<RiskLevel, string> = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
        {t(`projects.risks.levels.${level}`)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('compliance.totalEntities')}
          value={stats.totalEntities}
          icon={<ShieldCheckIcon />}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
        />
        <StatCard
          title={t('compliance.highRisk')}
          value={stats.highRisk}
          icon={<ShieldAlertIcon />}
          color="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
        />
        <StatCard
          title={t('compliance.openAlerts')}
          value={stats.openAlerts}
          icon={<AlertTriangleIcon />}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
          <h3 className="text-lg font-bold mb-4">{t('compliance.screenNew')}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('compliance.entityName')}</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('compliance.entityType')}</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as ComplianceEntityType)}
                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
              >
                <option value="individual">{t('compliance.types.individual')}</option>
                <option value="organization">{t('compliance.types.organization')}</option>
                <option value="vendor">{t('compliance.types.vendor')}</option>
                <option value="partner">{t('compliance.types.partner')}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t('compliance.country')}</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
              />
            </div>
            <button
              onClick={handleScreen}
              disabled={isScreening}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors disabled:bg-gray-400"
            >
              {isScreening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t('compliance.aiScreen')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
          <h3 className="text-lg font-bold mb-4">{t('compliance.recentlyScreened')}</h3>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-2">{t('compliance.headers.name')}</th>
                  <th className="p-2">{t('compliance.headers.type')}</th>
                  <th className="p-2">{t('compliance.headers.riskLevel')}</th>
                  <th className="p-2">{t('compliance.headers.date')}</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity) => (
                  <tr key={entity.id} className="border-t dark:border-slate-700">
                    <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">{entity.name}</td>
                    <td className="p-2 capitalize text-gray-500 dark:text-gray-400">
                      {t(`compliance.types.${entity.type}`)}
                    </td>
                    <td className="p-2">
                      <RiskBadge level={entity.riskLevel} />
                    </td>
                    <td className="p-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(entity.lastScreened, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {screeningResult && (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700/50 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-foreground mb-6">
            📊 {t('compliance.results')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
              <div className="text-sm font-medium mb-2 opacity-90">{t('compliance.score')}</div>
              <div className="text-5xl font-bold">
                {screeningResult.risk_score}
                <span className="text-2xl">/100</span>
              </div>
            </div>
            <div className={`rounded-2xl p-6 border-2 shadow-lg transform hover:scale-105 transition ${riskLevelStyles(screeningResult.risk_level)}`}>
              <div className="text-sm font-medium mb-2">{t('compliance.level')}</div>
              <div className="text-5xl font-bold flex items-center gap-2">
                {riskEmoji(screeningResult.risk_level)}
                <span className="uppercase">{screeningResult.risk_level}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
              <div className="text-sm font-medium mb-2 opacity-90">{t('compliance.rec')}</div>
              <div className="text-5xl font-bold flex items-center gap-2">
                {recommendationEmoji(screeningResult.recommendation)}
                <span className="uppercase">{screeningResult.recommendation}</span>
              </div>
            </div>
          </div>
          <div className={`rounded-2xl p-6 border-2 mb-6 ${riskLevelStyles(screeningResult.risk_level)}`}>
            <h3 className="font-bold text-lg mb-3">💡 {t('compliance.details')}</h3>
            <p className="leading-relaxed">
              {language === 'ar' ? screeningResult.reasoning_ar : screeningResult.reasoning_en}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-6 py-4 rounded-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="font-medium">{t('compliance.saveSuccess')}</span>
          </div>
        </div>
      )}

      <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
        <h3 className="text-lg font-bold mb-4">{t('compliance.activeAlerts')}</h3>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-2">{t('compliance.headers.entity')}</th>
                <th className="p-2">{t('compliance.headers.matchDetails')}</th>
                <th className="p-2">{t('compliance.headers.status')}</th>
                <th className="p-2">{t('compliance.headers.date')}</th>
              </tr>
            </thead>
            <tbody>
              {alerts
                .filter((alert) => alert.status === 'open' || alert.status === 'in-review')
                .map((alert) => (
                  <tr key={alert.id} className="border-t dark:border-slate-700">
                    <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">
                      {alert.entityName}
                    </td>
                    <td className="p-2 text-xs max-w-sm truncate text-gray-500 dark:text-gray-400">
                      {alert.matchDetails}
                    </td>
                    <td className="p-2 capitalize text-gray-500 dark:text-gray-400">
                      {t(`compliance.alertStatuses.${alert.status.replace(/-/g, '_')}`)}
                    </td>
                    <td className="p-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(alert.createdAt, language)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScreeningTab;
