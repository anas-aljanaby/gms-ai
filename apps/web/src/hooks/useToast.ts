import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showSuccess: (message: string, options?: { title?: string; duration?: number }) => void;
  showError: (message: string, options?: { title?: string; duration?: number }) => void;
  showWarning: (message: string, options?: { title?: string; duration?: number }) => void;
  showInfo: (message: string, options?: { title?: string; duration?: number }) => void;
  dismiss: (id: number) => void;
  dismissAll: () => void;
  history: Toast[];
  position: ToastPosition;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
