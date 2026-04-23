
import React from 'react';
import type { EventType } from '../../types';

/**
 * IconWrapper - غلاف مشترك لأيقونات SVG.
 * @component
 * @param {object} props - الخصائص.
 * @param {React.ReactNode} props.children - عناصر SVG الداخلية.
 * @param {string} [props.className] - فئات CSS إضافية.
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
 * LectureIcon - أيقونة المحاضرة.
 * @component
 * @returns {JSX.Element}
 */
export const LectureIcon = () => (
    <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>
);

/**
 * CourseIcon - أيقونة الدورة.
 * @component
 * @returns {JSX.Element}
 */
export const CourseIcon = () => (
    <IconWrapper><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></IconWrapper>
);

/**
 * CampIcon - أيقونة المخيم.
 * @component
 * @returns {JSX.Element}
 */
export const CampIcon = () => (
    <IconWrapper><path d="M3 21l9-9 9 9-9-17Z"></path><path d="M12 21V12"></path></IconWrapper>
);

/**
 * WorkshopIcon - أيقونة ورشة العمل.
 * @component
 * @returns {JSX.Element}
 */
export const WorkshopIcon = () => (
    <IconWrapper><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></IconWrapper>
);

/**
 * ActivityIcon - أيقونة النشاط.
 * @component
 * @returns {JSX.Element}
 */
export const ActivityIcon = () => (
    <IconWrapper><path d="M20.34 17.66 12 22l-8.34-4.34a2 2 0 0 1 0-3.32L12 10l8.34 4.34a2 2 0 0 1 0 3.32Z"></path><path d="m12 10-8.34-4.34a2 2 0 0 1 0-3.32L12 2l8.34 4.34a2 2 0 0 1 0 3.32Z"></path></IconWrapper>
);

/**
 * CeremonyIcon - أيقونة الحفل.
 * @component
 * @returns {JSX.Element}
 */
export const CeremonyIcon = () => (
    <IconWrapper><path d="M12 8c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4Z"></path><path d="M12 2v4"></path><path d="M12 20v2"></path><path d="m4.93 4.93 2.83 2.83"></path><path d="m16.24 16.24 2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76-2.83-2.83"></path></IconWrapper>
);

/**
 * MeetingIcon - أيقونة الاجتماع.
 * @component
 * @returns {JSX.Element}
 */
export const MeetingIcon = () => (
    <IconWrapper><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></IconWrapper>
);

/**
 * GenericEventIcon - أيقونة الحدث العامة.
 * @component
 * @returns {JSX.Element}
 */
export const GenericEventIcon = () => (
    <IconWrapper><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></IconWrapper>
);

/**
 * eventTypeToIcon - كائن يربط نوع الحدث بمكون الأيقونة المقابل.
 * @type {Record<EventType, React.FC>}
 */
export const eventTypeToIcon: Record<EventType, React.FC> = {
    lecture: LectureIcon,
    course: CourseIcon,
    camp: CampIcon,
    workshop: WorkshopIcon,
    activity: ActivityIcon,
    ceremony: CeremonyIcon,
    meeting: MeetingIcon,
    event: GenericEventIcon,
};
