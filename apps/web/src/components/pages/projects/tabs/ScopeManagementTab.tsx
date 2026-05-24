import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';

interface ScopeManagementTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

type ScopeKey = 'inScope' | 'outOfScope' | 'assumptions' | 'constraints';

const ScopeManagementTab: React.FC<ScopeManagementTabProps> = ({ project, onUpdate }) => {
    const { t } = useLocalization(['projects']);
    const [addingTo, setAddingTo] = useState<ScopeKey | null>(null);
    const [newItemText, setNewItemText] = useState('');
    const [editingItem, setEditingItem] = useState<{ key: ScopeKey; index: number; text: string } | null>(null);

    const updateSection = (key: ScopeKey, items: string[]) => {
        onUpdate?.({ ...project, scopeStatement: { ...project.scopeStatement, [key]: items } });
    };

    const handleAdd = (key: ScopeKey) => {
        if (!newItemText.trim()) return;
        updateSection(key, [...project.scopeStatement[key], newItemText.trim()]);
        setNewItemText('');
        setAddingTo(null);
    };

    const handleEdit = () => {
        if (!editingItem || !editingItem.text.trim()) return;
        const items = [...project.scopeStatement[editingItem.key]];
        items[editingItem.index] = editingItem.text.trim();
        updateSection(editingItem.key, items);
        setEditingItem(null);
    };

    const handleDelete = (key: ScopeKey, index: number) => {
        updateSection(key, project.scopeStatement[key].filter((_, i) => i !== index));
    };

    const inputClass = "flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary";

    const ScopeSection: React.FC<{ sKey: ScopeKey }> = ({ sKey }) => {
        const items = project.scopeStatement[sKey];
        const isAdding = addingTo === sKey;

        return (
            <div>
                <h4 className="font-bold text-lg mb-2 text-foreground dark:text-dark-foreground">{t(`projects.scope.${sKey}`)}</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 group py-0.5">
                            {editingItem?.key === sKey && editingItem.index === index ? (
                                <>
                                    <input
                                        autoFocus
                                        className={inputClass}
                                        value={editingItem.text}
                                        onChange={e => setEditingItem(ei => ei ? { ...ei, text: e.target.value } : null)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') setEditingItem(null); }}
                                    />
                                    <button onClick={handleEdit} className="p-1 text-primary shrink-0"><Check size={14} /></button>
                                    <button onClick={() => setEditingItem(null)} className="p-1 text-gray-400 shrink-0"><X size={14} /></button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 leading-snug">{item}</span>
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button onClick={() => setEditingItem({ key: sKey, index, text: item })} className="p-0.5 text-gray-400 hover:text-primary rounded">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => handleDelete(sKey, index)} className="p-0.5 text-gray-400 hover:text-red-500 rounded">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {isAdding ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            className={inputClass}
                            placeholder={t('projects.scope.newItem')}
                            value={newItemText}
                            onChange={e => setNewItemText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAdd(sKey); if (e.key === 'Escape') { setAddingTo(null); setNewItemText(''); } }}
                        />
                        <button onClick={() => handleAdd(sKey)} className="p-1.5 text-primary shrink-0"><Check size={14} /></button>
                        <button onClick={() => { setAddingTo(null); setNewItemText(''); }} className="p-1.5 text-gray-400 shrink-0"><X size={14} /></button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setAddingTo(sKey); setNewItemText(''); setEditingItem(null); }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                        <PlusCircle size={13} /> {t('projects.scope.addItem')}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.scope.statement')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScopeSection sKey="inScope" />
                    <ScopeSection sKey="outOfScope" />
                    <ScopeSection sKey="assumptions" />
                    <ScopeSection sKey="constraints" />
                </div>
            </AiCard>

        </div>
    );
};

export default ScopeManagementTab;
