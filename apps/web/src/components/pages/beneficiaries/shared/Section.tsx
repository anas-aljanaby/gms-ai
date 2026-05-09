import React from 'react';
import { Pencil } from 'lucide-react';

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  accent?: string;
  onEdit?: () => void;
  editLabel?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  accent = 'bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary',
  onEdit,
  editLabel,
  children,
}) => (
  <section className="min-w-0 rounded-xl border border-gray-200/80 bg-card p-5 shadow-sm dark:border-slate-700/70 dark:bg-dark-card">
    <div className="mb-4 flex min-w-0 items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${accent}`}>
            {icon}
          </div>
        )}
        <h3 className="truncate text-base font-bold text-foreground dark:text-dark-foreground">{title}</h3>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-dark-foreground"
          aria-label={editLabel}
          title={editLabel}
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
    {children}
  </section>
);

export default Section;
