


import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Beneficiary, Language } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTheme } from '../../../hooks/useTheme';
import { formatDate, formatCurrency, formatNumber } from '../../../lib/utils';
import { SparklesIcon } from '../../icons/GenericIcons';
import { GraduationCapIcon, DollarSignCircleIcon, MessagesIcon, ArrowLeftIcon, DocumentTextIcon } from '../../icons/UtilityIcons';
import Spinner from '../../common/Spinner';
import QualificationJourneyTab from './QualificationJourneyTab';
import BeneficiaryDocumentsTab from './BeneficiaryDocumentsTab';
import { useLeadershipData } from '../../../hooks/useLeadershipData';
import BeneficiaryCalendarView from './BeneficiaryCalendarView';
import NeedsAssessmentTab from './NeedsAssessmentTab';
import AidLogTab from './AidLogTab';
import BeneficiaryJourneyTab from './BeneficiaryJourneyTab';

// --- SUB-COMPONENTS ---
const InfoItem: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-foreground dark:text-dark-foreground">{value || 'N/A'}</dd>
    </div>
);

const getBeneficiarySubtitle = (beneficiary: Beneficiary, language: Language, t: (key: string, options?: any) => string): string => {
    switch (beneficiary.beneficiaryType) {
        case 'student':
            const info = beneficiary.profile?.academicInfo;
            if (info?.field && info?.university) {
                return t('beneficiaries.subtitle_at', { field: info.field, university: info.university });
            }
            return info?.level?.[language] || beneficiary.country;
        case 'family':
            const memberCount = beneficiary.profile?.customData?.['عدد أفراد الأسرة'];
            return memberCount ? `أسرة مكونة من ${memberCount} أفراد` : beneficiary.country;
        case 'orphan':
             const grade = beneficiary.profile?.customData?.['المرحلة الدراسية'];
            return grade || beneficiary.country;
        default:
            return beneficiary.country;
    }
}


const Header: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { t, language } = useLocalization();
    const statusStyles = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Graduated': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    const subtitle = getBeneficiarySubtitle(beneficiary, language, t);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src={beneficiary.photo} alt={beneficiary.name} className="w-32 h-32 rounded-full border-4 border-primary-light dark:border-primary/20 shadow-lg" loading="lazy"/>
            <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground">{beneficiary.name}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">{subtitle}</p>
                 <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[beneficiary.profile.sponsorshipDetails?.status || 'Active']}`}>
                        {beneficiary.profile.sponsorshipDetails?.status || 'Active'}
                    </span>
                     <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700">
                        {t(beneficiary.type === 'sponsorship' ? 'beneficiaries.sponsorships' : 'beneficiaries.directSupport')}
                    </span>
                </div>
            </div>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string | React.ReactNode; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft flex items-center gap-4">
        <div className="text-primary dark:text-secondary text-2xl">{icon}</div>
        <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
            <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
        </div>
    </div>
);

const AcademicProgressChart: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const data = beneficiary.profile.academicRecords?.reports?.map(r => ({
        date: new Date(r.date).toLocaleDateString(language, { year: 'numeric', month: 'short'}),
        gpa: r.gpa
    })) || [];
    
    if (data.length <= 1) {
        return <div className="text-center text-sm text-gray-500 py-10">Not enough data for a chart.</div>;
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"} />
                    <XAxis dataKey="date" tick={{ fill: isDark ? "#fff" : "#333", fontSize: 12 }} />
                    <YAxis domain={[0, 4]} tick={{ fill: isDark ? "#fff" : "#333" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gpa" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const OverviewTab: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { t, language } = useLocalization();
    const renderStudentDetails = () => {
        const info = beneficiary.profile?.academicInfo;
        return (
            <>
                <InfoItem label={t('beneficiaries.overview.university')} value={info?.university} />
                <InfoItem label={t('beneficiaries.overview.major')} value={info?.field} />
                <InfoItem label={t('beneficiaries.overview.gpa')} value={info?.gpa} />
                <InfoItem label={t('beneficiaries.overview.academic_year')} value={info?.level?.[language] || 'N/A'} />
            </>
        );
    };
    
    const renderCustomDetails = () => {
        const customData = beneficiary.profile?.customData;
        if (!customData) return <p>No custom data available.</p>;
        return (
            <>
                {Object.entries(customData).map(([key, value]) => (
                    <InfoItem key={key} label={key} value={String(value)} />
                ))}
            </>
        );
    };

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-inner border dark:border-slate-700/50">
            <h3 className="font-bold text-lg mb-4">{t('beneficiaries.overview.title')}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem label={t('beneficiaries.overview.id')} value={beneficiary.id} />
                <InfoItem label={t('beneficiaries.overview.country')} value={beneficiary.country} />
                <InfoItem label={t('beneficiaries.overview.email')} value={beneficiary.profile?.contact?.email} />
                <InfoItem label={t('beneficiaries.overview.phone')} value={beneficiary.profile?.contact?.phone} />
                {beneficiary.beneficiaryType === 'student' ? renderStudentDetails() : renderCustomDetails()}
            </dl>
        </div>
    );
};


interface BeneficiaryDetailViewProps {
    beneficiary: Beneficiary;
    onBack: () => void;
    onOpenPortal: () => void;
    onUpdate: (beneficiary: Beneficiary) => void;
}


// --- MAIN COMPONENT ---
const BeneficiaryDetailView: React.FC<BeneficiaryDetailViewProps> = ({ beneficiary, onBack, onOpenPortal, onUpdate }) => {
    const { t, language } = useLocalization();
    const [activeTab, setActiveTab] = useState('overview');
    const { leadershipData, dispatch } = useLeadershipData();

    const tabs = [
        { id: 'overview', label: t('beneficiaries.modal.tabs.personal') },
        { id: 'journey_impact', label: t('beneficiaries.modal.tabs.journey_impact') },
        { id: 'academics', label: t('beneficiaries.modal.tabs.academic') },
        { id: 'sponsorship', label: t('beneficiaries.modal.tabs.sponsorship') },
        { id: 'needs_assessment', label: t('beneficiaries.modal.tabs.needs_assessment') },
        { id: 'qualification_journey', label: t('beneficiaries.modal.tabs.qualification_journey') },
        { id: 'aid_log', label: t('beneficiaries.modal.tabs.aid_log') },
        { id: 'calendar', label: t('beneficiaries.modal.tabs.calendar') },
        { id: 'documents', label: t('beneficiaries.modal.tabs.files_and_documents') },
        { id: 'communication', label: t('beneficiaries.modal.tabs.communication') },
    ];
    
    const TabButton: React.FC<{id: string, label: string}> = ({ id, label }) => (
        <button
          onClick={() => setActiveTab(id)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === id ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}
        >
          {label}
        </button>
    );
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return <OverviewTab beneficiary={beneficiary} />;
            case 'journey_impact':
                return <BeneficiaryJourneyTab beneficiary={beneficiary} />;
            case 'academics':
                return (
                    <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft">
                        <h3 className="font-bold text-lg mb-4">Academic Progress</h3>
                         <AcademicProgressChart beneficiary={beneficiary} />
                    </div>
                );
            case 'qualification_journey':
                return <QualificationJourneyTab beneficiary={beneficiary} />;
            case 'aid_log':
                return <AidLogTab aidLog={beneficiary.profile?.aidLog || []} />;
            case 'calendar':
                return <BeneficiaryCalendarView beneficiary={beneficiary} leadershipData={leadershipData} dispatch={dispatch} />;
            case 'documents':
                return <BeneficiaryDocumentsTab documents={beneficiary.profile.documents || []} beneficiaryName={beneficiary.name} />;
            case 'needs_assessment':
                return <NeedsAssessmentTab beneficiary={beneficiary} onUpdate={onUpdate} />;
            default:
                return <div className="text-center p-16 text-gray-500 bg-card dark:bg-dark-card rounded-xl">{t('placeholder.underConstruction')}</div>;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6">
            <div className="flex justify-between items-start mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <ArrowLeftIcon className="rtl:rotate-180" /> {t('beneficiaries.backToList')}
                </button>
                <button
                  onClick={onOpenPortal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <span>🚀</span>
                  <span>دخول البوابة الشخصية</span>
                </button>
            </div>
            <Header beneficiary={beneficiary} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title={t('beneficiaries.kpi.gpa')} value={beneficiary.profile.academicRecords?.gpa?.toFixed(2) || 'N/A'} icon={<GraduationCapIcon />} />
                <KpiCard title={t('beneficiaries.kpi.financialAid')} value={formatCurrency(beneficiary.profile.financialAid?.supportAmount || 0, language)} icon={<DollarSignCircleIcon />} />
                <KpiCard title={t('beneficiaries.kpi.communication')} value={t('beneficiaries.kpi.communication_value', { count: beneficiary.profile.communicationLog?.length || 0 })} icon={<MessagesIcon />} />
                <KpiCard title={t('beneficiaries.kpi.documents')} value={formatNumber(beneficiary.profile.documents?.length || 0, language)} icon={<DocumentTextIcon />} />
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700 pb-2">
                 {tabs.map(tab => <TabButton key={tab.id} id={tab.id} label={tab.label} />)}
            </div>

            <div className="mt-4">
                 {renderTabContent()}
            </div>
            
        </div>
    );
};

export default BeneficiaryDetailView;