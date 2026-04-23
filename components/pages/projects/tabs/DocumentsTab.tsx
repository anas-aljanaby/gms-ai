

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, DocumentItem, DocumentFolder, DocumentFile, SupportedFileType, FileVersion, DocumentAccessLevel } from '../../../../types';
import { FolderIcon, FileIcon, PdfIcon, WordIcon, ExcelIcon, PptIcon, ImageIcon, VideoIcon, ZipIcon } from '../../../icons/FiletypeIcons';
import { MoreHorizontalIcon, XIcon, SearchIcon, ChevronDownIcon } from '../../../icons/GenericIcons';
import { UploadIcon } from '../../../icons/ActionIcons';
import { formatDate } from '../../../../lib/utils';

interface DocumentsTabProps {
    project: Project;
}

// FIX: Added 'ppt' to handle older PowerPoint formats
const fileTypeToIcon: Record<SupportedFileType, React.FC<{className?: string}>> = {
    folder: FolderIcon, pdf: PdfIcon, docx: WordIcon, xlsx: ExcelIcon, pptx: PptIcon, jpg: ImageIcon, png: ImageIcon, zip: ZipIcon, mp4: VideoIcon, generic: FileIcon, ppt: PptIcon
};

const DocumentsTab: React.FC<DocumentsTabProps> = ({ project }) => {
    const { t, language, dir } = useLocalization();
    const [currentPath, setCurrentPath] = useState<string[]>(['/']);
    const [selectedItem, setSelectedItem] = useState<DocumentItem | null>(null);

    const currentFolder: DocumentFolder = useMemo(() => {
        if (currentPath.length === 1) return { id: 'root', type: 'folder', name: '/', children: project.documents, accessLevel: 'team', lastModified: '' };
        let folder: DocumentFolder | undefined = { id: 'root', type: 'folder', name: '/', children: project.documents, accessLevel: 'team', lastModified: '' };
        for (let i = 1; i < currentPath.length; i++) {
            folder = folder?.children.find(item => item.type === 'folder' && item.name === currentPath[i]) as DocumentFolder | undefined;
            if (!folder) break;
        }
        return folder || { id: 'error', type: 'folder', name: 'Not Found', children: [], accessLevel: 'private', lastModified: '' };
    }, [currentPath, project.documents]);

    const navigateTo = (folder: DocumentFolder) => setCurrentPath([...currentPath, folder.name]);
    const navigateBack = (index: number) => setCurrentPath(currentPath.slice(0, index + 1));
    const handleItemClick = (item: DocumentItem) => {
        if (item.type === 'folder') {
            navigateTo(item);
        } else {
            setSelectedItem(item);
        }
    };
    
    const Breadcrumbs = () => (
        <nav className="flex items-center text-sm font-medium text-gray-500">
            {currentPath.map((part, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    <button onClick={() => navigateBack(index)} className={`hover:underline ${index === currentPath.length - 1 ? 'text-foreground dark:text-dark-foreground font-semibold' : ''}`}>
                        {part === '/' ? project.name[language] : part}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );

    return (
        <div className="flex gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
                <div className="p-4 bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50">
                     <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-grow">
                             <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'ps-3' : 'pe-3'} pointer-events-none`}>
                                <SearchIcon />
                            </div>
                            <input type="text" placeholder={t('projects.documents.search.placeholder')} className={`block w-full p-2.5 ${dir === 'ltr' ? 'ps-10' : 'pe-10'} text-sm border rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary dark:border-slate-700`} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">{t('projects.documents.newFolder')}</button>
                            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg"><UploadIcon /> {t('projects.documents.uploadFile')}</button>
                        </div>
                    </div>
                </div>

                <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
                    <div className="p-4 border-b dark:border-slate-700">
                         <Breadcrumbs />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-dark-card/50">
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
                                    const Icon = fileTypeToIcon[item.type === 'folder' ? 'folder' : (item as DocumentFile).fileType];
                                    return (
                                        <tr key={item.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="p-4 font-semibold text-foreground dark:text-dark-foreground">
                                                <div className="flex items-center gap-3">
                                                    <Icon />
                                                    <button
                                                        onClick={() => handleItemClick(item)}
                                                        className="hover:underline text-left cursor-pointer disabled:cursor-default disabled:no-underline"
                                                        disabled={item.type !== 'folder'}
                                                    >
                                                        {item.name}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(item.lastModified, language)}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? `${(item as DocumentFile).size} KB` : '-'}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{item.type === 'file' ? (item as DocumentFile).uploadedBy : ''}</td>
                                            <td className="p-4 text-right"><button><MoreHorizontalIcon /></button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Details Panel */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-80 flex-shrink-0"
                    >
                        <div className="bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 h-full flex flex-col">
                            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold">File Details</h3>
                                <button onClick={() => setSelectedItem(null)}><XIcon /></button>
                            </div>
                            <div className="p-4 text-center">
                                <div className="text-5xl mx-auto w-fit mb-2">
                                    {React.createElement(fileTypeToIcon[selectedItem.type === 'file' ? (selectedItem as DocumentFile).fileType : 'generic'])}
                                </div>
                                <p className="font-bold break-words">{selectedItem.name}</p>
                                {selectedItem.type === 'file' && <p className="text-sm text-gray-500">{(selectedItem as DocumentFile).size} KB</p>}
                            </div>
                            <div className="p-4 space-y-2 text-sm border-t dark:border-slate-700">
                                <p><strong>Description:</strong> {selectedItem.type === 'file' ? (selectedItem as DocumentFile).description || 'N/A' : 'Folder'}</p>
                                <p><strong>Last Modified:</strong> {formatDate(selectedItem.lastModified, language)}</p>
                                <p><strong>Access:</strong> {selectedItem.accessLevel}</p>
                                {selectedItem.type === 'file' && <p><strong>Views:</strong> {(selectedItem as DocumentFile).viewCount}</p>}
                                {selectedItem.type === 'file' && (selectedItem as DocumentFile).versions && (
                                    <div>
                                        <strong>Versions:</strong>
                                        <ul className="text-xs list-disc list-inside">
                                            {(selectedItem as DocumentFile).versions.map(v => <li key={v.version}>{v.version} by {v.author}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentsTab;