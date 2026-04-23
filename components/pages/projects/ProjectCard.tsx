import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Project } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
    const { t, language } = useLocalization();
    
    const stageColors: Record<string, string> = {
        design: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        implementation: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        monitoring: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        closure: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelect(project)}
            className="bg-card dark:bg-dark-card rounded-2xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 flex flex-col cursor-pointer border dark:border-slate-700/50"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground mb-2 flex-grow pr-4">{project.name[language] || project.name.en}</h3>
                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${stageColors[project.stage] || 'bg-gray-100'}`}>
                    {t(`projects.stages.${project.stage}`)}
                </span>
            </div>
            
            <p className="text-xs text-gray-400 font-mono mb-4">{project.id}</p>

            <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">{t('projects.list.budget')}</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(project.budget, language)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">{t('projects.list.spent')}</span>
                    <span className="font-bold text-orange-500">{formatCurrency(project.spent, language)}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-slate-700">
                <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium">{t('projects.list.progress')}</span>
                    <span className="font-bold text-primary dark:text-secondary">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                    <div className="bg-primary dark:bg-secondary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
