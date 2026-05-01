import React from 'react';
import type { AidItem, Language } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate, formatCurrency, formatNumber } from '../../../lib/utils';
import { FinancialAidIcon, InKindAidIcon, ServiceAidIcon } from '../../icons/AidIcons';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AidLogTabProps {
    aidLog: AidItem[];
}

const AidLogTab: React.FC<AidLogTabProps> = ({ aidLog }) => {
    const { language, dir, t } = useLocalization();

    const aidTypeConfig: Record<AidItem['type'], { icon: React.FC, color: string }> = {
        financial: { icon: FinancialAidIcon, color: 'text-green-500' },
        'in-kind': { icon: InKindAidIcon, color: 'text-blue-500' },
        service: { icon: ServiceAidIcon, color: 'text-purple-500' },
    };

    const statusConfig: Record<AidItem['status'], { icon: React.FC, color: string }> = {
        'Delivered': { icon: CheckCircle, color: 'text-green-500' },
        'Pending': { icon: AlertCircle, color: 'text-yellow-500' },
        'Scheduled': { icon: Clock, color: 'text-blue-500' },
    };

    if (!aidLog || aidLog.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner">
                <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">{t('beneficiaries.aidLog.noItems')}</h3>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{t('beneficiaries.aidLog.title')}</h2>
            <div className={`relative border-gray-200 dark:border-slate-700 ${dir === 'rtl' ? 'border-r-2 pr-8' : 'border-l-2 pl-8'}`}>
                {aidLog.map((item) => {
                    const TypeIcon = aidTypeConfig[item.type].icon;
                    const StatusIcon = statusConfig[item.status].icon;
                    const statusColor = statusConfig[item.status].color;
                    
                    return (
                        <div key={item.id} className="mb-8 relative">
                            <div className={`absolute top-1 w-10 h-10 rounded-full bg-card dark:bg-dark-card border-2 border-gray-200 dark:border-slate-700 flex items-center justify-center ${aidTypeConfig[item.type].color} ${dir === 'rtl' ? 'right-[-52px]' : 'left-[-52px]'}`}>
                                <TypeIcon />
                            </div>
                            <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-md border dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-foreground dark:text-dark-foreground">{item.description[language]}</p>
                                        <p className="text-sm text-gray-500">{formatDate(item.date, language, 'long')}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-semibold ${statusColor}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        {t(`beneficiaries.aidLog.status.${item.status.toLowerCase()}`)}
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t dark:border-slate-600 text-sm">
                                    {item.value !== undefined && (
                                        <p><strong>{t('beneficiaries.aidLog.value')}:</strong> {
                                            item.type === 'financial' && item.unit ? formatCurrency(item.value, language, item.unit)
                                            : `${formatNumber(item.value, language)} ${item.unit || ''}`
                                        }</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AidLogTab;
