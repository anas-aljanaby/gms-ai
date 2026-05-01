
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className] - فئات CSS إضافية.
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
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/**
 * CheckIcon - أيقونة علامة الصح.
 * @component
 * @returns {JSX.Element}
 */
export const CheckIcon = () => (
    <IconWrapper className="w-7 h-7 text-white"><polyline points="20 6 9 17 4 12"></polyline></IconWrapper>
);

/**
 * HalfCircleIcon - أيقونة نصف الدائرة (قيد التقدم).
 * @component
 * @returns {JSX.Element}
 */
export const HalfCircleIcon = () => (
    <IconWrapper className="w-6 h-6 text-white"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path></IconWrapper>
);

/**
 * CircleIcon - أيقونة الدائرة (قادم).
 * @component
 * @returns {JSX.Element}
 */
export const CircleIcon = () => (
    <IconWrapper className="w-6 h-6 text-white"><circle cx="12" cy="12" r="10"></circle></IconWrapper>
);
