import React from 'react';
import { Users, HandCoins, Wallet, Briefcase, HeartHandshake } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import { useBousalaImpact } from '../../../hooks/useBousala';

interface ImpactRollupProps {
    setActiveModule: (module: string) => void;
}

const ImpactRollup: React.FC<ImpactRollupProps> = ({ setActiveModule }) => {
    const { t, language } = useLocalization(['bousala']);
    const { data, isLoading } = useBousalaImpact();

    const tiles = [
        {
            key: 'beneficiaries',
            label: t('bousala.impact.beneficiaries'),
            value: data ? formatNumber(data.beneficiariesReached, language) : '—',
            icon: <Users size={20} />,
            module: 'beneficiaries',
        },
        {
            key: 'fundsRaised',
            label: t('bousala.impact.fundsRaised'),
            value: data ? formatCurrency(data.fundsRaised, language) : '—',
            icon: <HandCoins size={20} />,
            module: 'financials',
        },
        {
            key: 'fundsSpent',
            label: t('bousala.impact.fundsSpent'),
            value: data ? formatCurrency(data.fundsSpent, language) : '—',
            icon: <Wallet size={20} />,
            module: 'financials',
        },
        {
            key: 'activeProjects',
            label: t('bousala.impact.activeProjects'),
            value: data ? formatNumber(data.activeProjects, language) : '—',
            icon: <Briefcase size={20} />,
            module: 'projects',
        },
        {
            key: 'donors',
            label: t('bousala.impact.donors'),
            value: data ? formatNumber(data.donors, language) : '—',
            icon: <HeartHandshake size={20} />,
            module: 'donors',
        },
    ];

    return (
        <div>
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                {t('bousala.impact.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {tiles.map((tile) => (
                    <button
                        key={tile.key}
                        type="button"
                        onClick={() => setActiveModule(tile.module)}
                        className="text-start bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary inline-flex">{tile.icon}</div>
                        <p className={`mt-3 text-2xl font-bold tabular-nums ${isLoading ? 'animate-pulse text-gray-300 dark:text-slate-600' : ''}`}>
                            {tile.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tile.label}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImpactRollup;
