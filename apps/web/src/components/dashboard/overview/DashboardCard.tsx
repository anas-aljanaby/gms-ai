import React from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
  children: React.ReactNode;
}

/**
 * DashboardCard - بطاقة موحدة لعناصر لوحة القيادة مع عنوان وإجراء اختياري.
 */
const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, action, className = '', children }) => (
  <section className={`bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-bold text-foreground dark:text-dark-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
    {children}
  </section>
);

export default DashboardCard;
