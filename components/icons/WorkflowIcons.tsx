
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
 * RoleIcon - أيقونة الدور الوظيفي.
 * @component
 * @returns {JSX.Element}
 */
export const RoleIcon = () => (
    <IconWrapper className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></IconWrapper>
);

/**
 * UserIcon - أيقونة المستخدم.
 * @component
 * @returns {JSX.Element}
 */
export const UserIcon = () => (
    <IconWrapper className="w-5 h-5"><path d="M18 21a8 8 0 0 0-12 0"></path><circle cx="12" cy="11" r="4"></circle><path d="M12 3a8 8 0 0 1 8 8"></path><path d="M12 3a8 8 0 0 0-8 8"></path></IconWrapper>
);

/**
 * ManagerIcon - أيقونة المدير.
 * @component
 * @returns {JSX.Element}
 */
export const ManagerIcon = () => (
    <IconWrapper className="w-5 h-5"><path d="M12 12s-4-2-4-8 4-4 4-4 4 2 4 8-4 8-4 8z"></path><path d="M12 12v10"></path><path d="M12 22h-2"></path><path d="M12 22h2"></path></IconWrapper>
);

/**
 * ArrowDownIcon - أيقونة السهم للأسفل.
 * @component
 * @returns {JSX.Element}
 */
export const ArrowDownIcon = () => (
    <IconWrapper className="w-5 h-5 text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></IconWrapper>
);
