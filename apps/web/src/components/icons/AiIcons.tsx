

import React from 'react';
import { ComplianceIcon as ModuleComplianceIcon } from './ModuleIcons';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className="w-8 h-8"] - فئات CSS لتخصيص الأيقونة.
 * @returns {JSX.Element} - أيقونة SVG مغلفة.
 */
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

/**
 * SmartEntryIcon - أيقونة الإدخال الذكي.
 * @component
 * @returns {JSX.Element}
 */
export const SmartEntryIcon = () => <IconWrapper><path d="M18 8.5V11a4.5 4.5 0 0 1-4.5 4.5H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/><path d="m14 4 3 3-3 3"/><path d="m10.5 12.5 1.5 1.5"/><path d="m7 13 1.5 1.5"/><path d="M18 2a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Z"/></IconWrapper>;

/**
 * DuplicatesIcon - أيقونة اكتشاف التكرارات.
 * @component
 * @returns {JSX.Element}
 */
export const DuplicatesIcon = () => <IconWrapper><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="m14 7 3 3 3-3"/></IconWrapper>;

/**
 * DocRoutingIcon - أيقونة توجيه المستندات.
 * @component
 * @returns {JSX.Element}
 */
export const DocRoutingIcon = () => <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6l-4 4h8l-4-4Z"/></IconWrapper>;

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </IconWrapper>
);

export const ComplianceIcon = ModuleComplianceIcon;

export const WorkflowOptIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 20.5L12 13"/>
    <path d="M12 9L12 3.5"/>
    <path d="M19.5 16.25L13 13"/>
    <path d="M19.5 7.75L13 11"/>
    <path d="M4.5 16.25L11 13"/>
    <path d="M4.5 7.75L11 11"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="19.5" cy="17.75" r="1.5" transform="rotate(90 19.5 17.75)"/>
    <circle cx="19.5" cy="6.25" r="1.5" transform="rotate(90 19.5 6.25)"/>
    <circle cx="4.5" cy="17.75" r="1.5" transform="rotate(90 4.5 17.75)"/>
    <circle cx="4.5" cy="6.25" r="1.5" transform="rotate(90 4.5 6.25)"/>
    <circle cx="12" cy="2" r="1.5" transform="rotate(90 12 2)"/>
    <circle cx="12" cy="22" r="1.5" transform="rotate(90 12 22)"/>
  </IconWrapper>
);

export const SmartReportingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M8 6h8" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 2v6h6" />
        <path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
        <path d="M17 17l-1.5-1.5" />
    </IconWrapper>
);

export const AnomalyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconWrapper>
);

export const SmartSearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="m11 5 1 1" />
        <path d="m11 13 1.8 1.8" />
        <path d="m5 11 1-1" />
    </IconWrapper>
);