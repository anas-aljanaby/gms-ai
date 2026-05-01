
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
 * BronzeIcon - أيقونة المستوى البرونزي.
 * @component
 * @returns {JSX.Element}
 */
export const BronzeIcon: React.FC = () => (
    <IconWrapper className="w-6 h-6 text-[#cd7f32]">
        <defs><linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#b08d57"/><stop offset="100%" stopColor="#7a5c2f"/></linearGradient></defs>
        <path fill="url(#bronze)" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
);

/**
 * SilverIcon - أيقونة المستوى الفضي.
 * @component
 * @returns {JSX.Element}
 */
export const SilverIcon: React.FC = () => (
    <IconWrapper className="w-6 h-6 text-gray-400">
        <defs><linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#a0a0a0"/></linearGradient></defs>
        <path fill="url(#silver)" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
);

/**
 * GoldIcon - أيقونة المستوى الذهبي.
 * @component
 * @returns {JSX.Element}
 */
export const GoldIcon: React.FC = () => (
    <IconWrapper className="w-6 h-6 text-yellow-500">
        <defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffd700"/><stop offset="100%" stopColor="#f0c400"/></linearGradient></defs>
        <path fill="url(#gold)" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
);

/**
 * PlatinumIcon - أيقونة المستوى البلاتيني.
 * @component
 * @returns {JSX.Element}
 */
export const PlatinumIcon: React.FC = () => (
    <IconWrapper className="w-6 h-6 text-cyan-400">
        <defs><linearGradient id="platinum" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e5e4e2"/><stop offset="100%" stopColor="#d4d4d2"/></linearGradient></defs>
        <path fill="url(#platinum)" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </IconWrapper>
);
