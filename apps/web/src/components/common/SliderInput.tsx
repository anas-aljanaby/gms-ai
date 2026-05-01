import React from 'react';

interface SliderInputProps {
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange }) => {
    
    const getGradient = () => {
        const percentage = (value - 1) / 99 * 100;
        let color = '#22c55e'; // green
        if (value < 75) color = '#f59e0b'; // yellow
        if (value < 50) color = '#ef4444'; // red
        return `linear-gradient(to right, ${color} ${percentage}%, #e5e7eb ${percentage}%)`;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-sm font-bold bg-gray-200 px-2 py-0.5 rounded-md">{value}</span>
            </div>
            <input
                type="range"
                min="1"
                max="100"
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ background: getGradient() }}
            />
        </div>
    );
};

export default SliderInput;
