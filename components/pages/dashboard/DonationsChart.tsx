
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MONTHLY_DONATIONS_DATA } from '../../data/mockData';
import { useLocalization } from '../../hooks/useLocalization';
import { formatCurrency } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

/**
 * DonationsChart - مكون يعرض رسمًا بيانيًا للتبرعات الشهرية.
 * 
 * @component
 * @returns {JSX.Element} - مكون React
 * 
 * @example
 * <DonationsChart />
 */
const DonationsChart: React.FC = () => {
  const { language } = useLocalization();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const primaryColor = 'hsl(210, 40%, 50%)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDark ? '#f1f5f9' : '#334155';

  /**
   * CustomTooltip - مكون تلميح مخصص للرسم البياني.
   * 
   * @component
   * @param {object} props - الخصائص.
   * @param {boolean} props.active - هل التلميح نشط.
   * @param {Array<object>} props.payload - بيانات النقطة.
   * @param {string} props.label - تسمية النقطة.
   * @returns {JSX.Element | null}
   */
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg">
          <p className="label font-semibold text-foreground dark:text-dark-foreground">{`${label}`}</p>
          <p className="intro text-primary dark:text-secondary">{`Donations: ${formatCurrency(payload[0].value, language)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={MONTHLY_DONATIONS_DATA}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} />
        <YAxis 
          tickFormatter={(value: unknown) => {
              const numericValue = Number(value);
              if (isNaN(numericValue)) {
                  return String(value);
              }
              return formatCurrency(numericValue, language);
          }} 
          stroke={textColor}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="donations" stroke={primaryColor} fillOpacity={1} fill="url(#colorDonations)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DonationsChart;