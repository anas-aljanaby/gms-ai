import React, { useState } from 'react';
import type { IndividualDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import Tabs from '../../common/Tabs';
import DetailOverviewTab from './DetailOverviewTab';
import { ArrowLeft } from 'lucide-react';
import { MOCK_DONATIONS } from '../../../data/donationsData';
import { MOCK_COMMUNICATIONS } from '../../../data/communicationsData';
import LogInteractionModal from './LogInteractionModal';
import SendEmailModal from './SendEmailModal';

interface DonorDetailViewProps {
    donor: IndividualDonor;
    onBack: () => void;
}

// Placeholder components for new tabs
const DonationsTab: React.FC = () => <div className="p-8 text-center text-gray-500">Donations history will be displayed here.</div>;
const CommunicationsTab: React.FC = () => <div className="p-8 text-center text-gray-500">Communication log will be displayed here.</div>;
const TasksTab: React.FC = () => <div className="p-8 text-center text-gray-500">Tasks related to this donor will be displayed here.</div>;
const ProfileTab: React.FC<{ donor: IndividualDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'misc']);
    const donorName = donor.fullName[language] || donor.fullName.en;
    return <div className="p-8 text-center text-gray-500">{t('individual_donors.detailView.profilePlaceholder', { donorName })}</div>;
};


const DonorDetailView: React.FC<DonorDetailViewProps> = ({ donor, onBack }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'misc']);
    const toast = useToast();
    const [activeTab, setActiveTab] = React.useState('profile');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleLogInteraction = (interaction: any) => {
        console.log('Logging interaction:', interaction);
        toast.showSuccess('Interaction logged successfully.');
        setIsLogModalOpen(false);
    };

    const handleSendEmail = (emailData: any) => {
        console.log('Sending email:', emailData);
        toast.showSuccess(`Email sent to ${emailData.to}.`);
        setIsEmailModalOpen(false);
    };

    const StatusBadge: React.FC<{ status: IndividualDonor['status'] }> = ({ status }) => {
        const statusKey = status.replace(/ /g, '');
        const styles: Record<IndividualDonor['status'], string> = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'Lapsed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Deceased': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`individual_donors.statuses.${statusKey}`)}</span>;
    };
    
    const TierBadge: React.FC<{ tier: IndividualDonor['tier'] }> = ({ tier }) => {
        const tierKey = tier.replace(/ /g, '');
        const styles: Record<string, string> = {
            'Bronze': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
            'Silver': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'Gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'Platinum': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'MajorDonor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
        };
        const styleClass = styles[tierKey] || styles['Bronze'];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styleClass}`}>{t(`individual_donors.tiers.${tierKey}`)}</span>;
    };

    const tabs = [
        { id: 'overview', label: t('individual_donors.detailView.overview') },
        { id: 'donations', label: t('individual_donors.detailView.donations') },
        { id: 'communications', label: t('individual_donors.detailView.communications') },
        { id: 'tasks', label: t('individual_donors.detailView.tasks') },
        { id: 'profile', label: t('individual_donors.detailView.profile') },
    ];

    const renderTabContent = () => {
        // This data would normally be filtered by a hook, but for now we filter it here
        const donorDonations = MOCK_DONATIONS.filter(d => d.donorId === donor.id);
        const donorCommunications = MOCK_COMMUNICATIONS.filter(c => c.donor_id === donor.id);

        switch(activeTab) {
            case 'overview':
                return <DetailOverviewTab donor={donor} donations={donorDonations} communications={donorCommunications} />;
            case 'donations':
                return <DonationsTab />;
            case 'communications':
                return <CommunicationsTab />;
            case 'tasks':
                return <TasksTab />;
             case 'profile':
                return <ProfileTab donor={donor} />;
            default:
                return <div className="text-center p-8">{t('placeholder.underConstruction')}</div>
        }
    };

    return (
        <>
            <div className="animate-fade-in">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-4">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('individual_donors.backToList')}
                </button>

                <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border border-gray-200 dark:border-slate-700/50">
                    {/* Header */}
                    <div className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b dark:border-slate-700">
                        <img src={donor.avatar} alt={donor.fullName[language]} className="w-24 h-24 rounded-full border-4 border-primary-light dark:border-primary/20" />
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold">{donor.fullName[language]}</h1>
                            <p className="text-gray-500">{donor.country}</p>
                            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                                <TierBadge tier={donor.tier} />
                                <StatusBadge status={donor.status} />
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setIsEmailModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary-dark">{t('individual_donors.detailView.sendEmail')}</button>
                            <button onClick={() => setIsLogModalOpen(true)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">{t('individual_donors.detailView.logInteraction')}</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 pt-2">
                        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 bg-gray-50/50 dark:bg-dark-background/20 rounded-b-2xl">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            <LogInteractionModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onLog={handleLogInteraction}
            />
            <SendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                donorEmail={donor.email}
            />
        </>
    );
};

export default DonorDetailView;
