import React, { useEffect, useMemo, useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import type { DocumentItem, DocumentFolder, DocumentFile, SupportedFileType } from '../../../types';
import { FolderIcon, FileIcon, PdfIcon, WordIcon, ExcelIcon, PptIcon, ImageIcon, VideoIcon, ZipIcon } from '../../icons/FiletypeIcons';
import { UploadIcon } from '../../icons/ActionIcons';
import { formatDate } from '../../../lib/utils';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import ModalPortal from '../../common/ModalPortal';
import { XIcon } from '../../icons/GenericIcons';
import ConfirmationModal from '../../common/ConfirmationModal';
import EditableField from './shared/EditableField';

interface BeneficiaryDocumentsTabProps {
    documents: DocumentItem[];
    beneficiaryName: string;
    onUpdate?: (documents: DocumentItem[]) => void;
}

const fileTypeToIcon: Record<SupportedFileType, React.FC> = {
    folder: FolderIcon, pdf: PdfIcon, docx: WordIcon, xlsx: ExcelIcon, pptx: PptIcon, jpg: ImageIcon, png: ImageIcon, zip: ZipIcon, mp4: VideoIcon, generic: FileIcon, ppt: PptIcon,
};

const FILE_TYPES: SupportedFileType[] = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'generic'];

type ModalMode = 'folder' | 'file' | null;

const updateChildrenAtPath = (
    items: DocumentItem[],
    path: string[],
    updater: (children: DocumentItem[]) => DocumentItem[],
): DocumentItem[] => {
    if (path.length <= 1) return updater(items);

    const folderName = path[1];
    return items.map((item) => {
        if (item.type === 'folder' && item.name === folderName) {
            return {
                ...item,
                children: updateChildrenAtPath(item.children, path.slice(1), updater),
                lastModified: new Date().toISOString(),
            };
        }
        return item;
    });
};

const BeneficiaryDocumentsTab: React.FC<BeneficiaryDocumentsTabProps> = ({ documents, beneficiaryName, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const toast = useToast();
    const [currentPath, setCurrentPath] = useState<string[]>(['/']);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingItem, setEditingItem] = useState<DocumentItem | null>(null);
    const [itemToRemove, setItemToRemove] = useState<DocumentItem | null>(null);
    const [folderName, setFolderName] = useState('');
    const [fileForm, setFileForm] = useState({ name: '', fileType: 'pdf' as SupportedFileType, size: '', description: '' });

    useEffect(() => {
        if (modalMode === 'folder') {
            setFolderName(editingItem?.type === 'folder' ? editingItem.name : '');
        }
        if (modalMode === 'file') {
            if (editingItem?.type === 'file') {
                setFileForm({
                    name: editingItem.name,
                    fileType: editingItem.fileType,
                    size: editingItem.size?.toString() || '',
                    description: editingItem.description || '',
                });
            } else {
                setFileForm({ name: '', fileType: 'pdf', size: '', description: '' });
            }
        }
    }, [modalMode, editingItem]);

    const currentFolder: DocumentFolder = useMemo(() => {
        const rootFolder: DocumentFolder = { id: 'root', type: 'folder', name: '/', children: documents, accessLevel: 'team', lastModified: '' };
        if (currentPath.length === 1) return rootFolder;

        let folder: DocumentFolder | undefined = rootFolder;
        for (let i = 1; i < currentPath.length; i++) {
            folder = folder?.children.find(item => item.type === 'folder' && item.name === currentPath[i]) as DocumentFolder | undefined;
            if (!folder) break;
        }
        const notFoundFolder: DocumentFolder = { id: 'error', type: 'folder', name: 'Not Found', children: [], accessLevel: 'private', lastModified: '' };
        return folder || notFoundFolder;
    }, [currentPath, documents]);

    const navigateTo = (folder: DocumentFolder) => setCurrentPath([...currentPath, folder.name]);
    const navigateBack = (index: number) => setCurrentPath(currentPath.slice(0, index + 1));

    const persistAtCurrentPath = (updater: (children: DocumentItem[]) => DocumentItem[]) => {
        if (!onUpdate) return;
        onUpdate(updateChildrenAtPath(documents, currentPath, updater));
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingItem(null);
    };

    const handleSaveFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim()) {
            toast.showError(t('beneficiaries.validation.folderNameRequired'));
            return;
        }

        if (editingItem?.type === 'folder') {
            persistAtCurrentPath((children) =>
                children.map((item) =>
                    item.id === editingItem.id
                        ? { ...item, name: folderName.trim(), lastModified: new Date().toISOString() }
                        : item
                )
            );
        } else {
            const folder: DocumentFolder = {
                id: `folder-${Date.now()}`,
                type: 'folder',
                name: folderName.trim(),
                children: [],
                accessLevel: 'team',
                lastModified: new Date().toISOString(),
            };
            persistAtCurrentPath((children) => [folder, ...children]);
        }

        closeModal();
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleSaveFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileForm.name.trim()) {
            toast.showError(t('beneficiaries.validation.fileNameRequired'));
            return;
        }

        // PLACEHOLDER: Depends on Supabase Storage — file binary is not uploaded yet; metadata only.
        const now = new Date().toISOString();
        const file: DocumentFile = editingItem?.type === 'file'
            ? {
                ...editingItem,
                name: fileForm.name.trim(),
                fileType: fileForm.fileType,
                size: fileForm.size ? parseInt(fileForm.size, 10) : editingItem.size,
                description: fileForm.description.trim(),
                lastModified: now,
            }
            : {
                id: `doc-${Date.now()}`,
                type: 'file',
                name: fileForm.name.trim(),
                fileType: fileForm.fileType,
                size: fileForm.size ? parseInt(fileForm.size, 10) : 0,
                uploadedBy: t('beneficiaries.documents.systemUser'),
                uploadedDate: now,
                lastModified: now,
                tags: [],
                description: fileForm.description.trim(),
                accessLevel: 'team',
                viewCount: 0,
                versions: [],
            };

        if (editingItem?.type === 'file') {
            persistAtCurrentPath((children) => children.map((item) => (item.id === editingItem.id ? file : item)));
        } else {
            persistAtCurrentPath((children) => [file, ...children]);
        }

        closeModal();
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleRemove = () => {
        if (!itemToRemove) return;
        persistAtCurrentPath((children) => children.filter((item) => item.id !== itemToRemove.id));
        setItemToRemove(null);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const openEdit = (item: DocumentItem) => {
        setEditingItem(item);
        setModalMode(item.type === 'folder' ? 'folder' : 'file');
    };

    const Breadcrumbs = () => (
        <nav className="flex items-center text-sm font-medium text-gray-500">
            {currentPath.map((part, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    <button onClick={() => navigateBack(index)} className={`hover:underline ${index === currentPath.length - 1 ? 'text-foreground dark:text-dark-foreground font-semibold' : ''}`}>
                        {part === '/' ? beneficiaryName : part === 'Official Documents' ? t('beneficiaries.documents.officialDocuments') : part}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );

    return (
        <div className="space-y-4">
            {onUpdate && (
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                        onClick={() => { setEditingItem(null); setModalMode('folder'); }}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                        <PlusCircle size={16} /> {t('beneficiaries.documents.newFolder')}
                    </button>
                    <button
                        onClick={() => { setEditingItem(null); setModalMode('file'); }}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg"
                    >
                        <UploadIcon /> {t('beneficiaries.documents.uploadFile')}
                    </button>
                </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">{t('beneficiaries.documents.storageNote')}</p>

            <div className="bg-card dark:bg-dark-card rounded-lg shadow-inner border dark:border-slate-700/50">
                <div className="p-4 border-b dark:border-slate-700">
                    <Breadcrumbs />
                </div>
                {currentFolder.children.length === 0 ? (
                    <div className="py-12 px-6 text-center">
                        <FolderIcon />
                        <h3 className="mt-3 text-lg font-semibold text-foreground dark:text-dark-foreground">{t('beneficiaries.documents.empty')}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('beneficiaries.documents.emptyDesc')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">{t('beneficiaries.documents.name')}</th>
                                    <th className="p-4">{t('beneficiaries.documents.lastModified')}</th>
                                    <th className="p-4">{t('beneficiaries.documents.size')}</th>
                                    <th className="p-4">{t('beneficiaries.documents.uploader')}</th>
                                    {onUpdate && <th className="p-4"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentFolder.children.map(item => {
                                    const Icon = fileTypeToIcon[item.type === 'folder' ? 'folder' : item.fileType];
                                    return (
                                        <tr key={item.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="p-4 font-semibold text-foreground dark:text-dark-foreground">
                                                <div className="flex items-center gap-3">
                                                    <Icon />
                                                    <button
                                                        onClick={() => item.type === 'folder' && navigateTo(item)}
                                                        className="hover:underline text-left cursor-pointer disabled:cursor-default disabled:no-underline"
                                                        disabled={item.type !== 'folder'}
                                                    >
                                                        {item.name === 'Official Documents' ? t('beneficiaries.documents.officialDocuments') : item.name}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{item.lastModified ? formatDate(item.lastModified, language) : '—'}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? `${(item as DocumentFile).size} KB` : '—'}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? (item as DocumentFile).uploadedBy : '—'}</td>
                                            {onUpdate && (
                                                <td className="p-4 text-right">
                                                    <div className="inline-flex items-center gap-1">
                                                        <button
                                                            onClick={() => openEdit(item)}
                                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                            aria-label={t('beneficiaries.documents.editItem')}
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => setItemToRemove(item)}
                                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            aria-label={t('beneficiaries.documents.removeItem')}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ModalPortal isOpen={modalMode === 'folder'} onClose={closeModal}>
                <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                        <h2 className="text-xl font-bold">{editingItem ? t('beneficiaries.documents.editFolder') : t('beneficiaries.documents.newFolder')}</h2>
                        <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}><XIcon /></button>
                    </div>
                    <form onSubmit={handleSaveFolder}>
                        <div className="p-6">
                            <EditableField label={t('beneficiaries.documents.name')} value={folderName} onChange={setFolderName} />
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end gap-3 border-t dark:border-slate-700">
                            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold">{t('common.save')}</button>
                        </div>
                    </form>
                </div>
            </ModalPortal>

            <ModalPortal isOpen={modalMode === 'file'} onClose={closeModal}>
                <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                        <h2 className="text-xl font-bold">{editingItem ? t('beneficiaries.documents.editFile') : t('beneficiaries.documents.uploadFile')}</h2>
                        <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}><XIcon /></button>
                    </div>
                    <form onSubmit={handleSaveFile}>
                        <div className="p-6 space-y-4">
                            <EditableField label={t('beneficiaries.documents.name')} value={fileForm.name} onChange={v => setFileForm(f => ({ ...f, name: v }))} />
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.documents.fileType')}</span>
                                <select
                                    value={fileForm.fileType}
                                    onChange={(e) => setFileForm(f => ({ ...f, fileType: e.target.value as SupportedFileType }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                >
                                    {FILE_TYPES.map((type) => (
                                        <option key={type} value={type}>{type.toUpperCase()}</option>
                                    ))}
                                </select>
                            </label>
                            <EditableField label={t('beneficiaries.documents.size')} value={fileForm.size} onChange={v => setFileForm(f => ({ ...f, size: v }))} type="number" />
                            <label className="block min-w-0">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('beneficiaries.documents.description')}</span>
                                <textarea
                                    value={fileForm.description}
                                    onChange={(e) => setFileForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground"
                                />
                            </label>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end gap-3 border-t dark:border-slate-700">
                            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold">{t('common.save')}</button>
                        </div>
                    </form>
                </div>
            </ModalPortal>

            <ConfirmationModal
                isOpen={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={handleRemove}
                title={t('beneficiaries.documents.removeItem')}
                message={t('beneficiaries.documents.removeConfirm')}
            />
        </div>
    );
};

export default BeneficiaryDocumentsTab;
