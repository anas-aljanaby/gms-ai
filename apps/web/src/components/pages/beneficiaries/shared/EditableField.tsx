import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: 'ltr' | 'rtl';
  required?: boolean;
  error?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, type = 'text', dir, required = false, error }) => (
  <label className="block min-w-0">
    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
    <input
      type={type}
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm font-semibold outline-none transition-colors focus:ring-1 dark:bg-slate-900 dark:text-dark-foreground ${
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70 dark:focus:border-red-400'
          : 'border-gray-300 focus:border-primary focus:ring-primary/30 dark:border-slate-600'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </label>
);

export default EditableField;
