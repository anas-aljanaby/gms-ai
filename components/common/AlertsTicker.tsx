import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { Alert } from '../../types';
import { XIcon } from '../icons/GenericIcons';

interface AlertsTickerProps {
  alerts: Alert[];
  speed?: number;
  pauseOnHover?: boolean;
  onAlertClick: (alert: Alert) => void;
  onAlertDismiss: (alertId: string) => void;
}

const AlertsTicker: React.FC<AlertsTickerProps> = ({
  alerts,
  speed = 50,
  pauseOnHover = true,
  onAlertClick,
  onAlertDismiss,
}) => {
  const { t, dir, language } = useLocalization();
  const tickerContentRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState('0s');

  const priorityConfig = {
    high: { icon: '🔴', classes: 'border-red-500 bg-red-50 dark:bg-red-900/20' },
    medium: { icon: '🟡', classes: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
    low: { icon: '🔵', classes: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  };

  const displayedAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

  useEffect(() => {
    if (tickerContentRef.current) {
      const contentWidth = tickerContentRef.current.scrollWidth / 2; // We duplicate the content for a seamless loop
      const duration = contentWidth / speed;
      setAnimationDuration(`${duration}s`);
    }
  }, [displayedAlerts, speed, language]);

  const TickerItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const config = priorityConfig[alert.priority];
    const alertText = alert.text[language] || alert.text.en;
    return (
      <button
        className={`flex items-center text-left gap-3 px-4 py-2 mx-2 rounded-full border-l-4 cursor-pointer hover:shadow-md transition-shadow ${config.classes}`}
        onClick={() => onAlertClick(alert)}
      >
        <span className="text-lg" aria-hidden="true">{config.icon}</span>
        <span className="text-sm font-medium text-foreground dark:text-dark-foreground">{alertText}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAlertDismiss(alert.id);
          }}
          className="ml-2 rtl:ml-0 rtl:mr-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700"
          aria-label={`${t('common.dismissAlert')}: ${alertText}`}
        >
          <XIcon className="w-4 h-4" />
        </button>
      </button>
    );
  };

  if (displayedAlerts.length === 0) {
    return null;
  }

  return (
    <div className={`alerts-ticker-container bg-card/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-full shadow-inner p-1 ${pauseOnHover ? 'pause-on-hover' : ''}`}>
      <div
        ref={tickerContentRef}
        className="alerts-ticker-content"
        style={{ animationDuration }}
      >
        {/* Duplicate content for seamless loop */}
        {displayedAlerts.map(alert => <TickerItem key={alert.id} alert={alert} />)}
        {displayedAlerts.map(alert => <TickerItem key={`${alert.id}-clone`} alert={alert} />)}
      </div>
    </div>
  );
};

export default AlertsTicker;