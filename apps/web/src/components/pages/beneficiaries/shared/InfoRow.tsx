import React from 'react';

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  muted?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, muted }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
    <div
      className={`mt-1 break-words text-sm font-bold leading-6 ${
        muted ? 'text-gray-400 dark:text-gray-500' : 'text-foreground dark:text-dark-foreground'
      }`}
    >
      {value ?? '—'}
    </div>
  </div>
);

export default InfoRow;
