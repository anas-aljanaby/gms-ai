import React from 'react';

interface AiCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const AiCard: React.FC<AiCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default AiCard;
