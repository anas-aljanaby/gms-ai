import React from 'react';
import {
  Calendar,
  CheckSquare,
  CircleHelp,
  Clock,
  FileText,
  TriangleAlert,
} from 'lucide-react';
import { useCountUp } from '../../../hooks/useCountUp';
import { formatNumber } from '../../../lib/utils';
import { useLocalization } from '../../../hooks/useLocalization';

interface PortalStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const PortalStatCard: React.FC<PortalStatCardProps> = ({ title, value, icon, color }) => {
  const animated = useCountUp(value, 1500);
  const { language } = useLocalization();

  return (
    <div className={`p-6 rounded-2xl shadow-md border-t-4 ${color}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full">{icon}</div>
        <div>
          <p className="text-3xl font-bold">{formatNumber(animated, language)}</p>
          <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        </div>
      </div>
    </div>
  );
};

interface ActionItemProps {
  type: string;
  title: string;
  due: string;
  priority: 'high' | 'medium';
}

const ActionItem: React.FC<ActionItemProps> = ({ type, title, due, priority }) => (
  <div
    className={`p-3 rounded-lg border-l-4 ${
      priority === 'high'
        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
        : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    }`}
  >
    <p className="text-xs font-bold text-gray-500">{type}</p>
    <p className="font-semibold text-sm">{title}</p>
    <div className="flex justify-between items-center mt-2">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Clock size={12} /> {due}
      </p>
      <div className="flex gap-2">
        <button type="button" className="text-xs font-semibold px-2 py-1 border rounded-md">
          مراجعة
        </button>
        <button type="button" className="text-xs font-semibold px-2 py-1 border rounded-md">
          نقاش
        </button>
      </div>
    </div>
  </div>
);

interface DocumentRowProps {
  name: string;
  type: string;
  status: 'Pending' | 'Approved';
}

const DocumentRow: React.FC<DocumentRowProps> = ({ name, type, status }) => (
  <tr className="border-b dark:border-slate-700">
    <td className="p-3">
      <p className="font-semibold flex items-center gap-2">
        <FileText size={16} /> {name}
      </p>
      <p className="text-xs text-gray-500 ml-8">{type}</p>
    </td>
    <td className="p-3 text-center">
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {status === 'Pending' ? 'قيد المراجعة' : 'معتمد'}
      </span>
    </td>
  </tr>
);

const PortalTab: React.FC = () => {
  const stats = { underReview: 5, upcomingMeetings: 2, fatwasIssued: 12 };

  const requiredActions: ActionItemProps[] = [
    { type: 'عقد للموافقة', title: 'عقد شراكة مع مؤسسة التنمية', due: 'خلال 3 أيام', priority: 'high' },
    { type: 'اقتراح استثماري للتصويت', title: 'اقتراح استثمار في صندوق الوقف العقاري', due: 'خلال 5 أيام', priority: 'high' },
    { type: 'تعديل سياسة للتوقيع', title: 'تحديث سياسة توزيع الزكاة', due: 'خلال أسبوع', priority: 'medium' },
  ];

  const documents: DocumentRowProps[] = [
    { name: 'Contract C-457', type: 'عقد شراكة', status: 'Pending' },
    { name: 'Investment Proposal IP-089', type: 'اقتراح استثماري', status: 'Pending' },
    { name: 'Zakat Policy 2025 Draft', type: 'سياسة داخلية', status: 'Pending' },
    { name: 'Contract C-456', type: 'عقد شراكة', status: 'Approved' },
  ];

  const fatwas = [
    { id: 'F-124', title: 'حكم الاستثمار في العملات الرقمية', status: 'تمت الإجابة' },
    { id: 'F-125', title: 'ضوابط صرف أموال الزكاة في المشاريع التعليمية', status: 'قيد المراجعة' },
    { id: 'F-126', title: 'حكم التعامل مع البنوك التي تقدم منتجات إسلامية وتقليدية', status: 'تمت الإجابة' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-4 bg-gray-50 dark:bg-dark-background/30 rounded-2xl border dark:border-slate-700/50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-sharia-primary dark:text-sharia-secondary">
          بوابة الهيئة الشرعية
        </h2>
        <p className="text-gray-500">مرحباً بك، د. عبد الله الفهيم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PortalStatCard
          title="قضايا قيد المراجعة"
          value={stats.underReview}
          icon={<FileText />}
          color="border-yellow-500"
        />
        <PortalStatCard
          title="اجتماعات قادمة"
          value={stats.upcomingMeetings}
          icon={<Calendar />}
          color="border-blue-500"
        />
        <PortalStatCard
          title="فتاوى صادرة (هذا العام)"
          value={stats.fatwasIssued}
          icon={<CheckSquare />}
          color="border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card dark:bg-dark-card p-4 rounded-xl shadow-md border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <TriangleAlert className="text-red-500" /> الإجراءات المطلوبة
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requiredActions.map((action, i) => (
              <ActionItem key={i} {...action} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-card dark:bg-dark-card p-4 rounded-xl shadow-md border">
          <h3 className="font-bold mb-4">مستودع المستندات</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="p-2 text-right">المستند</th>
                  <th className="p-2 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, i) => (
                  <DocumentRow key={i} {...doc} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-md border">
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <CircleHelp className="text-purple-500" /> الفتاوى والأسئلة
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase text-right">
                <th className="p-2">رقم الفتوى</th>
                <th className="p-2">الموضوع</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {fatwas.map((fatwa) => (
                <tr key={fatwa.id} className="border-t dark:border-slate-700">
                  <td className="p-3 font-mono">{fatwa.id}</td>
                  <td className="p-3 font-semibold">{fatwa.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        fatwa.status === 'تمت الإجابة'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {fatwa.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                      عرض التفاصيل
                    </button>
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

export default PortalTab;
