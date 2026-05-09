import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, type = 'text' }) => (
  <label className="block min-w-0">
    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
    />
  </label>
);

export default EditableField;
