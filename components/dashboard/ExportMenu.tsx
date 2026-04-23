
import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { ChevronDown, FileText, FileSpreadsheet, FileImage, Presentation } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import type { Participant } from '../../types';

interface ExportMenuProps {
    dashboardRef: React.RefObject<HTMLDivElement>;
    filename: string;
    includeDate?: boolean;
    participantData: Participant[];
}

const ExportMenu: React.FC<ExportMenuProps> = ({ dashboardRef, filename, includeDate = true, participantData }) => {
    const { t, dir } = useLocalization();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const getFilename = (extension: string) => {
        const date = new Date().toISOString().split('T')[0];
        return includeDate ? `${filename}-${date}.${extension}` : `${filename}.${extension}`;
    };

    const runExport = async (exportFn: () => Promise<void>) => {
        if (isExporting) return;
        setIsOpen(false);
        setIsExporting(true);
        toast.showInfo(t('exportMenu.pleaseWait'), { title: t('exportMenu.exporting') });
        
        try {
            await new Promise(resolve => setTimeout(resolve, 100)); // allow UI to update
            await exportFn();
            toast.showSuccess(t('exportMenu.exportSuccess'), { title: t('exportMenu.successTitle') });
        } catch (error) {
            console.error("Export failed:", error);
            toast.showError(t('exportMenu.exportError'), { title: t('exportMenu.errorTitle') });
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPNG = () => runExport(async () => {
        if (!dashboardRef.current) return;
        const canvas = await html2canvas(dashboardRef.current, { useCORS: true, backgroundColor: null });
        const link = document.createElement('a');
        link.download = getFilename('png');
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    const handleExportPDF = () => runExport(async () => {
        if (!dashboardRef.current) return;
        const canvas = await html2canvas(dashboardRef.current, { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(getFilename('pdf'));
    });
    
    const handleExportXLSX = () => runExport(async () => {
        const ws = XLSX.utils.json_to_sheet(participantData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, t('exportMenu.participantsSheetName'));
        XLSX.writeFile(wb, getFilename('xlsx'));
    });
    
    const handleExportPPTX = () => runExport(async () => {
        if (!dashboardRef.current) return;
        const canvas = await html2canvas(dashboardRef.current, { useCORS: true, backgroundColor: null });
        const link = document.createElement('a');
        link.download = getFilename('png');
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.showInfo(t('exportMenu.pptxPlaceholder'), { title: t('exportMenu.imageDownloadedTitle') });
    });

    const menuItems = [
        { labelKey: 'exportMenu.image', icon: FileImage, action: handleExportPNG },
        { labelKey: 'exportMenu.pdf', icon: FileText, action: handleExportPDF },
        { labelKey: 'exportMenu.excel', icon: FileSpreadsheet, action: handleExportXLSX },
        { labelKey: 'exportMenu.powerpoint', icon: Presentation, action: handleExportPPTX },
    ];

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
                {isExporting ? t('exportMenu.exporting') : t('exportMenu.export')}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute end-0 mt-2 w-56 rounded-md shadow-lg bg-card dark:bg-dark-card ring-1 ring-black ring-opacity-5 z-10 animate-scale-in-fast">
                    <div className="py-1" role="menu">
                        {menuItems.map(({ labelKey, icon: Icon, action }) => (
                            <a
                                key={labelKey}
                                href="#"
                                onClick={(e) => { e.preventDefault(); action(); }}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-slate-700"
                                role="menuitem"
                            >
                                <Icon className="w-4 h-4" />
                                {t(labelKey)}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
