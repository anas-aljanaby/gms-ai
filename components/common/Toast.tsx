import React, { useState, useCallback, useEffect, useRef, useMemo, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { ToastContext, type Toast, type ToastType, type ToastPosition } from '../../hooks/useToast';
import { useLocalization } from '../../hooks/useLocalization';
import { CheckCircleIcon, XCircleIcon, InfoCircleIcon, WarningTriangleIcon } from '../icons/UtilityIcons';
import { XIcon } from '../icons/GenericIcons';

const TOAST_DURATION = 5000;
const MAX_TOASTS = 5;

const ICONS: Record<ToastType, React.FC<{className?: string}>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InfoCircleIcon,
  warning: WarningTriangleIcon,
};

const COLORS: Record<ToastType, { bg: string; text: string; icon: string; progress: string }> = {
  success: { bg: 'bg-green-50 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', icon: 'text-green-500', progress: 'bg-green-500/70' },
  error: { bg: 'bg-red-50 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', icon: 'text-red-500', progress: 'bg-red-500/70' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', icon: 'text-blue-500', progress: 'bg-blue-500/70' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', icon: 'text-yellow-500', progress: 'bg-yellow-500/70' },
};

const ToastMessage: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const remainingTimeRef = useRef(toast.duration || TOAST_DURATION);
  const startTimeRef = useRef(Date.now());
  const progressRef = useRef<HTMLDivElement>(null);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      remainingTimeRef.current -= (Date.now() - startTimeRef.current);
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(handleDismiss, remainingTimeRef.current);
      if (progressRef.current) {
        progressRef.current.style.animationPlayState = 'running';
        progressRef.current.style.animationDuration = `${remainingTimeRef.current}ms`;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, handleDismiss]);

  const Icon = ICONS[toast.type];
  const color = COLORS[toast.type];

  const animationClass = isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right';

  return (
    <div
      className={`relative max-w-sm w-full ${color.bg} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${animationClass}`}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${color.icon}`}>
            <Icon />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-bold ${color.text}`}>{toast.title}</p>
            <p className={`mt-1 text-sm ${color.text}`}>{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className={`inline-flex rounded-md p-1 ${color.text} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
         <div 
            ref={progressRef}
            className={`h-full ${color.progress} animate-progress`} 
            style={{ animationPlayState: isPaused ? 'paused' : 'running', animationDuration: `${remainingTimeRef.current}ms`}}
         />
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; dismiss: (id: number) => void; position: ToastPosition }> = ({ toasts, dismiss, position }) => {
  const portalRoot = document.getElementById('toast-root');
  if (!portalRoot) return null;

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'sm:items-end sm:justify-end',
    'top-left': 'sm:items-start sm:justify-start',
    'bottom-right': 'sm:items-end sm:justify-end sm:flex-col-reverse',
    'bottom-left': 'sm:items-start sm:justify-start sm:flex-col-reverse',
  }

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 z-[100] ${positionClasses[position]}`}>
      <div className="max-w-sm w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map(toast => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </div>,
    portalRoot
  );
};

export const ToastProvider: React.FC<{ children: ReactNode; position?: ToastPosition }> = ({ children, position = 'top-right' }) => {
  const { t } = useLocalization();
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);
  const [history, setHistory] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast = { ...toast, id: Date.now() + Math.random() };
    setActiveToasts(prev => [newToast, ...prev].slice(0, MAX_TOASTS));
    setHistory(prev => [newToast, ...prev].slice(0, 10));
  }, []);
  
  const showSuccess = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    addToast({ type: 'success', title: options?.title || t('toasts.successTitle', 'Success'), message, duration: options?.duration });
  }, [addToast, t]);

  const showError = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    addToast({ type: 'error', title: options?.title || t('toasts.errorTitle', 'Error'), message, duration: options?.duration });
  }, [addToast, t]);

  const showWarning = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    addToast({ type: 'warning', title: options?.title || t('toasts.warningTitle', 'Warning'), message, duration: options?.duration });
  }, [addToast, t]);

  const showInfo = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    addToast({ type: 'info', title: options?.title || t('toasts.infoTitle', 'Info'), message, duration: options?.duration });
  }, [addToast, t]);

  const dismiss = useCallback((id: number) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setActiveToasts([]);
  }, []);

  const value = useMemo(() => ({
    showSuccess, showError, showWarning, showInfo,
    dismiss, dismissAll,
    history,
    position,
  }), [showSuccess, showError, showWarning, showInfo, dismiss, dismissAll, history, position]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={activeToasts} dismiss={dismiss} position={position} />
    </ToastContext.Provider>
  );
};