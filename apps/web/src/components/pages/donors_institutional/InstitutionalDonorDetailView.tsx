import React, { useState } from 'react';
import type { InstitutionalDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import Tabs from '../../common/Tabs';
import DetailOverviewTabInstitutional from './DetailOverviewTabInstitutional';
import { ArrowLeft } from 'lucide-react';
import GrantsTab from './GrantsTab';
import ContactsTab from './ContactsTab';
import DocumentsTab from './DocumentsTab';

interface InstitutionalDonorDetailViewProps {
    donor: InstitutionalDonor;
    onBack: () => void;
}

const InstitutionalDonorDetailView: React.FC<InstitutionalDonorDetailViewProps> = ({ donor, onBack }) => {
    const { t, language } = useLocalization(['common', 'institutional_donors']);
    const [activeTab, setActiveTab] = useState('documents');

    const tabs = [
        { id: 'overview', label: t('institutional_donors.detail.overview') },
        { id: 'grants', label: t('institutional_donors.detail.grants') },
        { id: 'contacts', label: t('institutional_donors.detail.contacts') },
        { id: 'documents', label: t('institutional_donors.detail.documents') },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <DetailOverviewTabInstitutional donor={donor} />;
            case 'grants':
                return <GrantsTab donor={donor} />;
            case 'contacts':
                return <ContactsTab donor={donor} />;
            case 'documents':
                return <DocumentsTab />;
            default:
                return <div className="p-8 text-center text-gray-500">{t('placeholder.underConstruction')}</div>;
        }
    };

    return (
        <div className="animate-fade-in space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-2">
                <ArrowLeft className="rtl:rotate-180" /> {t('institutional_donors.backToList')}
            </button>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border border-gray-200 dark:border-slate-700/50">
                <div className="p-6 flex items-center gap-6 border-b dark:border-slate-700">
                    <img src={donor.logo} alt={donor.organizationName[language] || donor.organizationName.en} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <h1 className="text-3xl font-bold">{donor.organizationName[language] || donor.organizationName.en}</h1>
                        <p className="text-gray-500">{t(`institutional_donors.types.${donor.type}`)} &bull; {donor.country}</p>
                    </div>
                </div>
                <div className="px-6 pt-2">
                    <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-dark-background/20 rounded-b-2xl">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default InstitutionalDonorDetailView;
