import React from 'react';

interface ToggleSwitchProps {
    label: string;
    name: string;
    isChecked: boolean;
    onToggle: (name: string, checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, name, isChecked, onToggle }) => {
    return (
        <label htmlFor={name} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onToggle(name, e.target.checked)}
                    className="sr-only"
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${isChecked ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;
