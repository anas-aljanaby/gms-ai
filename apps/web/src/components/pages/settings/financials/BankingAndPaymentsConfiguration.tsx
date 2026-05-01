import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { MOCK_BANK_ACCOUNTS, MOCK_PAYMENT_GATEWAYS, MOCK_PAYMENT_TERMS, MOCK_PAYMENT_METHODS } from '../../../../data/financialData';
import type { BankAccount, PaymentGateway, PaymentTerm, PaymentMethod, BankAccountStatus } from '../../../../types';
import SettingsCard from '../SettingsCard';
import ToggleSwitch from '../ToggleSwitch';
import { EditIcon } from '../../../icons/ActionIcons';
import { PlusCircleIcon, XIcon } from '../../../icons/GenericIcons';
import { BankIcon, CheckCircleIcon, XCircleIcon, StripeIcon, PayPalIcon } from '../../../icons/BankingIcons';

const BankingAndPaymentsConfiguration: React.FC = () => {
    const { t } = useLocalization();
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
    const [gateways, setGateways] = useState<PaymentGateway[]>(MOCK_PAYMENT_GATEWAYS);
    const [terms, setTerms] = useState<PaymentTerm[]>(MOCK_PAYMENT_TERMS);
    const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

    const maskAccountNumber = (num: string) => {
        if (!num) return '';
        const lastFour = num.slice(-4);
        return `**** ${lastFour}`;
    };

    const StatusBadge: React.FC<{ status: BankAccountStatus }> = ({ status }) => {
        const styles: Record<BankAccountStatus, string> = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`financialSettings.banking.statuses.${status}`)}</span>;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('financialSettings.banking.title')}</h3>

            <SettingsCard
                title={t('financialSettings.banking.bankAccountsTitle')}
                description={t('financialSettings.banking.bankAccountsDesc')}
            >
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                       <BankIcon/> {t('financialSettings.banking.addAccount')}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                        {t('financialSettings.banking.connectFeed')}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('financialSettings.banking.accountName')}</th>
                                <th className="p-2">{t('financialSettings.banking.accountNumber')}</th>
                                <th className="p-2">{t('financialSettings.banking.currency')}</th>
                                <th className="p-2">{t('financialSettings.banking.status')}</th>
                                <th className="p-2 text-right">{t('financialSettings.banking.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bankAccounts.map(acc => (
                                <tr key={acc.id} className="border-t dark:border-slate-700">
                                    <td className="p-2 font-semibold">{acc.accountName} <br/><span className="font-normal text-xs text-gray-400">{acc.bankName}</span></td>
                                    <td className="p-2 font-mono">{maskAccountNumber(acc.accountNumber)}</td>
                                    <td className="p-2">{acc.currency}</td>
                                    <td className="p-2"><StatusBadge status={acc.status} /></td>
                                    <td className="p-2 text-right">
                                        <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><EditIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SettingsCard>
            
            <SettingsCard
                title={t('financialSettings.banking.gatewaysTitle')}
                description={t('financialSettings.banking.gatewaysDesc')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {gateways.map(gw => {
                       const Icon = gw.id === 'stripe' ? StripeIcon : PayPalIcon;
                       return (
                            <div key={gw.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700 flex justify-between items-center">
                               <div className="flex items-center gap-4">
                                   <Icon />
                                   <div>
                                       <h4 className="font-bold text-lg">{gw.name}</h4>
                                       <div className="flex items-center gap-1.5 text-sm">
                                           {gw.isConnected ? <CheckCircleIcon/> : <XCircleIcon/>}
                                           <span>{gw.isConnected ? t('financialSettings.banking.connected') : t('financialSettings.banking.notConnected')}</span>
                                       </div>
                                   </div>
                               </div>
                               <button className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-700 rounded-full shadow-sm hover:bg-gray-200">
                                   {t('financialSettings.banking.configure')}
                               </button>
                           </div>
                       )
                   })}
                </div>
            </SettingsCard>

            <SettingsCard
                title={t('financialSettings.banking.termsAndMethodsTitle')}
                description={t('financialSettings.banking.termsAndMethodsDesc')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">{t('financialSettings.banking.paymentTerms')}</h4>
                        <div className="space-y-2">
                           {terms.map(term => (
                               <div key={term.id} className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-2 rounded-md border dark:border-slate-700">
                                   <p>{term.name} <span className="text-gray-400 text-xs">({term.days} {t('financialSettings.banking.days')})</span></p>
                                   <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><EditIcon /></button>
                               </div>
                           ))}
                            <button className="w-full flex items-center justify-center gap-2 py-1.5 text-sm font-medium border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                {t('financialSettings.banking.addTerm')}
                            </button>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">{t('financialSettings.banking.paymentMethods')}</h4>
                        <div className="space-y-2">
                           {methods.map(method => (
                               <div key={method.id} className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-2 rounded-md border dark:border-slate-700">
                                   <p>{method.name}</p>
                                   <ToggleSwitch label="" name={method.id} isChecked={method.isEnabled} onToggle={() => {}} />
                               </div>
                           ))}
                            <button className="w-full flex items-center justify-center gap-2 py-1.5 text-sm font-medium border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                {t('financialSettings.banking.addMethod')}
                            </button>
                        </div>
                    </div>
                </div>
            </SettingsCard>

             <div className="flex justify-end pt-4">
                 <button className="px-6 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark transition-colors">
                    {t('settings.saveChanges')}
                </button>
            </div>
        </div>
    );
};

export default BankingAndPaymentsConfiguration;
