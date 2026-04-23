
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

export const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>;
export const XCircleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></IconWrapper>;
export const InfoCircleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></IconWrapper>;
export const WarningTriangleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconWrapper>;

// New Icons for Beneficiary Detail View
export const GraduationCapIcon: React.FC<{className?: string}> = ({className}) => (
    <IconWrapper className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3.33 1.67 6.67 1.67 10 0v-5"></path></IconWrapper>
);
export const DollarSignCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <IconWrapper className={className}><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></IconWrapper>
);
export const MessagesIcon: React.FC<{className?: string}> = ({className}) => (
    <IconWrapper className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></IconWrapper>
);
export const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (
    <IconWrapper className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></IconWrapper>
);
export const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => (
    <IconWrapper className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>
);

// New Icons for Event Page
export const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></IconWrapper> );
export const UserIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconWrapper> );
export const TagIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M12.586 2.586a2 2 0 0 0-2.828 0L2 10.172V20h9.828l7.586-7.586a2 2 0 0 0 0-2.828z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></IconWrapper> );
export const CalendarDaysIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></IconWrapper> );
export const ClockIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></IconWrapper> );
export const CircleDollarSignIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></IconWrapper> );
export const CheckIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><polyline points="20 6 9 17 4 12"/></IconWrapper> );

// New Icons for Event Page Objectives & Agenda
export const TargetIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></IconWrapper> );
export const LightbulbIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7a6 6 0 0 0-12 0c0 2 1.3 3.2 2.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></IconWrapper> );
export const HandshakeIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m5 15 2.5-2.5a1 1 0 1 1 3 3L8 18"/><path d="M9 11.5 11 13"/><path d="m13 12.5 2-2a1 1 0 1 0-3-3l-2.5 2.5"/><path d="m15 6 3.4-3.4a1 1 0 1 1 3 3L18 9"/></IconWrapper> );
export const BookOpenIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconWrapper> );
export const CoffeeIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h8z"/><path d="M6 2v4a2 2 0 0 1 2 2h4a2 2 0 0 1 2-2V2"/></IconWrapper> );

// New Icons for QR Code functionality
export const QrCodeIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h.01"/><path d="M21 12h.01"/><path d="M12 21h.01"/></IconWrapper> );
export const DownloadIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></IconWrapper> );
export const CopyIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconWrapper> );
export const PrinterIcon: React.FC<{className?: string}> = ({className}) => ( <IconWrapper className={className}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></IconWrapper> );


// Social Sharing Icons
const SocialIconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-5 h-5" }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
        {children}
    </svg>
);
export const FacebookIcon: React.FC<{className?: string}> = ({className}) => <SocialIconWrapper className={className}><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></SocialIconWrapper>;
export const TwitterIcon: React.FC<{className?: string}> = ({className}) => <SocialIconWrapper className={className}><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></SocialIconWrapper>;
export const LinkedInIcon: React.FC<{className?: string}> = ({className}) => <SocialIconWrapper className={className}><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11-4.125 0 2.062 2.062 0 014.125 0zM3.275 9h3.554v11.452H3.275V9zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></SocialIconWrapper>;
export const WhatsappIcon: React.FC<{className?: string}> = ({className}) => <SocialIconWrapper className={className}><title>WhatsApp</title><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.51 7.23c.27-.13.59-.22.86-.23.23 0 .42.01.58.01.32 0 .61.07.82.47.24.42.79 1.93.79 2.08s.01.28-.08.43c-.09.15-.31.39-.42.48-.11.09-.23.14-.39.19-.15.05-.33.04-.48-.01l-.22-.07-1.04-.39c-1.12-.42-1.92-1.04-2.5-1.76-.17-.22-.35-.48-.48-.73-.13-.25-.26-.53-.26-.81 0-.25.1-.48.24-.64.19-.22.42-.28.56-.28.11 0 .22.01.32.02z"/></SocialIconWrapper>;
