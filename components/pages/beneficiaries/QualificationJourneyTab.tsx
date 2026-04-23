import React from 'react';
import type { Beneficiary, Event, StudentProject } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useLeadershipData } from '../../../hooks/useLeadershipData';
import { PROJECT_CATEGORIES } from '../../../constants';
import { PlusCircle } from 'lucide-react';

const QualificationJourneyTab: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { t, language } = useLocalization();
    const { leadershipData } = useLeadershipData();

    // Qualification Programs Progress
    const programProgress = beneficiary.profile.qualificationPrograms.map(prog => {
        const unit = leadershipData.units.find(u => u.id === prog.programId);
        if (!unit) return { ...prog, completion: 0 };
        
        const allEvents = unit.stages.flatMap(s => s.events);
        const completableEvents = allEvents.filter(e => e.status !== 'cancelled').length;
        const completedEvents = allEvents.filter(e => e.status === 'completed').length;
        const completion = completableEvents > 0 ? Math.round((completedEvents / completableEvents) * 100) : 0;
        
        return { ...prog, completion };
    });

    // Associated Student Projects
    const associatedProjects = beneficiary.profile.communityInitiatives.map(ci => {
        return leadershipData.studentProjects.find(p => p.id === ci.initiativeId);
    }).filter((p): p is StudentProject => p !== undefined);
    
    const CategoryInfo: React.FC<{ category: StudentProject['category'] }> = ({ category }) => {
      const info = PROJECT_CATEGORIES.find(c => c.id === category);
      if (!info) return null;
      const Icon = info.icon;
      return (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Icon />
              <span>{t(`leadership.projects.categories.${category}`)}</span>
          </div>
      );
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-4">{t('qualificationJourney.programsTitle')}</h3>
                <div className="space-y-4">
                    {programProgress.map(prog => (
                        <div key={prog.programId} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{prog.name[language]}</h4>
                                <span className="text-sm font-bold text-primary dark:text-secondary">{prog.completion}% {t('qualificationJourney.completion')}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${prog.completion}%` }}></div>
                            </div>
                            <div className="flex justify-start mt-2">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary dark:hover:text-secondary-light">
                                    <PlusCircle size={14} />
                                    إضافة ملاحظة
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">{t('qualificationJourney.initiativesTitle')}</h3>
                {associatedProjects.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {associatedProjects.map(project => (
                             <div key={project.id} className="bg-card dark:bg-dark-card rounded-xl shadow-md border dark:border-slate-700 p-4 space-y-3">
                                <h4 className="font-bold">{project.title[language]}</h4>
                                <div className="flex justify-between items-center text-sm">
                                   <CategoryInfo category={project.category} />
                                   <span className="font-semibold">{t('leadership.projects.mentor')}: {project.mentor}</span>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-xs">
                                        <span>{t('leadership.projects.progress')}</span>
                                        <span className="font-bold">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                                        <div className="bg-secondary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-start mt-2">
                                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary dark:hover:text-secondary-light">
                                            <PlusCircle size={14} />
                                            إضافة ملاحظة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No associated community initiatives found.</p>
                )}
            </div>
        </div>
    );
};

export default QualificationJourneyTab;