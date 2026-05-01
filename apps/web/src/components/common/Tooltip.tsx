import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, align = 'center' }) => {
    const alignClass = {
        left: 'tooltip-text-align-left',
        right: 'tooltip-text-align-right',
        center: ''
    }[align];

    return (
        <div className="tooltip">
            {children}
            <span className={`tooltip-text ${alignClass}`}>{text}</span>
        </div>
    );
};

export default Tooltip;