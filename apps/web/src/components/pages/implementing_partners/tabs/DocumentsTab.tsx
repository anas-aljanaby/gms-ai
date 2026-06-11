import React, { useMemo, useRef, useState } from 'react';
import { Download, Eye, File, FileText, Folder, Image, Trash2, Video } from 'lucide-react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatDate } from '../../../../lib/utils';
import { useToast } from '../../../../hooks/useToast';
import {
    MOCK_PARTNER_DOCUMENTS,
    PARTNER_DOCUMENT_CATEGORY_KEYS,
    type PartnerDocument,
    type PartnerDocumentCategory,
} from '../partnerStaticData';
import ModalPortal from '../../../common/ModalPortal';
import ConfirmationModal from '../../../common/ConfirmationModal';

// TODO: Replace local document state with partner documents API + storage when backend exists

const FileIcon: React.FC<{ type: PartnerDocument['type'] }> = ({ type }) => {
    switch (type) {
        case 'pdf': return <FileText className="text-red-500" />;
        case 'docx': return <FileText className="text-blue-500" />;
        case 'jpg': return <Image className="text-green-500" />;
        case 'mp4': return <Video className="text-purple-500" />;
        case 'folder': return <Folder className="text-amber-500" />;
        default: return <File className="text-gray-500" />;
    }
};

const inferDocType = (fileName: string): PartnerDocument['type'] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx' || ext === 'doc') return 'docx';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'jpg';
    if (ext === 'mp4') return 'mp4';
    return 'pdf';
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentsTab: React.FC = () => {
    const { t, language } = useLocalization(['partners', 'common']);
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState<string>('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [documents, setDocuments] = useState(MOCK_PARTNER_DOCUMENTS);
    const [folderOpen, setFolderOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [docToDelete, setDocToDelete] = useState<PartnerDocument | null>(null);

    const filtered = useMemo(
        () => (category === 'all' ? documents : documents.filter((d) => d.category === category)),
        [documents, category],
    );

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const docCategory: PartnerDocumentCategory = category === 'all' ? 'reports' : (category as PartnerDocumentCategory);
        const newDoc: PartnerDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            category: docCategory,
            date: new Date().toISOString().split('T')[0],
            size: formatFileSize(file.size),
            type: inferDocType(file.name),
        };
        setDocuments((prev) => [newDoc, ...prev]);
        toast.showSuccess(t('partners.documents.uploadSuccess'));
        e.target.value = '';
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim()) {
            toast.showError(t('partners.validation.required'));
            return;
        }
        const folder: PartnerDocument = {
            id: `folder-${Date.now()}`,
            name: folderName.trim(),
            category: category === 'all' ? 'legalCompliance' : (category as PartnerDocumentCategory),
            date: new Date().toISOString().split('T')[0],
            size: '--',
            type: 'folder',
        };
        setDocuments((prev) => [folder, ...prev]);
        toast.showSuccess(t('partners.documents.folderCreated'));
        setFolderName('');
        setFolderOpen(false);
    };

    const handleDelete = () => {
        if (!docToDelete) return;
        setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
        setSelected((prev) => {
            const next = new Set(prev);
            next.delete(docToDelete.id);
            return next;
        });
        toast.showSuccess(t('partners.documents.deleteSuccess'));
        setDocToDelete(null);
    };

    const handlePreview = () => {
        // TODO: Wire document preview when storage backend exists
        toast.showInfo(t('partners.documents.previewPlaceholder'));
    };

    const handleDownload = () => {
        // TODO: Wire document download when storage backend exists
        toast.showInfo(t('partners.documents.downloadPlaceholder'));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {PARTNER_DOCUMENT_CATEGORY_KEYS.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200'}`}
                    >
                        {t(`partners.documents.categories.${cat}`)}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4" onChange={handleUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    {t('partners.documents.upload')}
                </button>
                <button type="button" onClick={() => setFolderOpen(true)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    {t('partners.documents.newFolder')}
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border dark:border-slate-700">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 w-10" />
                            <th className="p-3">{t('partners.documents.fileName')}</th>
                            <th className="p-3">{t('partners.documents.uploadDate')}</th>
                            <th className="p-3">{t('partners.documents.size')}</th>
                            <th className="p-3">{t('partners.documents.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((doc) => (
                            <tr key={doc.id} className="border-t dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                                <td className="p-3">
                                    <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleSelect(doc.id)} />
                                </td>
                                <td className="p-3 font-semibold">
                                    <div className="flex items-center gap-3">
                                        <FileIcon type={doc.type} />
                                        <span>{doc.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-500">{formatDate(doc.date, language)}</td>
                                <td className="p-3 text-gray-500">{doc.size}</td>
                                <td className="p-3">
                                    <div className="flex justify-start gap-1">
                                        <button type="button" onClick={handlePreview} className="p-2 rounded-full hover:bg-gray-200 text-gray-600" title={t('partners.documents.preview')}>
                                            <Eye size={16} />
                                        </button>
                                        <button type="button" onClick={handleDownload} className="p-2 rounded-full hover:bg-gray-200 text-gray-600" title={t('partners.documents.download')}>
                                            <Download size={16} />
                                        </button>
                                        <button type="button" onClick={() => setDocToDelete(doc)} className="p-2 rounded-full hover:bg-red-100 text-red-500" title={t('partners.documents.delete')}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center p-16 text-gray-500">
                        <p>{t('partners.documents.empty')}</p>
                    </div>
                )}
            </div>

            <ModalPortal isOpen={folderOpen} onClose={() => setFolderOpen(false)}>
                <form className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md m-4 p-6" onClick={(e) => e.stopPropagation()} onSubmit={handleCreateFolder}>
                            <h2 className="text-xl font-bold mb-4">{t('partners.documents.newFolder')}</h2>
                            <input
                                className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder={t('partners.documents.folderNamePlaceholder')}
                                autoFocus
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setFolderOpen(false)} className="px-4 py-2 text-sm font-semibold border rounded-lg">{t('common.cancel')}</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">{t('common.save')}</button>
                            </div>
                </form>
            </ModalPortal>

            <ConfirmationModal
                isOpen={!!docToDelete}
                onClose={() => setDocToDelete(null)}
                onConfirm={handleDelete}
                title={t('partners.documents.deleteTitle')}
                message={t('partners.documents.deleteMessage', { name: docToDelete?.name ?? '' })}
            />
        </div>
    );
};

export default DocumentsTab;
