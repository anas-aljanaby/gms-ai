
import React from 'react';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
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
 * CommunityServiceIcon - أيقونة خدمة المجتمع.
 * @component
 * @returns {JSX.Element}
 */
export const CommunityServiceIcon = () => (
    <IconWrapper><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></IconWrapper>
);

/**
 * ResearchIcon - أيقونة البحث.
 * @component
 * @returns {JSX.Element}
 */
export const ResearchIcon = () => (
    <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></IconWrapper>
);

/**
 * InnovationIcon - أيقونة الابتكار.
 * @component
 * @returns {JSX.Element}
 */
export const InnovationIcon = () => (
    <IconWrapper><path d="M15.5 2.5a2.5 2.5 0 0 1 3 3L12 12l-4-4 7.5-5.5z"></path><path d="m14 6 3 3"></path><path d="M2.5 15.5a2.5 2.5 0 0 0 3 3L12 12l-4-4-5.5 7.5z"></path><path d="m6 14 3 3"></path></IconWrapper>
);

/**
 * LeadershipProjectIcon - أيقونة مشروع القيادة.
 * @component
 * @returns {JSX.Element}
 */
export const LeadershipProjectIcon = () => (
    <IconWrapper><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path><path d="M2 8h20"></path><path d="M10 12v6"></path><path d="M6 12v6"></path><path d="M14 12v6"></path><path d="M18 12v6"></path></IconWrapper>
);

/**
 * EnvironmentalIcon - أيقونة البيئة.
 * @component
 * @returns {JSX.Element}
 */
export const EnvironmentalIcon = () => (
    <IconWrapper><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z"></path><path d="M12 3v1a7 7 0 0 1 7 7h1a8 8 0 0 0-8-8z"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path></IconWrapper>
);

/**
 * EducationalIcon - أيقونة التعليم.
 * @component
 * @returns {JSX.Element}
 */
export const EducationalIcon = () => (
    <IconWrapper><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3.33 1.67 6.67 1.67 10 0v-5"></path></IconWrapper>
);

/**
 * CulturalIcon - أيقونة الثقافة.
 * @component
 * @returns {JSX.Element}
 */
export const CulturalIcon = () => (
    <IconWrapper><path d="m2 16 2.296-.287A3 3 0 0 1 7.2 15.242L8.757 14.5a3 3 0 0 1 2.486 0L12.757 15a3 3 0 0 0 2.486 0L16.757 14.5a3 3 0 0 1 2.486 0L22 15"></path><path d="m2 11 2.296-.287A3 3 0 0 1 7.2 10.243L8.757 9.5a3 3 0 0 1 2.486 0L12.757 10a3 3 0 0 0 2.486 0L16.757 9.5a3 3 0 0 1 2.486 0L22 10"></path><path d="m2 6 2.296-.287A3 3 0 0 1 7.2 5.243L8.757 4.5a3 3 0 0 1 2.486 0L12.757 5a3 3 0 0 0 2.486 0L16.757 4.5a3 3 0 0 1 2.486 0L22 5"></path></IconWrapper>
);
