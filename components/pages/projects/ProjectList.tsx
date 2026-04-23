
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Project } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import EmptyState from '../../common/EmptyState';
import ProjectListControls from './ProjectListControls';
import AdvancedFiltersPanel from './AdvancedFiltersPanel';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect }) => {
    const { t, language } = useLocalization();
    const [view, setView] = useState<'list' | 'card' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return projects.filter(p => 
            (p.name[language] || p.name.en)?.toLowerCase().includes(lowerCaseSearch) ||
            p.id.toLowerCase().includes(lowerCaseSearch)
        );
    }, [projects, searchTerm, language]);

    const renderListView = () => (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-dark-card/50">
                        <tr>
                            <th className="p-4">{t('projects.list.name')}</th>
                            <th className="p-4">{t('projects.list.stage')}</th>
                            <th className="p-4">{t('projects.list.progress')}</th>
                            <th className="p-4 text-end">{t('projects.list.budget')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map(project => (
                            <tr key={project.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => onProjectSelect(project)}>
                                <td className="p-4 font-semibold text-foreground dark:text-dark-foreground">
                                    <p className="font-bold">{project.name[language] || project.name.en}</p>
                                    <p className="text-xs text-gray-400">{project.id}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`}>
                                        {t(`projects.stages.${project.stage}`)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <p className="text-xs text-end mt-1">{project.progress}%</p>
                                </td>
                                <td className="p-4 text-end font-semibold">{formatCurrency(project.budget, language)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderCardView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onSelect={() => onProjectSelect(project)} />
            ))}
        </div>
    );

    return (
        <div className="space-y-4">
            <ProjectListControls
                view={view}
                onViewChange={setView}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFiltersToggle={() => setIsFiltersOpen(prev => !prev)}
            />
            <AdvancedFiltersPanel isOpen={isFiltersOpen} />
            
            {filteredProjects.length > 0 ? (
                <>
                    {view === 'list' && renderListView()}
                    {view === 'card' && renderCardView()}
                    {view === 'map' && (
                        <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-gray-500">{t('placeholder.underConstruction', { moduleName: 'Map View' })}</p>
                        </div>
                    )}
                </>
            ) : (
                <EmptyState type="NoResults" />
            )}
        </div>
    );
};

export default ProjectList;
