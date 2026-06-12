import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GrcRisk } from '../../../types';
import { getRiskLevelCardStyles } from './utils';

interface CommonRiskCardProps {
  risk: GrcRisk;
}

const CommonRiskCard: React.FC<CommonRiskCardProps> = ({ risk }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { text, bg, border } = getRiskLevelCardStyles(risk.level);

  return (
    <motion.div layout className={`p-4 rounded-lg border-l-4 ${border} ${bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {risk.category}
          </p>
          <h4 className="font-bold text-md text-foreground dark:text-dark-foreground">{risk.risk}</h4>
        </div>
        <div className={`px-3 py-1 text-sm font-bold rounded-full ${bg} ${text}`}>{risk.score}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
        <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
          <p className="font-semibold text-gray-500 dark:text-gray-400">الأثر</p>
          <p className="font-bold text-lg text-foreground dark:text-dark-foreground">{risk.impact}</p>
        </div>
        <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
          <p className="font-semibold text-gray-500 dark:text-gray-400">الاحتمالية</p>
          <p className="font-bold text-lg text-foreground dark:text-dark-foreground">{risk.probability}</p>
        </div>
        <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
          <p className="font-semibold text-gray-500 dark:text-gray-400">المستوى</p>
          <p className={`font-bold text-sm ${text}`}>{risk.level}</p>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-semibold py-2 text-foreground dark:text-dark-foreground"
        >
          <span>التدابير الوقائية</span>
          <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="list-disc list-inside mt-1 p-3 bg-white/50 dark:bg-black/20 rounded text-sm space-y-1 text-foreground dark:text-dark-foreground">
                {risk.mitigation.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommonRiskCard;
