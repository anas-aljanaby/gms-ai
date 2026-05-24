import React, { useState, useMemo, useEffect } from 'react';
import ModalPortal from '../../common/ModalPortal';
import { useLocalization } from '../../../hooks/useLocalization';
import { X as XIcon } from 'lucide-react';
import type { Project as MainProject } from '../../../types';

interface LinkProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLink: (projectIds: string[]) => void;
    allProjects: MainProject[];
    /** Main project IDs already linked to the current goal (e.g. PROJ-2024-001). */
    linkedProjectIds: string[];
}

const LinkProjectModal: React.FC<LinkProjectModalProps> = ({ isOpen, onClose, onLink, allProjects, linkedProjectIds }) => {
    const { t, language, dir } = useLocalization(['common', 'bousala', 'projects']);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const linkedSet = useMemo(() => new Set(linkedProjectIds), [linkedProjectIds]);

    const availableProjects = useMemo(
        () => allProjects.filter(p => !linkedSet.has(p.id)),
        [allProjects, linkedSet],
    );

    useEffect(() => {
        if (isOpen) setSelectedIds(new Set());
    }, [isOpen]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleSubmit = () => {
        onLink(Array.from(selectedIds));
        setSelectedIds(new Set());
        onClose();
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose} dir={dir}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('bousala.linkProjectModal.title')}</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-4">{t('bousala.linkProjectModal.description')}</p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {availableProjects.length > 0 ? availableProjects.map(project => (
                            <label key={project.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(project.id)}
                                    onChange={() => handleToggle(project.id)}
                                    className="w-5 h-5 text-primary rounded"
                                />
                                <div>
                                    <p className="font-semibold" dir="auto">{project.name[language] || project.name.en}</p>
                                    <p className="text-xs text-gray-500">{t(`projects.types.${project.type}`)}</p>
                                </div>
                            </label>
                        )) : <p className="text-center text-gray-500">{t('bousala.linkProjectModal.noProjects')}</p>}
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                    <button type="button" onClick={handleSubmit} disabled={selectedIds.size === 0} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:bg-gray-400">
                        {t('bousala.linkProjectModal.linkCta', { count: selectedIds.size })}
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default LinkProjectModal;
