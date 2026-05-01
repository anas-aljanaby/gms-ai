
import React from 'react';
import type { Language } from '../../types';

/**
 * FlagIconWrapper - غلاف مشترك لأيقونات الأعلام.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} props.title - عنوان العلم للوصولية.
 * @returns {JSX.Element}
 */
const FlagIconWrapper: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 15" className="w-5 h-auto rounded-sm" aria-label={title}>
        {children}
    </svg>
);

/**
 * USFlagIcon - أيقونة علم الولايات المتحدة.
 * @component
 * @returns {JSX.Element}
 */
export const USFlagIcon: React.FC = () => (
    <FlagIconWrapper title="English (US) Flag">
        <defs><clipPath id="us-clip"><path d="M0 0h21v15H0z"/></clipPath></defs>
        <g clipPath="url(#us-clip)">
            <path fill="#fff" d="M0 0h21v15H0z"/>
            <path stroke="#E0162B" strokeWidth="1.5" d="M0 1.5h21m0 3H0m0 3h21m0 3H0m0 3h21"/>
            <path fill="#0A3161" d="M0 0h10v9H0z"/>
            <path fill="#fff" d="M.5 1h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z M1.5 2.5h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z M.5 4h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z M1.5 5.5h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z M.5 7h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z"/>
        </g>
    </FlagIconWrapper>
);

/**
 * SAFlagIcon - أيقونة علم المملكة العربية السعودية.
 * @component
 * @returns {JSX.Element}
 */
export const SAFlagIcon: React.FC = () => (
    <FlagIconWrapper title="Arabic (Saudi Arabia) Flag">
      <g fillRule="evenodd">
        <path fill="#006c35" d="M0 0h21v15H0z"/>
        <text fontFamily="Arial" fontSize="4" fontWeight="bold" letterSpacing="0" transform="translate(1.5 10.5)" y="0" x="0">
            <tspan fill="#fff" strokeWidth=".2">لَا إِلٰهَ إِلَّا الله، مُحَمَّدٌ رَسُولُ الله</tspan>
        </text>
        <path fill="#fff" stroke="#fff" strokeWidth=".3" d="M2.3 12.8h16.4l-1.3-1-1-1.3-1.6.6-1.1-.3-1.6.5-1-.2-1.3.4-1.2-.5-1.5.5-1-.2-1.6.5-1.1-.2-1.6.6-1 1.3-1.3-1z"/>
      </g>
    </FlagIconWrapper>
);

/**
 * langToFlag - كائن يربط رمز اللغة بمكون علمها المقابل.
 * @type {Record<Language, React.FC>}
 */
export const langToFlag: Record<Language, React.FC> = {
  en: USFlagIcon,
  ar: SAFlagIcon,
};
