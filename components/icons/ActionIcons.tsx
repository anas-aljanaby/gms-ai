
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG لتوفير خصائص أساسية.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-5 h-5"] - فئات CSS لتخصيص الأيقونة.
 * @returns {JSX.Element} - أيقونة SVG مغلفة.
 */
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-5 h-5" }) => (
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
 * TaskIcon - أيقونة المهمة.
 * @component
 * @returns {JSX.Element}
 */
export const TaskIcon = () => <IconWrapper><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></IconWrapper>;

/**
 * DonationIcon - أيقونة التبرع.
 * @component
 * @returns {JSX.Element}
 */
export const DonationIcon = () => <IconWrapper><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12"></path><path d="M16 10H8"></path></IconWrapper>;

/**
 * ViewIcon - أيقونة العرض (عين).
 * @component
 * @returns {JSX.Element}
 */
export const ViewIcon = () => <IconWrapper><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></IconWrapper>;

/**
 * EditIcon - أيقونة التعديل.
 * @component
 * @returns {JSX.Element}
 */
// FIX: Added className prop to allow for custom styling.
export const EditIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></IconWrapper>;

/**
 * CsvIcon - أيقونة ملف CSV.
 * @component
 * @returns {JSX.Element}
 */
export const CsvIcon = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9.5" y1="13.5" x2="14.5" y2="18.5"></line><line x1="14.5" y1="13.5" x2="9.5" y2="18.5"></line></IconWrapper>;

/**
 * JsonIcon - أيقونة ملف JSON.
 * @component
 * @returns {JSX.Element}
 */
export const JsonIcon = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 12v6"></path><path d="M14 12v6"></path><path d="M10 15h4"></path></IconWrapper>;

/**
 * UploadIcon - أيقونة الرفع.
 * @component
 * @returns {JSX.Element}
 */
// FIX: Added className prop to allow for custom styling.
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></IconWrapper>;

/**
 * LockIcon - أيقونة القفل.
 * @component
 * @returns {JSX.Element}
 */
// FIX: Added className prop to allow for custom styling.
export const LockIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></IconWrapper>;

/**
 * UnlockIcon - أيقونة فتح القفل.
 * @component
 * @returns {JSX.Element}
 */
export const UnlockIcon = () => <IconWrapper><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></IconWrapper>;

/**
 * CheckSquareIcon - أيقونة مربع الاختيار.
 * @component
 * @returns {JSX.Element}
 */
export const CheckSquareIcon = () => <IconWrapper><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></IconWrapper>;

/**
 * UndoIcon - أيقونة التراجع.
 * @component
 * @returns {JSX.Element}
 */
export const UndoIcon = () => <IconWrapper><path d="M21 8L17 4m0 0L13 8m4-4v3a5 5 0 0 1-5 5H3"></path></IconWrapper>;

/**
 * ListIcon - أيقونة عرض القائمة.
 * @component
 * @returns {JSX.Element}
 */
export const ListIcon = () => <IconWrapper><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></IconWrapper>;

/**
 * CalendarIcon - أيقونة التقويم.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconWrapper>;

/**
 * MailIcon - أيقونة البريد.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></IconWrapper>;
