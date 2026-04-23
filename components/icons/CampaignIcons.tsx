
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-8 h-8" }) => (
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

export const ThankYouIcon: React.FC = () => (
    <IconWrapper><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></IconWrapper>
);

export const ImpactIcon: React.FC = () => (
    <IconWrapper><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></IconWrapper>
);

export const RequestIcon: React.FC = () => (
    <IconWrapper><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></IconWrapper>
);

export const WinBackIcon: React.FC = () => (
    <IconWrapper><path d="M15 15H3v-2h12v-2l4 3-4 3v-2z"></path><path d="M19.65 10.66A8 8 0 1 0 10 18"></path></IconWrapper>
);

export const MilestoneIcon: React.FC = () => (
    <IconWrapper><path d="M12 2L9 9h6l-3-7z"></path><path d="M17 21v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"></path><path d="M12 15h.01"></path><path d="M12 5l-2.5 5.5"></path><path d="M12 5l2.5 5.5"></path></IconWrapper>
);
