import React from 'react';
import {
    DollarSign,
    Send,
    ThumbsUp,
    Megaphone,
    FileCheck2,
    MessageSquare,
    ClipboardList,
    CalendarPlus,
    FileText,
    BarChart3,
    Download,
    Edit3,
    Clock,
    PlayCircle,
    PauseCircle,
    CheckCircle2,
    Archive,
    Tag,
    UserCircle,
    Users,
    PieChart,
    SlidersHorizontal,
    UploadCloud,
    Copy,
    Trash2,
    BrainCircuit,
    FileScan,
    XOctagon,
    Edit,
    Eye,
} from 'lucide-react';
import { WhatsappIcon as WhatsappIconOriginal } from '../icons/ChannelIcons';

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


const createIcon = (LucideIcon: React.ElementType, defaultSize: number = 24) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        // A simple heuristic to check if a size is provided in the className
        const hasSize = className?.includes('w-') || className?.includes('h-');
        const finalClassName = className || `w-${Math.round(defaultSize/4)} h-${Math.round(defaultSize/4)}`;
        return <LucideIcon className={finalClassName} />;
    };
    return IconComponent;
};


export const DollarSignIcon = createIcon(DollarSign, 16);
export const PaperPlaneIcon = createIcon(Send, 16);
export const ThumbsUpIcon = createIcon(ThumbsUp, 16);
export const MegaphoneIcon = createIcon(Megaphone, 16);
export const FileClickIcon = createIcon(FileCheck2, 16);
export const MessageSquareIcon = createIcon(MessageSquare);
export const ClipboardListIcon = createIcon(ClipboardList, 16);
export const CalendarPlusIcon = createIcon(CalendarPlus, 16);
export const FileTextIcon = createIcon(FileText, 16);
export const BarChartIcon = createIcon(BarChart3, 16);
export const FileDownIcon = createIcon(Download, 16);
export const DraftIcon = createIcon(Edit3, 14);
export const ClockIcon = createIcon(Clock, 14);
export const PlayIcon = createIcon(PlayCircle, 14);
export const PauseIcon = createIcon(PauseCircle, 14);
export const CheckCircleIcon = createIcon(CheckCircle2, 14);
export const ArchiveIcon = createIcon(Archive, 14);
export const TagIcon = createIcon(Tag);
export const UserCircleIcon = createIcon(UserCircle);
export const UsersIcon = createIcon(Users);
export const SegmentIcon = createIcon(PieChart);
export const SlidersIcon = createIcon(SlidersHorizontal);
export const UploadCloudIcon = createIcon(UploadCloud);
export const DuplicateIcon = createIcon(Copy, 14);
export const TrashIcon = createIcon(Trash2, 14);
export const LearningIcon = createIcon(BrainCircuit, 14);
export const ReviewIcon = createIcon(FileScan, 14);
export const RejectedIcon = createIcon(XOctagon, 14);
export const EditIcon = createIcon(Edit, 14);
export const ViewIcon = createIcon(Eye, 14);

// Specific implementations
export const SmsIcon: React.FC<{ className?: string }> = ({ className }) => <MessageSquare className={className || "w-6 h-6"} />;
export const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => <WhatsappIconOriginal className={className} />;
