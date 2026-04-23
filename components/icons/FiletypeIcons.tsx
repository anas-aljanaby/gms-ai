
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-8 h-8"] - فئات CSS لتخصيص الأيقونة.
 * @returns {JSX.Element} - أيقونة SVG مغلفة.
 */
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-8 h-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/**
 * FileIcon - أيقونة ملف عامة.
 * @component
 * @returns {JSX.Element}
 */
export const FileIcon = () => (
    <IconWrapper className="w-6 h-6"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></IconWrapper>
);

/**
 * PdfIcon - أيقونة ملف PDF.
 * @component
 * @returns {JSX.Element}
 */
export const PdfIcon = () => (
    <IconWrapper className="w-6 h-6 text-red-500"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M3 12h2a2 2 0 1 1 0 4H3v-1a1 1 0 0 1 1-1h1"/><path d="M11 12h2a2 2 0 1 1 0 4h-2v-1a1 1 0 0 1 1-1h1"/><path d="M18 16a2 2 0 0 1-2-2h1a1 1 0 0 1 1 1v1Z"/></IconWrapper>
);

/**
 * WordIcon - أيقونة ملف Word.
 * @component
 * @returns {JSX.Element}
 */
export const WordIcon = () => (
    <IconWrapper className="w-6 h-6 text-blue-600"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="m15 13-3 7-3-7"/></IconWrapper>
);

/**
 * ExcelIcon - أيقونة ملف Excel.
 * @component
 * @returns {JSX.Element}
 */
export const ExcelIcon = () => (
    <IconWrapper className="w-6 h-6 text-green-600"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="m14 13-4 5 4 5"/><path d="m10 13 4 5-4 5"/></IconWrapper>
);

/**
 * PptIcon - أيقونة ملف PowerPoint.
 * @component
 * @returns {JSX.Element}
 */
export const PptIcon = () => (
    <IconWrapper className="w-6 h-6 text-orange-500"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 12h2a2 2 0 1 1 0 4H8v-1a1 1 0 0 1 1-1h1"/><path d="M16 12h2a2 2 0 1 1 0 4h-2v-1a1 1 0 0 1 1-1h1"/></IconWrapper>
);

/**
 * ImageIcon - أيقونة ملف صورة.
 * @component
 * @returns {JSX.Element}
 */
export const ImageIcon = () => (
    <IconWrapper className="w-6 h-6 text-purple-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconWrapper>
);

/**
 * VideoIcon - أيقونة ملف فيديو.
 * @component
 * @returns {JSX.Element}
 */
export const VideoIcon = () => (
    <IconWrapper className="w-6 h-6 text-sky-500"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></IconWrapper>
);

/**
 * ZipIcon - أيقونة ملف مضغوط.
 * @component
 * @returns {JSX.Element}
 */
export const ZipIcon = () => (
    <IconWrapper className="w-6 h-6 text-yellow-500"><path d="M21 15V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v7a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 15z"/><path d="M9 8V2"/><path d="M9 14v-2.5"/><path d="M9 11.5L6.5 9"/><path d="M9 11.5 11.5 9"/></IconWrapper>
);

/**
 * FolderIcon - أيقونة المجلد.
 * @component
 * @returns {JSX.Element}
 */
export const FolderIcon = () => (
    <IconWrapper className="w-6 h-6 text-amber-500"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></IconWrapper>
);