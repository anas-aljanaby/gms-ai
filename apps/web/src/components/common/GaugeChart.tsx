import React, { useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

// Props definition
interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  size?: number;
  animate?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  size = 200,
  animate = true,
}) => {
  const [rotation, setRotation] = useState(-90);
  const animatedValue = useCountUp(value, animate ? 1500 : 0);

  const zones = [
    { from: 0, to: 40, color: 'hsl(0, 72%, 51%)' }, // Red
    { from: 40, to: 70, color: 'hsl(48, 100%, 50%)' }, // Yellow
    { from: 70, to: 100, color: 'hsl(145, 63%, 42%)' }, // Green
  ];

  const width = size;
  const height = size / 2 + 20; // Extra space for labels
  const cx = width / 2;
  const cy = height - 20;
  const radius = size / 2 - 20;
  const strokeWidth = 15;

  const valueToAngle = (val: number) => {
    const range = max - min;
    const percentage = (val - min) / range;
    return percentage * 180 - 90;
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setRotation(valueToAngle(value));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setRotation(valueToAngle(value));
    }
  }, [value, min, max, animate]);

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const needleTransition = animate ? 'transform 1.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)' : 'none';

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Arc */}
        <path
          d={describeArc(cx, cy, radius, -90, 90)}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
        />
        {/* Zone Arcs */}
        {zones.map((zone, i) => (
          <path
            key={i}
            d={describeArc(cx, cy, radius, valueToAngle(zone.from), valueToAngle(zone.to))}
            fill="none"
            stroke={zone.color}
            strokeWidth={strokeWidth}
          />
        ))}
        {/* Ticks */}
        {[0, 20, 40, 60, 80, 100].map(tickValue => {
          const angle = valueToAngle(tickValue);
          const start = polarToCartesian(cx, cy, radius - strokeWidth/2 - 2, angle);
          const end = polarToCartesian(cx, cy, radius + strokeWidth/2 + 2, angle);
          return <line key={tickValue} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="currentColor" className="text-card dark:text-dark-card" strokeWidth="2" />
        })}
        {/* Needle */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: needleTransition }}>
          <polygon points={`${cx},${cy - 5} ${cx},${cy + 5} ${cx - radius + 5},${cy}`} fill="currentColor" className="text-foreground dark:text-dark-foreground" />
          <circle cx={cx} cy={cy} r="8" fill="currentColor" className="text-foreground dark:text-dark-foreground" />
          <circle cx={cx} cy={cy} r="4" fill="currentColor" className="text-card dark:text-dark-card" />
        </g>
        {/* Value Text */}
        <text x={cx} y={cy - 20} textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-current text-foreground dark:text-dark-foreground">
          {Math.round(animatedValue)}%
        </text>
        {/* Min/Max Labels */}
        <text x={cx - radius - 10} y={cy + 10} textAnchor="middle" className="text-xs fill-current text-gray-500">{min}</text>
        <text x={cx + radius + 10} y={cy + 10} textAnchor="middle" className="text-xs fill-current text-gray-500">{max}</text>
      </svg>
      <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
};

export default GaugeChart;
