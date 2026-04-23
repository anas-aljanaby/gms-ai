
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @returns {JSX.Element}
 */
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    className="w-6 h-6"
  >
    {children}
  </svg>
);

/**
 * TotalScannedIcon - أيقونة إجمالي العناصر المفحوصة.
 * @component
 * @returns {JSX.Element}
 */
export const TotalScannedIcon = () => (
    <IconWrapper><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9.5 14.5 5-5"/><path d="m14.5 14.5-5-5"/></IconWrapper>
);

/**
 * HighRiskIcon - أيقونة العناصر عالية الخطورة.
 * @component
 * @returns {JSX.Element}
 */
export const HighRiskIcon = () => (
    <IconWrapper><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></IconWrapper>
);

/**
 * OpenAlertsIcon - أيقونة التنبيهات المفتوحة.
 * @component
 * @returns {JSX.Element}
 */
export const OpenAlertsIcon = () => (
    <IconWrapper><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconWrapper>
);
