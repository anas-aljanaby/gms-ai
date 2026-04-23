
import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { FinancialSettingsCategory } from '../../../types';
import COAConfiguration from './financials/COAConfiguration';
import FinancialPeriodsConfiguration from './financials/FinancialPeriodsConfiguration';
import ApprovalWorkflowsConfiguration from './financials/ApprovalWorkflowsConfiguration';
import BankingAndPaymentsConfiguration from './financials/BankingAndPaymentsConfiguration';
import {
    ChartOfAccountsIcon,
    FinancialPeriodsIcon,
    ApprovalWorkflowsIcon,
    BankingAndPaymentsIcon,
    TaxAndComplianceIcon,
} from '../../../components/icons/SettingsIcons';

const FinancialSettings: React.FC = () => {
    const { t, dir } = useLocalization();
    const [activeSubCategory, setActiveSubCategory] = useState<FinancialSettingsCategory>('chartOfAccounts');

    const subCategories: { id: FinancialSettingsCategory; icon: React.FC<{className?: string}> }[] = [
        { id: 'chartOfAccounts', icon: ChartOfAccountsIcon },
        { id: 'financialPeriods', icon: FinancialPeriodsIcon },
        { id: 'approvalWorkflows', icon: ApprovalWorkflowsIcon },
        { id: 'bankingAndPayments', icon: BankingAndPaymentsIcon },
        { id: 'taxAndCompliance', icon: TaxAndComplianceIcon },
    ];

    const renderActiveSubCategory = () => {
        switch (activeSubCategory) {
            case 'chartOfAccounts':
                return <COAConfiguration />;
            case 'financialPeriods':
                return <FinancialPeriodsConfiguration />;
            case 'approvalWorkflows':
                return <ApprovalWorkflowsConfiguration />;
            case 'bankingAndPayments':
                return <BankingAndPaymentsConfiguration />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-card dark:bg-dark-card rounded-2xl shadow-inner">
                        <div className="text-6xl mb-4">🚧</div>
                        <h2 className="text-2xl font-bold mb-2">{t(`financialSettings.${activeSubCategory}`)}</h2>
                        <p>{t('placeholder.underConstruction')}</p>
                    </div>
                );
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4">{t('financialSettings.title')}</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/4">
                    <nav className="space-y-1">
                        {subCategories.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveSubCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                                        activeSubCategory === cat.id
                                        ? 'bg-primary-light/80 text-primary-dark font-semibold dark:bg-primary/20 dark:text-secondary-light'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700/50'
                                    } ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span>{t(`financialSettings.${cat.id}`)}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderActiveSubCategory()}
                </main>
            </div>
        </div>
    );
};

export default FinancialSettings;
