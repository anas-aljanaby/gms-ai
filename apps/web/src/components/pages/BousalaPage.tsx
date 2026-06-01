import React, { useState, useMemo, useCallback } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import Spinner from '../common/Spinner';
import type { Project as MainProject, HrData, Role, BousalaKpi, BousalaDirection } from '../../types';
import { useToast } from '../../hooks/useToast';
import {
    useBousala,
    useCreateBousalaGoal,
    useCreateBousalaKpi,
    useDeleteBousalaGoal,
    useDeleteBousalaKpi,
    useLinkBousalaProjects,
    useUnlinkBousalaGoalProject,
    useUpdateBousalaGoal,
    useUpdateBousalaKpi,
    useUpdateBousalaDirection,
} from '../../hooks/useBousala';
import { useProjects } from '../../hooks/useProjects';
import BousalaOverview from './bousala/BousalaOverview';
import GoalDetailView from './bousala/GoalDetailView';
import AddGoalModal from './bousala/AddGoalModal';
import AddKpiModal from './bousala/AddKpiModal';
import EditKpiModal from './bousala/EditKpiModal';
import LinkProjectModal from './bousala/LinkProjectModal';

interface BousalaPageProps {
    projects: MainProject[];
    hrData: HrData;
    role: Role;
    setActiveModule: (module: string) => void;
}

type GoalEditForm = { title: string; description: string; responsiblePerson: string; status: string };

const BousalaPage: React.FC<BousalaPageProps> = ({ projects: mainProjects, hrData, role, setActiveModule }) => {
    const { t, dir } = useLocalization(['common', 'bousala', 'projects']);
    const toast = useToast();
    const { data: apiProjects } = useProjects();
    const linkableProjects = useMemo(
        () => (apiProjects && apiProjects.length > 0 ? apiProjects : mainProjects),
        [apiProjects, mainProjects],
    );

    const canManage = role === 'Admin' || role === 'Manager';

    const { data: bousalaData, isLoading, isError } = useBousala();
    const goals = bousalaData?.goals ?? [];
    const projects = bousalaData?.projects ?? [];
    const direction = bousalaData?.direction;

    const createGoalMutation = useCreateBousalaGoal();
    const updateGoalMutation = useUpdateBousalaGoal();
    const deleteGoalMutation = useDeleteBousalaGoal();
    const createKpiMutation = useCreateBousalaKpi();
    const updateKpiMutation = useUpdateBousalaKpi();
    const deleteKpiMutation = useDeleteBousalaKpi();
    const linkProjectsMutation = useLinkBousalaProjects();
    const unlinkProjectMutation = useUnlinkBousalaGoalProject();
    const updateDirectionMutation = useUpdateBousalaDirection();

    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [isAddKpiOpen, setIsAddKpiOpen] = useState(false);
    const [editingKpi, setEditingKpi] = useState<BousalaKpi | null>(null);
    const [isLinkProjectOpen, setIsLinkProjectOpen] = useState(false);
    const [savingGoalId, setSavingGoalId] = useState<string | null>(null);
    const [savingKpiId, setSavingKpiId] = useState<string | null>(null);
    const [isSavingDirection, setIsSavingDirection] = useState(false);

    const selectedGoal = useMemo(
        () => (selectedGoalId ? goals.find(g => g.id === selectedGoalId) : undefined),
        [selectedGoalId, goals],
    );
    const linkedProjects = useMemo(
        () => (selectedGoal ? projects.filter(p => selectedGoal.linkedProjects.includes(p.id)) : []),
        [selectedGoal, projects],
    );
    const linkedSourceProjectIds = useMemo(
        () => linkedProjects.map(p => p.sourceProjectId).filter((id): id is string => !!id),
        [linkedProjects],
    );

    const handleSaveDirection = useCallback(async (data: BousalaDirection) => {
        setIsSavingDirection(true);
        try {
            await updateDirectionMutation.mutateAsync(data);
            toast.showSuccess(t('bousala.direction.saved'));
        } catch {
            toast.showError(t('common.error', 'Error'));
            throw new Error('direction save failed');
        } finally {
            setIsSavingDirection(false);
        }
    }, [toast, t, updateDirectionMutation]);

    const handleAddGoal = (goalData: { title: string; description: string; progress: number; responsiblePerson: string; status?: string }) => {
        createGoalMutation.mutate(
            { title: goalData.title, description: goalData.description, responsiblePerson: goalData.responsiblePerson, progress: goalData.progress, status: goalData.status },
            {
                onSuccess: () => {
                    toast.showSuccess(t('bousala.messages.goalAddedSuccess', { title: goalData.title }));
                    setIsAddGoalOpen(false);
                },
                onError: () => toast.showError(t('common.error', 'Error')),
            },
        );
    };

    const handleSaveGoal = useCallback(async (goalId: string, data: GoalEditForm) => {
        if (!data.title.trim()) {
            toast.showError(t('bousala.goalEdit.titleRequired'));
            throw new Error('validation');
        }
        setSavingGoalId(goalId);
        try {
            await updateGoalMutation.mutateAsync({
                goalId,
                data: { title: data.title, description: data.description, responsiblePerson: data.responsiblePerson, status: data.status || undefined },
            });
            toast.showSuccess(t('bousala.goalEdit.saved'));
        } catch {
            toast.showError(t('common.error', 'Error'));
            throw new Error('save failed');
        } finally {
            setSavingGoalId(null);
        }
    }, [toast, t, updateGoalMutation]);

    const handleDeleteGoal = useCallback((goalId: string) => {
        if (!window.confirm(t('bousala.goalEdit.deleteConfirm'))) return;
        deleteGoalMutation.mutate(goalId, {
            onSuccess: () => {
                setSelectedGoalId(prev => (prev === goalId ? null : prev));
                toast.showSuccess(t('bousala.messages.goalDeletedSuccess'));
            },
            onError: () => toast.showError(t('common.error', 'Error')),
        });
    }, [toast, t, deleteGoalMutation]);

    const handleAddKpi = (kpiData: { title: string; value: number; target: number; unit: string; goalId: string }) => {
        createKpiMutation.mutate(
            { goalId: kpiData.goalId, title: kpiData.title, value: kpiData.value, target: kpiData.target, unit: kpiData.unit },
            {
                onSuccess: () => {
                    toast.showSuccess(t('bousala.messages.kpiAddedSuccess'));
                    setIsAddKpiOpen(false);
                },
                onError: () => toast.showError(t('common.error', 'Error')),
            },
        );
    };

    const handleSaveKpi = useCallback(async (data: { title: string; value: number; target: number; unit: string; kpiDescription?: string }) => {
        if (!editingKpi) return;
        setSavingKpiId(editingKpi.id);
        try {
            await updateKpiMutation.mutateAsync({ kpiId: editingKpi.id, data });
            toast.showSuccess(t('bousala.kpiEdit.saved'));
            setEditingKpi(null);
        } catch {
            toast.showError(t('common.error', 'Error'));
            throw new Error('kpi save failed');
        } finally {
            setSavingKpiId(null);
        }
    }, [editingKpi, toast, t, updateKpiMutation]);

    const handleDeleteKpi = useCallback((_goalId: string, kpiId: string) => {
        if (!window.confirm(t('bousala.kpiEdit.deleteConfirm'))) return;
        deleteKpiMutation.mutate(kpiId, {
            onSuccess: () => toast.showSuccess(t('bousala.messages.kpiDeletedSuccess')),
            onError: () => toast.showError(t('common.error', 'Error')),
        });
    }, [toast, t, deleteKpiMutation]);

    const handleLinkProject = (projectIds: string[]) => {
        if (!selectedGoalId) return;
        linkProjectsMutation.mutate(
            { goalId: selectedGoalId, projectIds },
            {
                onSuccess: () => {
                    toast.showSuccess(t('bousala.messages.projectLinkedSuccess'));
                    setIsLinkProjectOpen(false);
                },
                onError: () => toast.showError(t('common.error', 'Error')),
            },
        );
    };

    const handleUnlinkProject = useCallback((projectId: string) => {
        if (!window.confirm(t('bousala.projectEdit.unlinkConfirm'))) return;
        unlinkProjectMutation.mutate(projectId, {
            onSuccess: () => toast.showSuccess(t('bousala.messages.projectUnlinkedSuccess')),
            onError: () => toast.showError(t('common.error', 'Error')),
        });
    }, [toast, t, unlinkProjectMutation]);

    return (
        <div className="animate-fade-in" dir={dir}>
            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner /></div>
            ) : isError ? (
                <div className="text-center py-16 text-red-500">{t('common.error', 'Error')}</div>
            ) : selectedGoal ? (
                <GoalDetailView
                    goal={selectedGoal}
                    linkedProjects={linkedProjects}
                    mainProjects={linkableProjects}
                    hrData={hrData}
                    canManage={canManage}
                    isSavingGoal={savingGoalId === selectedGoal.id}
                    onBack={() => setSelectedGoalId(null)}
                    onSaveGoal={handleSaveGoal}
                    onDeleteGoal={handleDeleteGoal}
                    onAddKpiClick={() => setIsAddKpiOpen(true)}
                    onEditKpi={setEditingKpi}
                    onDeleteKpi={handleDeleteKpi}
                    onLinkProjectClick={() => setIsLinkProjectOpen(true)}
                    onUnlinkProject={handleUnlinkProject}
                    setActiveModule={setActiveModule}
                />
            ) : (
                <BousalaOverview
                    goals={goals}
                    direction={direction}
                    canEditDirection={canManage}
                    canManage={canManage}
                    isSavingDirection={isSavingDirection}
                    onSaveDirection={handleSaveDirection}
                    onAddGoal={() => setIsAddGoalOpen(true)}
                    onSelectGoal={setSelectedGoalId}
                    setActiveModule={setActiveModule}
                />
            )}

            <AddGoalModal isOpen={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} onAdd={handleAddGoal} hrData={hrData} />
            <AddKpiModal isOpen={isAddKpiOpen} onClose={() => setIsAddKpiOpen(false)} onAdd={handleAddKpi} goalId={selectedGoalId ?? ''} />
            <EditKpiModal isOpen={editingKpi !== null} onClose={() => setEditingKpi(null)} kpi={editingKpi} onSave={handleSaveKpi} isSaving={savingKpiId !== null} />
            <LinkProjectModal isOpen={isLinkProjectOpen} onClose={() => setIsLinkProjectOpen(false)} onLink={handleLinkProject} allProjects={linkableProjects} linkedProjectIds={linkedSourceProjectIds} />
        </div>
    );
};

export default BousalaPage;
