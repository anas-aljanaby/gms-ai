import React, { useState, useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import type { DocumentItem, DocumentFolder, DocumentFile, SupportedFileType } from '../../../types';
import { FolderIcon, FileIcon, PdfIcon, WordIcon, ExcelIcon, PptIcon, ImageIcon, VideoIcon, ZipIcon } from '../../icons/FiletypeIcons';
import { MoreHorizontalIcon, XIcon, SearchIcon, ChevronDownIcon } from '../../icons/GenericIcons';
import { UploadIcon } from '../../icons/ActionIcons';
import { formatDate } from '../../../lib/utils';

interface BeneficiaryDocumentsTabProps {
    documents: DocumentItem[];
    beneficiaryName: string;
}

// FIX: Added 'ppt' to handle older PowerPoint formats
const fileTypeToIcon: Record<SupportedFileType, React.FC> = {
    folder: FolderIcon, pdf: PdfIcon, docx: WordIcon, xlsx: ExcelIcon, pptx: PptIcon, jpg: ImageIcon, png: ImageIcon, zip: ZipIcon, mp4: VideoIcon, generic: FileIcon, ppt: PptIcon,
};

const BeneficiaryDocumentsTab: React.FC<BeneficiaryDocumentsTabProps> = ({ documents, beneficiaryName }) => {
    const { t, language, dir } = useLocalization();
    const toast = useToast();
    const [currentPath, setCurrentPath] = useState<string[]>(['/']);

    const handleNewFolder = () => {
        toast.showInfo(t('toasts.newFolderComingSoon'), { title: t('toasts.featureInDev') });
    };

    const handleUpload = () => {
        toast.showInfo(t('toasts.uploadComingSoon'), { title: t('toasts.featureInDev') });
    };

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
             <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button onClick={handleNewFolder} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">{t('projects.documents.newFolder')}</button>
                <button onClick={handleUpload} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg"><UploadIcon /> {t('projects.documents.uploadFile')}</button>
            </div>
            <div className="bg-card dark:bg-dark-card rounded-lg shadow-inner border dark:border-slate-700/50">
                 <div className="p-4 border-b dark:border-slate-700">
                     <Breadcrumbs />
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">{t('projects.documents.name')}</th>
                                <th className="p-4">{t('projects.documents.lastModified')}</th>
                                <th className="p-4">{t('projects.documents.size')}</th>
                                <th className="p-4">{t('projects.documents.uploader')}</th>
                                <th className="p-4"></th>
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
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(item.lastModified, language)}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? `${(item as DocumentFile).size} KB` : '-'}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? (item as DocumentFile).uploadedBy : ''}</td>
                                        <td className="p-4 text-right"><MoreHorizontalIcon /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default BeneficiaryDocumentsTab;