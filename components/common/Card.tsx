
import React from 'react';

interface CardProps {
    title: string;
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-bold p-4 border-b dark:border-slate-700">{title}</h3>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default Card;
