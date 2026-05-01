import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-8 h-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {children}
  </svg>
);

export const GoogleAdsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path fill="#4285F4" d="M21.1,12.5l-6.7,6.3c-0.6,0.6-1.6,0.6-2.2,0l-6.7-6.3c-0.6-0.6-0.6-1.5,0-2.1L12.2,4c0.6-0.6,1.6-0.6,2.2,0l6.7,6.3C21.7,11,21.7,11.9,21.1,12.5z"/>
        <path fill="#F4B400" d="M12.2,4L5.5,10.4c-0.6,0.6-0.6,1.5,0,2.1l6.7,6.3c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l6.7-6.3c0.6-0.6,0.6-1.5,0-2.1L14.4,4C13.8,3.4,12.8,3.4,12.2,4z"/>
        <path fill="#DB4437" d="M5.5,10.4l6.7,6.3c0.6,0.6,1.6,0.6,2.2,0l6.7-6.3L14.4,4c-0.6-0.6-1.6-0.6-2.2,0L5.5,10.4z"/>
        <path fill="#0F9D58" d="M12.2,4l6.7,6.3c0.6,0.6,0.6,1.5,0,2.1L12.2,18.8c-0.6,0.6-1.6,0.6-2.2,0L3.3,12.5c-0.6-0.6-0.6-1.5,0-2.1L9.9,4C10.5,3.4,11.5,3.4,12.2,4z"/>
    </IconWrapper>
);
