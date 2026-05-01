import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { MOCK_ORPHAN_DATA } from '../../../data/orphanData';
import { motion } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { useToast } from '../../../hooks/useToast';
import { ArrowLeft, Edit, FileText, Bot, Calendar, Users, Home, Heart, BookOpen, Brain, CreditCard, ArrowUp, ArrowDown, Gift, ShoppingBag, PlusCircle, X as XIcon, ChevronDown, ChevronUp } from 'lucide-react';
import Spinner from '../../common/Spinner';

const OrphanProfile: React.FC<{ orphanId: string; onBack: () => void }> = ({ orphanId, onBack }) => {
    const orphan = MOCK_ORPHAN_DATA.find(o => o.id === orphanId);
    const [isAiSummaryModalOpen, setAiSummaryModalOpen] = useState(false);
    const [isAiNeedsModalOpen, setAiNeedsModalOpen] = useState(false);
    const [aiContent, setAiContent] = useState('');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    const handleGenerateSummary = async () => {
        if (!orphan) return;
        setAiSummaryModalOpen(true);
        setIsGeneratingAi(true);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the following data for the orphan ${orphan.name}, generate a quick, concise summary in Arabic of their current status and provide one key recommendation. Data: Academic Level: ${orphan.profile.academicInfo.level}, Last achievement: ${orphan.profile.achievements?.[0]?.title}, Financial status: ${orphan.profile.financial.payments.filter((p: any)=>p.status === 'overdue').length} overdue payments.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiContent(response.text);
        } catch (e) {
            setAiContent("تعذر إنشاء الملخص حالياً.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleGenerateNeedsReport = async () => {
        if (!orphan) return;
        setAiNeedsModalOpen(true);
        setIsGeneratingAi(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the following comprehensive data for the orphan ${orphan.name}, generate a detailed needs assessment report in Arabic. Identify strengths, areas requiring support (academic, psychological, material), and propose a clear action plan. Data: ${JSON.stringify(orphan.profile)}`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiContent(response.text);
        } catch (e) {
            setAiContent("تعذر إنشاء التقرير حالياً.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    if (!orphan) {
        return <div>Orphan not found. <button onClick={onBack}>Go Back</button></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-dark-background space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={orphan.photo} alt={orphan.name} className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-foreground">{orphan.name}</h1>
                        <p className="text-gray-500">{orphan.profile.age} سنة | {orphan.profile.city}, {orphan.country}</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                     <button onClick={handleGenerateSummary} className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"><Bot size={16}/> موجز سريع</button>
                    <button onClick={handleGenerateNeedsReport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"><Bot size={16}/> تقرير احتياجات</button>
                    <button className="px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100">تصدير PDF</button>
                    <button onClick={onBack} className="px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100">رجوع</button>
                </div>
            </div>

            {/* Grid of Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard icon={<Users />} title="البيانات الشخصية" data={{'تاريخ الميلاد': orphan.profile.personalInfo.dob, 'الجنس': orphan.profile.personalInfo.gender, 'الحالة الصحية': orphan.profile.personalInfo.healthStatus, 'القائم بالرعاية': orphan.profile.personalInfo.guardian}} />
                <InfoCard icon={<BookOpen />} title="البيانات الدراسية" data={{'الصف': orphan.profile.academicInfo.grade, 'الانتظام': orphan.profile.academicInfo.attendance, 'المستوى': orphan.profile.academicInfo.level}} />
                <InfoCard icon={<Home />} title="الحالة الاجتماعية" data={{'وضع الأسرة': orphan.profile.socialInfo.familySituation, 'حالة السكن': orphan.profile.socialInfo.housingStatus}} />
                <InfoCard icon={<Heart />} title="الكفالة والمتابعة" data={{'الكافل': orphan.profile.sponsor.name, 'المسؤول': orphan.profile.caseManager.name, 'نوع الكفالة': orphan.profile.sponsorshipType}} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SocialCard info={orphan.profile.socialInfo} />
                    <ProgramsCard programs={orphan.profile.programs} />
                    <FinancialLog log={orphan.profile.financial.log} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <PaymentsSummary payments={orphan.profile.financial.payments} />
                    <InteractiveCalendar events={orphan.profile.calendarEvents} />
                    <UpdatesLog updates={orphan.profile.updates} achievements={orphan.profile.achievements} />
                </div>
            </div>
            
             <MobileActionBar onSummary={handleGenerateSummary} onNeeds={handleGenerateNeedsReport} onBack={onBack} />

            <AiModal isOpen={isAiSummaryModalOpen} onClose={() => setAiSummaryModalOpen(false)} title="موجز سريع بالذكاء الاصطناعي" content={aiContent} isLoading={isGeneratingAi} />
            <AiModal isOpen={isAiNeedsModalOpen} onClose={() => setAiNeedsModalOpen(false)} title="تقرير تقييم الاحتياجات" content={aiContent} isLoading={isGeneratingAi} />
        </div>
    );
};

// Sub-components defined within the same file for simplicity

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; data: Record<string, string> }> = ({ icon, title, data }) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="font-bold flex items-center gap-2 mb-2"><span className="text-primary">{icon}</span> {title}</h3>
        <dl className="text-sm space-y-1">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <dt className="text-gray-500">{key}:</dt>
                    <dd className="font-semibold text-gray-800 dark:text-dark-foreground">{value}</dd>
                </div>
            ))}
        </dl>
    </div>
);

const SocialCard: React.FC<{info: any}> = ({info}) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="font-bold mb-3">البيانات الاجتماعية والشخصية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <h4 className="font-semibold text-sm mb-2">أفراد الأسرة</h4>
                <ul className="text-sm space-y-1">
                    {info.familyMembers.map((m: any) => <li key={m.name}>{m.relation}: {m.name} ({m.age} سنة)</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-2">الهوايات</h4>
                <div className="flex flex-wrap gap-2">
                    {info.hobbies.map((h: string) => <span key={h} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{h}</span>)}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-2">الاحتياجات والأمنيات</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                    {info.needsAndWishes.map((n: string) => <li key={n}>{n}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

const ProgramsCard: React.FC<{programs: any}> = ({programs}) => {
    const Status: React.FC<{status: string}> = ({status}) => {
        const color = status === 'ملتحق' ? 'text-green-600' : status === 'مكتمل' ? 'text-blue-600' : 'text-yellow-600';
        return <span className={`font-semibold ${color}`}>{status}</span>
    }
    return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="font-bold mb-3">برامجنا</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg"><h4 className="font-semibold text-sm">البرنامج التربوي</h4><Status status={programs.educational.status} /></div>
            <div className="p-3 bg-gray-50 rounded-lg"><h4 className="font-semibold text-sm">الدعم النفسي (للطفل)</h4><Status status={programs.psychologicalChild.status} /></div>
            <div className="p-3 bg-gray-50 rounded-lg"><h4 className="font-semibold text-sm">الدعم النفسي (للقائم بالرعاية)</h4><Status status={programs.psychologicalGuardian.status} /></div>
        </div>
    </div>
)};

const PaymentsSummary: React.FC<{payments: any[]}> = ({payments}) => {
    const statusColor = { paid: 'bg-green-500', due: 'bg-yellow-400', overdue: 'bg-red-500'};
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return (
         <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
            <h3 className="font-bold mb-3">ملخص الدفعات السنوي</h3>
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {payments.map((p: any) => (
                    <div key={p.month} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${statusColor[p.status as keyof typeof statusColor]}`} title={`${months[p.month-1]}: ${p.status}`}></div>
                        <span className="mt-1 text-gray-500">{months[p.month-1]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FinancialLog: React.FC<{log: any[]}> = ({log}) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="font-bold mb-3">السجل المالي</h3>
        <ul className="space-y-2">
            {log.map((item, i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        {item.type === 'income' ? <ArrowUp className="w-5 h-5 text-green-500"/> : <ArrowDown className="w-5 h-5 text-red-500"/>}
                        <div>
                            <p className="font-semibold text-sm">{item.description}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                    </div>
                    <p className={`font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{item.amount} $</p>
                </li>
            ))}
        </ul>
    </div>
);

const InteractiveCalendar: React.FC<{events: any[]}> = ({events}) => {
    return (
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
            <h3 className="font-bold mb-3">الرزنامة</h3>
            <div className="text-center text-gray-400 p-8">تقويم تفاعلي قيد التطوير...</div>
        </div>
    );
};
const UpdatesLog: React.FC<{updates: any[], achievements: any[]}> = ({updates, achievements}) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="font-bold mb-3">سجل التحديثات والإنجازات</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-sm mb-2">التحديثات</h4>
                <ul className="text-sm space-y-2">
                    {updates.map((u, i) => <li key={i} className="p-2 bg-gray-50 rounded-md"><strong>{u.author}:</strong> {u.note}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-sm mb-2">الإنجازات</h4>
                <ul className="text-sm space-y-2">
                     {achievements.map((a, i) => <li key={i} className="p-2 bg-green-50 rounded-md">🏆 <strong>{a.title}</strong></li>)}
                </ul>
            </div>
        </div>
    </div>
);

const AiModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; content: string; isLoading: boolean }> = ({ isOpen, onClose, title, content, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl m-4 p-6" onClick={e => e.stopPropagation()}>
                <h2 className="font-bold text-xl mb-4">{title}</h2>
                {isLoading ? <Spinner text="جاري الإنشاء..." /> : <div className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{content}</div>}
            </div>
        </div>
    );
};

const MobileActionBar: React.FC<{onSummary:()=>void, onNeeds:()=>void, onBack:()=>void}> = ({onSummary, onNeeds, onBack}) => (
    <div className="md:hidden fixed bottom-[64px] left-0 right-0 bg-white/80 backdrop-blur-sm shadow-t-lg p-2 flex justify-around items-center border-t">
        <button onClick={onBack} className="flex flex-col items-center text-xs text-gray-600"><ArrowLeft/> رجوع</button>
        <button className="flex flex-col items-center text-xs text-gray-600"><FileText/> تصدير</button>
        <button onClick={onSummary} className="flex flex-col items-center text-xs text-blue-600 font-bold"><Bot/> موجز</button>
        <button onClick={onNeeds} className="flex flex-col items-center text-xs text-blue-600 font-bold"><Bot/> تقرير</button>
        <button className="flex flex-col items-center text-xs text-gray-600"><Edit/> تعديل</button>
    </div>
);

export default OrphanProfile;
