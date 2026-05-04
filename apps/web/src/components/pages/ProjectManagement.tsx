import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_PROJECTS } from '../../data/projectData';
import type { Project, Beneficiary } from '../../types';
import ProjectList from './projects/ProjectList';
import CreateProjectWizard from './projects/CreateProjectWizard';
import ProjectDetailView from './projects/ProjectDetailView';
import SDGAlignmentDashboard from './projects/SDGAlignmentDashboard';
import { List, Target, PlusCircle } from 'lucide-react';
interface ProjectManagementProps {
  beneficiaries: Beneficiary[];
  deepLinkTarget?: { id?: string; tab?: string } | null;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ beneficiaries, deepLinkTarget }) => {
    const { t } = useLocalization(['common', 'projects', 'beneficiaries', 'misc']);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedProjectInfo, setSelectedProjectInfo] = useState<{ project: Project; initialTab?: string } | null>(null);
    const [activeView, setActiveView] = useState('list'); // 'list' or 'sdg'

    useEffect(() => {
        if (deepLinkTarget?.id) {
            const projectToSelect = projects.find(p => p.id === deepLinkTarget.id);
            if (projectToSelect) {
                setSelectedProjectInfo({ project: projectToSelect, initialTab: deepLinkTarget.tab });
                // Reset deep link target after handling to prevent re-triggering
                // This would typically be handled by a router or state management library
            }
        }
    }, [deepLinkTarget, projects]);

    const handleCreateProject = (newProjectData: Omit<Project, 'id'>) => {
        const newProject: Project = {
            ...newProjectData,
            id: `PROJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
        } as Project;
        setProjects(prev => [newProject, ...prev]);
        setIsWizardOpen(false);
    };
    
    if (selectedProjectInfo) {
        return <ProjectDetailView 
                    project={selectedProjectInfo.project} 
                    beneficiaries={beneficiaries} 
                    onBack={() => setSelectedProjectInfo(null)}
                    initialTab={selectedProjectInfo.initialTab}
                />;
    }

    const getViewButtonClass = (view: string) => {
        return activeView === view
            ? 'bg-primary text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700';
    }

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                        {t('projects.title')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="p-1 bg-gray-100 dark:bg-dark-card rounded-lg flex items-center space-x-1 rtl:space-x-reverse">
                            <button onClick={() => setActiveView('list')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${getViewButtonClass('list')}`}>
                                <List size={16} />
                                <span>{t('projects.projectList')}</span>
                            </button>
                             <button onClick={() => setActiveView('sdg')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${getViewButtonClass('sdg')}`}>
                                <Target size={16} />
                                <span>{t('sdg_analytics.title')}</span>
                            </button>
                        </div>
                         <button 
                            onClick={() => setIsWizardOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors shadow-sm"
                        >
                            <PlusCircle size={18} />
                            {t('projects.createProject')}
                        </button>
                    </div>
                </div>
                
                {activeView === 'list' && (
                    <ProjectList projects={projects} onProjectSelect={(project) => setSelectedProjectInfo({ project, initialTab: 'overview' })} />
                )}

                {activeView === 'sdg' && (
                    <SDGAlignmentDashboard projects={projects} />
                )}

            </div>

            {isWizardOpen && (
                <CreateProjectWizard 
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                    onCreateProject={handleCreateProject}
                />
            )}
        </>
    );
};

export default ProjectManagement;
