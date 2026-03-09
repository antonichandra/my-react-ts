import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, type ToastType, type ToastPosition } from '../components/ui/Toast';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  position: ToastPosition;
  duration: number;
}

interface ToastContextType {
  showToast: (options: {
    type: ToastType;
    title: string;
    message?: string;
    position?: ToastPosition;
    duration?: number;
  }) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(({
    type,
    title,
    message,
    position = 'top-right',
    duration = 5000,
  }: {
    type: ToastType;
    title: string;
    message?: string;
    position?: ToastPosition;
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, position, duration }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          position={toast.position}
          duration={toast.duration}
          onClose={hideToast}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
