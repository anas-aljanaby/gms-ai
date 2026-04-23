
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-6 h-6"] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
 * ContractIcon - أيقونة العقد.
 * @component
 * @returns {JSX.Element}
 */
export const ContractIcon = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></IconWrapper>;

/**
 * InvoiceIcon - أيقونة الفاتورة.
 * @component
 * @returns {JSX.Element}
 */
export const InvoiceIcon = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>;

/**
 * PolicyIcon - أيقونة السياسة.
 * @component
 * @returns {JSX.Element}
 */
export const PolicyIcon = () => <IconWrapper><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></IconWrapper>;

/**
 * ReportIcon - أيقونة التقرير.
 * @component
 * @returns {JSX.Element}
 */
export const ReportIcon = () => <IconWrapper><path d="M8 6h8"></path><path d="M8 10h8"></path><path d="M8 14h4"></path><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 2v6h6"></path></IconWrapper>;

/**
 * FolderIcon - أيقونة المجلد.
 * @component
 * @returns {JSX.Element}
 */
export const FolderIcon = () => <IconWrapper><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></IconWrapper>;
