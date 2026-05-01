import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';
import type { TourStep } from '../../types';
import { XIcon } from '../icons/GenericIcons';

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    steps: TourStep[];
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, steps }) => {
    const { t, dir } = useLocalization();
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling during tour
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);


    useEffect(() => {
        if (isOpen && currentStep < steps.length) {
            const step = steps[currentStep];
            const element = document.querySelector(step.selector);

            if (element) {
                const rect = element.getBoundingClientRect();

                // NEW: Check if the element is visible. If not, skip this step.
                // This handles cases where elements are hidden by responsive classes (e.g., `hidden md:block`).
                if (rect.width === 0 && rect.height === 0 && rect.top === 0 && rect.left === 0) {
                    handleNext();
                    return; // Skip to the next step
                }

                const PADDING = 10;
                
                setHighlightStyle({
                    width: rect.width + PADDING,
                    height: rect.height + PADDING,
                    top: rect.top - PADDING / 2,
                    left: rect.left - PADDING / 2,
                    transition: 'all 0.4s ease-in-out',
                });
                
                // --- Smart Tooltip Positioning ---
                const TOOLTIP_PADDING = 15;
                const TOOLTIP_WIDTH = 288; // w-72
                const TOOLTIP_HEIGHT = 180; // Approximate height
                const SCREEN_EDGE_PADDING = 16;

                const finalTooltipStyle: React.CSSProperties = {};

                // Vertical positioning: Prefer below, but move above if not enough space.
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                if (spaceBelow > TOOLTIP_HEIGHT + TOOLTIP_PADDING || spaceBelow > spaceAbove) {
                    // Place below
                    finalTooltipStyle.top = rect.bottom + TOOLTIP_PADDING;
                } else {
                    // Place above
                    finalTooltipStyle.top = rect.top - TOOLTIP_HEIGHT - TOOLTIP_PADDING;
                }

                // Clamp vertical position to stay within the viewport
                finalTooltipStyle.top = Math.max(
                    SCREEN_EDGE_PADDING,
                    Math.min(finalTooltipStyle.top, window.innerHeight - TOOLTIP_HEIGHT - SCREEN_EDGE_PADDING)
                );

                // Horizontal positioning: Center and clamp
                let newLeft = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
                newLeft = Math.max(
                    SCREEN_EDGE_PADDING,
                    Math.min(newLeft, window.innerWidth - TOOLTIP_WIDTH - SCREEN_EDGE_PADDING)
                );
                finalTooltipStyle.left = newLeft;
                
                setTooltipStyle(finalTooltipStyle);

            } else {
                // If element not found, skip to next step
                handleNext();
            }
        }
    }, [isOpen, currentStep, steps]);
    
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!isOpen || currentStep >= steps.length) return null;

    const currentStepData = steps[currentStep];
     if (!currentStepData) {
        onClose();
        return null;
    }


    return (
        <div className="fixed inset-0 z-[200]">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70"
            />
            
            {/* Highlight Box */}
            <div 
                className="absolute rounded-lg border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none"
                style={highlightStyle}
            />

            {/* Tooltip */}
            <AnimatePresence>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="fixed w-72 bg-card dark:bg-dark-card rounded-lg shadow-xl"
                    style={tooltipStyle}
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} p-1 bg-black/10 dark:bg-white/10 rounded-full text-foreground dark:text-dark-foreground hover:bg-black/20 dark:hover:bg-white/20 z-10`}
                        aria-label={t('common.close')}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <div className="p-4 pt-8">
                        <h3 className="font-bold text-foreground dark:text-dark-foreground">{t(currentStepData.titleKey)}</h3>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{t(currentStepData.contentKey)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-b-lg flex justify-between items-center">
                        <span className="text-xs font-semibold">{currentStep + 1} / {steps.length}</span>
                        <div className="flex gap-2">
                             <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:underline">{t('onboarding.tour.skip')}</button>
                             {currentStep > 0 && <button onClick={handlePrev} className="px-3 py-1 text-xs font-semibold border rounded-md">{t('onboarding.tour.prev')}</button>}
                             <button onClick={handleNext} className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-md">
                                {currentStep === steps.length - 1 ? t('onboarding.tour.finish') : t('onboarding.tour.next')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default OnboardingTour;