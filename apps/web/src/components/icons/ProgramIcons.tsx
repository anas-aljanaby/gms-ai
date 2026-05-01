
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
 * HierarchyIcon - أيقونة الهيكل التنظيمي.
 * @component
 * @returns {JSX.Element}
 */
export const HierarchyIcon = () => (
    <IconWrapper>
        <path d="M10 3v4a1 1 0 0 1-1 1H5" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M12 21v-8" />
        <path d="M9 13H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M19 13h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </IconWrapper>
);

/**
 * BeneficiaryIcon - أيقونة المستفيدين.
 * @component
 * @returns {JSX.Element}
 */
export const BeneficiaryIcon = () => (
    <IconWrapper>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
);

/**
 * LifecycleIcon - أيقونة دورة حياة المشروع.
 * @component
 * @returns {JSX.Element}
 */
export const LifecycleIcon = () => (
    <IconWrapper>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M20.2 16.8a8.3 8.3 0 0 0-16.4 0" />
        <path d="M3.8 7.2a8.3 8.3 0 0 1 16.4 0" />
    </IconWrapper>
);

/**
 * FrameworkIcon - أيقونة أطر العمل.
 * @component
 * @returns {JSX.Element}
 */
export const FrameworkIcon = () => (
    <IconWrapper>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </IconWrapper>
);

/**
 * IndicatorIcon - أيقونة المؤشرات.
 * @component
 * @returns {JSX.Element}
 */
export const IndicatorIcon = () => (
    <IconWrapper>
        <path d="M3 3v18h18" />
        <path d="M18.7 8a2.4 2.4 0 0 0-3.4 0L12 11.4l-2.3-2.3a2.4 2.4 0 0 0-3.4 0L3 12.2" />
    </IconWrapper>
);

/**
 * PartnershipIcon - أيقونة الشراكات.
 * @component
 * @returns {JSX.Element}
 */
export const PartnershipIcon = () => (
    <IconWrapper>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="17" y1="8" x2="23" y2="8" />
        <line x1="17" y1="12" x2="23" y2="12" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </IconWrapper>
);

/**
 * SafeguardingIcon - أيقونة الحماية.
 * @component
 * @returns {JSX.Element}
 */
export const SafeguardingIcon = () => (
    <IconWrapper>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </IconWrapper>
);

/**
 * SdgIcon - أيقونة أهداف التنمية المستدامة.
 * @component
 * @returns {JSX.Element}
 */
export const SdgIcon = () => (
    <IconWrapper>
        <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z" />
        <path d="M12 3v1" />
        <path d="M12 20v1" />
        <path d="M3 12h1" />
        <path d="M20 12h1" />
        <path d="m18.36 5.64.71-.71" />
        <path d="m4.93 19.07.71-.71" />
        <path d="m18.36 18.36.71.71" />
        <path d="m4.93 4.93.71.71" />
    </IconWrapper>
);
