
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG لتوفير خصائص أساسية.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-8 h-8"] - فئات CSS لتخصيص الأيقونة.
 * @returns {JSX.Element} - أيقونة SVG مغلفة.
 */
const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "w-8 h-8" }) => (
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
 * ClockIcon - أيقونة الساعة.
 * @component
 * @returns {JSX.Element}
 */
export const ClockIcon = () => (
    <IconWrapper><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></IconWrapper>
);

/**
 * UsersIcon - أيقونة المستخدمين.
 * @component
 * @returns {JSX.Element}
 */
export const UsersIcon = () => (
    <IconWrapper><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></IconWrapper>
);

/**
 * CancelIcon - أيقونة الإلغاء.
 * @component
 * @returns {JSX.Element}
 */
export const CancelIcon = () => (
    <IconWrapper><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></IconWrapper>
);

/**
 * TargetIcon - أيقونة الهدف.
 * @component
 * @returns {JSX.Element}
 */
export const TargetIcon = () => (
    <IconWrapper><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></IconWrapper>
);
