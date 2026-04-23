import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Stakeholder } from '../../../types';

interface StakeholderMatrixProps {
    stakeholders: Stakeholder[];
    onSelect: (stakeholder: Stakeholder) => void;
}

const Quadrant: React.FC<{ title: string; description: string; children: React.ReactNode; className?: string }> = ({ title, description, children, className }) => (
    <div className={`relative p-4 border dark:border-slate-700 ${className}`}>
        <h3 className="font-bold text-sm text-foreground dark:text-dark-foreground">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
        {children}
    </div>
);

const StakeholderDot: React.FC<{ stakeholder: Stakeholder; onSelect: () => void; quadrant: 'monitor' | 'keepInformed' | 'keepSatisfied' | 'manageClosely'; language: 'en' | 'ar' }> = ({ stakeholder, onSelect, quadrant, language }) => {
    let x, y;
    switch (quadrant) {
        case 'monitor': // low power, low interest
            x = (stakeholder.interest / 50) * 100;
            y = (stakeholder.power / 50) * 100;
            break;
        case 'keepInformed': // low power, high interest
            x = ((stakeholder.interest - 50) / 50) * 100;
            y = (stakeholder.power / 50) * 100;
            break;
        case 'keepSatisfied': // high power, low interest
            x = (stakeholder.interest / 50) * 100;
            y = ((stakeholder.power - 50) / 50) * 100;
            break;
        case 'manageClosely': // high power, high interest
            x = ((stakeholder.interest - 50) / 50) * 100;
            y = ((stakeholder.power - 50) / 50) * 100;
            break;
    }

    const healthColor = stakeholder.healthScore > 80 ? 'bg-green-500' : stakeholder.healthScore > 60 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onSelect}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
                left: `${x}%`,
                bottom: `${y}%`,
            }}
        >
            <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-dark-card ${healthColor} transition-transform group-hover:scale-150`}></div>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {stakeholder.name[language] || stakeholder.name.en}
            </div>
        </motion.div>
    );
};

const StakeholderMatrix: React.FC<StakeholderMatrixProps> = ({ stakeholders, onSelect }) => {
    const { t, language } = useLocalization();

    const quadrants = useMemo(() => {
        return {
            monitor: stakeholders.filter(s => s.power <= 50 && s.interest <= 50),
            keepInformed: stakeholders.filter(s => s.power <= 50 && s.interest > 50),
            keepSatisfied: stakeholders.filter(s => s.power > 50 && s.interest <= 50),
            manageClosely: stakeholders.filter(s => s.power > 50 && s.interest > 50),
        };
    }, [stakeholders]);

    return (
        <div className="bg-card dark:bg-dark-card rounded-xl shadow-soft p-6">
            <div className="grid grid-cols-[auto,1fr,auto] grid-rows-[auto,1fr,auto] gap-2 h-[600px]">
                {/* Y-Axis High */}
                <div className="flex items-start justify-center"><span className="text-sm font-semibold">{t('stakeholder_management.matrix.high')}</span></div>
                <div></div>
                <div></div>

                {/* Y-Axis Label */}
                <div className="flex items-center justify-center -rotate-90 row-span-1">
                    <span className="font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('stakeholder_management.matrix.power')}</span>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-2 grid-rows-2 border dark:border-slate-600">
                    <Quadrant title={t('stakeholder_management.matrix.keepSatisfied')} description={t('stakeholder_management.matrix.keepSatisfiedDesc')} className="border-b dark:border-slate-600 border-r dark:border-slate-600">
                        {quadrants.keepSatisfied.map(s => <StakeholderDot key={s.id} stakeholder={s} onSelect={() => onSelect(s)} quadrant="keepSatisfied" language={language} />)}
                    </Quadrant>
                    <Quadrant title={t('stakeholder_management.matrix.manageClosely')} description={t('stakeholder_management.matrix.manageCloselyDesc')} className="border-b dark:border-slate-600">
                         {quadrants.manageClosely.map(s => <StakeholderDot key={s.id} stakeholder={s} onSelect={() => onSelect(s)} quadrant="manageClosely" language={language} />)}
                    </Quadrant>
                    <Quadrant title={t('stakeholder_management.matrix.monitor')} description={t('stakeholder_management.matrix.monitorDesc')} className="border-r dark:border-slate-600">
                         {quadrants.monitor.map(s => <StakeholderDot key={s.id} stakeholder={s} onSelect={() => onSelect(s)} quadrant="monitor" language={language} />)}
                    </Quadrant>
                    <Quadrant title={t('stakeholder_management.matrix.keepInformed')} description={t('stakeholder_management.matrix.keepInformedDesc')}>
                         {quadrants.keepInformed.map(s => <StakeholderDot key={s.id} stakeholder={s} onSelect={() => onSelect(s)} quadrant="keepInformed" language={language} />)}
                    </Quadrant>
                </div>
                
                <div></div>
                
                {/* Y-Axis Low */}
                <div className="flex items-end justify-center"><span className="text-sm font-semibold">{t('stakeholder_management.matrix.low')}</span></div>
                
                {/* X-Axis Label */}
                <div className="text-center font-bold text-gray-600 dark:text-gray-400 pt-2">{t('stakeholder_management.matrix.interest')}</div>
                <div></div>
            </div>
            <div className="flex justify-between px-10 text-sm font-semibold text-gray-500">
                <span>{t('stakeholder_management.matrix.low')}</span>
                <span>{t('stakeholder_management.matrix.high')}</span>
            </div>
        </div>
    );
};

export default StakeholderMatrix;
