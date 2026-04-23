
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
 * UsersIcon - أيقونة المستخدمين.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </IconWrapper>
);

/**
 * ClockIcon - أيقونة الساعة.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </IconWrapper>
);

/**
 * StarIcon - أيقونة النجمة.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </IconWrapper>
);
