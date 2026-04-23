import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';
import { formatNumber } from '../../lib/utils';

interface FunnelData {
  stage: Record<string, string>;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelData[];
  onClick?: (stage: FunnelData) => void;
  height?: number;
  showPercentages?: boolean;
}

const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  onClick,
  height = 400,
  showPercentages = true,
}) => {
  const { language } = useLocalization();
  const [hoveredStage, setHoveredStage] = useState<any | null>(null);

  const colors = [
    'hsl(210, 40%, 50%)',
    'hsl(195, 40%, 50%)',
    'hsl(180, 40%, 50%)',
    'hsl(165, 40%, 50%)',
    'hsl(150, 40%, 50%)',
    'hsl(135, 40%, 50%)',
  ];

  const processedData = useMemo(() => {
    if (data.length === 0) return [];
    const maxValue = Math.max(...data.map(d => d.value));
    const width = 600;
    const chartHeight = height - 40;
    const stageHeight = chartHeight / data.length;

    return data.map((item, i) => {
      const topValue = i === 0 ? data[0].value : data[i - 1].value;
      const bottomValue = item.value;
      
      const topWidth = (topValue / maxValue) * (width * 0.6);
      const bottomWidth = (bottomValue / maxValue) * (width * 0.6);

      const y = 20 + i * stageHeight;

      const p1 = { x: (width - topWidth) / 2, y };
      const p2 = { x: p1.x + topWidth, y };
      const p3 = { x: (width + bottomWidth) / 2, y: y + stageHeight };
      const p4 = { x: (width - bottomWidth) / 2, y: y + stageHeight };

      const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;
      
      const conversionRate = i > 0 && data[i-1].value > 0 ? (item.value / data[i-1].value) * 100 : null;

      return {
        ...item,
        points,
        y,
        stageHeight,
        width,
        conversionRate,
        color: item.color || colors[i % colors.length],
      };
    });
  }, [data, height]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  };

  return (
    <motion.svg
      viewBox={`0 0 600 ${height}`}
      width="100%"
      height={height}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {processedData.map((item, i) => (
        <motion.g
          key={item.stage.en}
          variants={itemVariants}
          onMouseEnter={() => setHoveredStage(item)}
          onMouseLeave={() => setHoveredStage(null)}
          onClick={() => onClick && onClick(item)}
          className="cursor-pointer"
        >
          <motion.polygon
            points={item.points}
            fill={item.color}
            animate={{ opacity: hoveredStage === item ? 0.8 : 1 }}
          />
          <text
            x={item.width / 2}
            y={item.y + item.stageHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold text-lg fill-white pointer-events-none"
          >
            {item.stage[language] || item.stage.en}
          </text>
          <text
            x={item.width / 2}
            y={item.y + item.stageHeight / 2 + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-white/80 pointer-events-none"
          >
            {formatNumber(item.value, language)}
          </text>
          
          {showPercentages && item.conversionRate !== null && (
             <text
                x={item.width / 2}
                y={item.y - 12}
                textAnchor="middle"
                className="text-sm font-semibold fill-current text-green-600 dark:text-green-400"
              >
                ▼ {item.conversionRate.toFixed(1)}%
              </text>
          )}
        </motion.g>
      ))}
      <AnimatePresence>
        {hoveredStage && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none"
          >
            <rect
              x={(hoveredStage.width / 2) + 10}
              y={hoveredStage.y + hoveredStage.stageHeight / 2 - 20}
              width="130"
              height="40"
              rx="5"
              className="fill-current text-gray-800 dark:text-gray-900 opacity-80"
            />
            <text
              x={(hoveredStage.width / 2) + 75}
              y={hoveredStage.y + hoveredStage.stageHeight / 2 - 5}
              textAnchor="middle"
              className="fill-white text-xs"
            >
              <tspan x={(hoveredStage.width / 2) + 75} dy="-0.6em">Value: {formatNumber(hoveredStage.value, language)}</tspan>
              {hoveredStage.conversionRate && <tspan x={(hoveredStage.width / 2) + 75} dy="1.2em">Conv: {hoveredStage.conversionRate.toFixed(1)}%</tspan>}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </motion.svg>
  );
};

export default FunnelChart;
