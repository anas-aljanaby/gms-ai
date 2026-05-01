import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  animate?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  color,
  label,
  animate = true,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `progress-gradient-${Math.random().toString(36).substring(2)}`;

  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const animatedPercentage = animate ? useCountUp(clampedPercentage, 1500) : clampedPercentage;
  
  const offset = circumference - (animatedPercentage / 100) * circumference;
  const useGradient = percentage > 80;

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          <defs>
            {useGradient && (
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.5 }} />
              </linearGradient>
            )}
          </defs>
          {/* Background Circle */}
          <circle
            stroke="currentColor"
            className="text-gray-200 dark:text-slate-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={center}
            cy={center}
          />
          {/* Foreground Circle */}
          <circle
            stroke={useGradient ? `url(#${gradientId})` : color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={radius}
            cx={center}
            cy={center}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </g>
        
        {/* Text in the middle */}
        <text
            x={center}
            y={center - (size * 0.05)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size / 4.16}
            fontWeight="bold"
            className="fill-current text-foreground dark:text-dark-foreground"
        >
            {`${Math.round(animatedPercentage)}%`}
        </text>
        <text
            x={center}
            y={center + (size * 0.15)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size / 8.33}
            fill="#6b7280"
            className="dark:fill-gray-400"
        >
            {label}
        </text>
      </svg>
    </div>
  );
};

export default ProgressRing;
