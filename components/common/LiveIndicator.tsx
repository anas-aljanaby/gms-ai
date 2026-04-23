import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import Tooltip from './Tooltip';
import { RefreshCw } from 'lucide-react';

export type LiveIndicatorStatus = 'live' | 'updating' | 'offline' | 'delayed';

interface LiveIndicatorProps {
    status: LiveIndicatorStatus;
    lastUpdate: Date;
    onRefresh: () => void;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ status, lastUpdate, onRefresh }) => {
    const { t } = useLocalization();

    const timeSince = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)}y ago`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)}mo ago`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)}d ago`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)}h ago`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)}m ago`;
        return `${Math.floor(seconds)}s ago`;
    };

    const config: Record<LiveIndicatorStatus, { color: string; animation: string; text: string; icon?: React.ReactNode }> = {
        live: {
            color: 'bg-green-500',
            animation: 'animate-pulse-fast',
            text: t('liveIndicator.live'),
        },
        updating: {
            color: 'bg-blue-500',
            animation: '',
            text: t('liveIndicator.updating'),
            icon: <RefreshCw className="w-3 h-3 text-white animate-spin" />,
        },
        offline: {
            color: 'bg-red-500',
            animation: '',
            text: t('liveIndicator.offline'),
        },
        delayed: {
            color: 'bg-yellow-500',
            animation: '',
            text: t('liveIndicator.delayed', { time: timeSince(lastUpdate) }),
        },
    };
    
    const { color, animation, text, icon } = config[status];

    return (
        <Tooltip text={text}>
            <button
                onClick={onRefresh}
                className="flex items-center justify-center w-5 h-5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={text}
            >
                {status === 'updating' ? (
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center ${color}`}>
                        {icon}
                    </div>
                ) : (
                    <div className={`w-3 h-3 rounded-full ${color} ${animation}`}></div>
                )}
            </button>
        </Tooltip>
    );
};

export default LiveIndicator;
