



import React, { useMemo } from 'react';
import type { Beneficiary, BeneficiaryType } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useCountUp } from '../../../hooks/useCountUp';
import { formatNumber, formatCurrency } from '../../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Map, Users, DollarSign } from 'lucide-react';

interface BeneficiaryStatsProps {
  beneficiaries: Beneficiary[];
}

const KpiCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft h-full ${className || ''}`}>
      <div className="flex justify-center items-center gap-2 mb-4">
        <div className="text-gray-400">{icon}</div>
        <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground text-center">{title}</h3>
      </div>
      {children}
    </div>
  );
};


export const BeneficiaryStats: React.FC<BeneficiaryStatsProps> = ({ beneficiaries }) => {
  const { language } = useLocalization();

  const stats = useMemo(() => {
    const total = beneficiaries.length;
    
    const byCountry = beneficiaries.reduce((acc, b) => {
        acc[b.country] = (acc[b.country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const byType = beneficiaries.reduce((acc, b) => {
        acc[b.beneficiaryType] = (acc[b.beneficiaryType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalAidThisMonth = beneficiaries.reduce((sum, b) => {
        const aidSum = (b.profile?.aidLog || []).reduce((aidSubSum, aid) => {
            if (aid.type === 'financial' && aid.value) {
                const aidDate = new Date(aid.date);
                if (aidDate.getMonth() === currentMonth && aidDate.getFullYear() === currentYear) {
                    return aidSubSum + aid.value;
                }
            }
            return aidSubSum;
        }, 0);
        return sum + aidSum;
    }, 0);

    return { total, byCountry, byType, totalAidThisMonth };
  }, [beneficiaries]);
  
  const animatedTotal = useCountUp(stats.total);
  const animatedAid = useCountUp(stats.totalAidThisMonth);

  const typeTranslations: Record<string, string> = {
    student: 'طلاب',
    family: 'أسر',
    orphan: 'أيتام',
    hafiz: 'حفاظ',
    institution: 'مؤسسات',
    community: 'مجتمعات',
    'individual-other': 'أفراد آخرون',
  };

  const pieData = Object.entries(stats.byType).map(([name, value]) => ({ name: typeTranslations[name] || name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
      {/* Large Card */}
      <div className="lg:col-span-2">
        <KpiCard title="إجمالي عدد المستفيدين" icon={<Users size={20} />} className="relative overflow-hidden">
            <Users size={200} className="absolute -right-8 -bottom-8 text-gray-50 dark:text-gray-800/30 opacity-60" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[300px]">
                {pieData.length > 0 ? (
                    <div className="relative w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                >
                                    {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: unknown, name) => {
                                    const numericValue = Number(value);
                                    if (isNaN(numericValue)) {
                                        return [String(value), name as string];
                                    }
                                    return [formatNumber(numericValue, language), name as string];
                                }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-6xl font-bold text-foreground dark:text-dark-foreground">{formatNumber(animatedTotal, language)}</span>
                            <span className="text-sm text-gray-500 dark:text-dark-foreground mt-1">مستفيد</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">لا توجد بيانات لعرضها</div>
                )}
            </div>
        </KpiCard>
      </div>

      {/* Small Cards Column */}
      <div className="lg:col-span-1 space-y-6">
        <KpiCard title="التوزيع الجغرافي" icon={<Map size={20} />}>
          <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(stats.byCountry).map(([country, count]) => (
                  <div key={country} className="bg-gray-100 dark:bg-slate-700/50 p-2 rounded-lg text-center">
                    {/* FIX: Cast `count` to a number before passing it to `formatNumber` to resolve a TypeScript error where `count` was inferred as `unknown`. */}
                    <p className="font-bold">{formatNumber(Number(count), language)}</p>
                    <p className="text-xs text-gray-500">{country}</p>
                  </div>
              ))}
          </div>
        </KpiCard>
        <KpiCard title="إجمالي المساعدات هذا الشهر" icon={<DollarSign size={20} />}>
            <p className="text-3xl font-bold text-green-600 text-center">{formatCurrency(animatedAid, language)}</p>
        </KpiCard>
      </div>
    </div>
  );
};