import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft flex items-center gap-4 border border-gray-200 dark:border-slate-700/50">
    <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary dark:text-secondary rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
    </div>
  </div>
);

export default StatCard;
