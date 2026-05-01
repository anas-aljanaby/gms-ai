
import React from 'react';

/**
 * SearchIcon - أيقونة البحث.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-gray-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

/**
 * SunIcon - أيقونة الشمس (الوضع الفاتح).
 * @component
 * @returns {JSX.Element}
 */
export const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

/**
 * MoonIcon - أيقونة القمر (الوضع الداكن).
 * @component
 * @returns {JSX.Element}
 */
export const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

/**
 * GlobeIcon - أيقونة الكرة الأرضية (اللغات).
 * @component
 * @returns {JSX.Element}
 */
export const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

/**
 * ChevronDownIcon - أيقونة السهم للأسفل.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

/**
 * MoreHorizontalIcon - أيقونة المزيد من الخيارات (ثلاث نقاط).
 * @component
 * @returns {JSX.Element}
 */
export const MoreHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
    </svg>
);

/**
 * PlusCircleIcon - أيقونة إضافة (دائرة بداخلها علامة زائد).
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-primary dark:text-secondary" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
)

/**
 * SparklesIcon - أيقونة الذكاء الاصطناعي (نجوم).
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
// FIX: Added optional title prop for accessibility.
export const SparklesIcon: React.FC<{ className?: string; title?: string }> = ({ className = "w-5 h-5", title }) => (
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
    {title && <title>{title}</title>}
    <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
    <path d="M4.5 4.5l3 3" />
    <path d="M16.5 4.5l-3 3" />
    <path d="M4.5 19.5l3-3" />
    <path d="M16.5 19.5l-3-3" />
  </svg>
);

/**
 * XIcon - أيقونة الإغلاق (علامة X).
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

/**
 * HamburgerIcon - أيقونة قائمة الهامبرغر المتحركة.
 * @component
 * @param {object} props - الخصائص.
 * @param {boolean} props.isOpen - حالة القائمة (مفتوحة/مغلقة).
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const HamburgerIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className }) => {
  const line = `h-0.5 w-full bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`;
  return (
    <div className={`relative w-6 h-6 ${className || ''}`}>
      <span className={`absolute left-0 top-[5px] ${line} ${isOpen ? 'transform rotate-45 translate-y-[7px]' : ''}`} />
      <span className={`absolute left-0 top-[12px] ${line} ${isOpen ? 'opacity-0' : ''}`} />
      <span className={`absolute left-0 top-[19px] ${line} ${isOpen ? 'transform -rotate-45 -translate-y-[7px]' : ''}`} />
    </div>
  );
};

/**
 * GridIcon - أيقونة عرض الشبكة.
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
export const GridIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

/**
 * WrenchIcon - أيقونة مفتاح الربط (تخصيص).
 * @component
 * @param {object} [props] - الخصائص.
 * @param {string} [props.className] - فئات CSS إضافية.
 * @returns {JSX.Element}
 */
// FIX: Added className prop to allow for custom styling.
export const WrenchIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);
