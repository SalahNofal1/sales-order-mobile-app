import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type ToastPayload = {
  type: ToastType;
  title?: string;
  message: string;
  durationMs?: number;
};

type ToastState = (ToastPayload & { id: number }) | null;

type ToastContextType = {
  toast: ToastState;
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const idRef = useRef(0);

  const showToast = useCallback((payload: ToastPayload) => {
    idRef.current += 1;
    setToast({ ...payload, id: idRef.current });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(() => ({ toast, showToast, hideToast }), [toast, showToast, hideToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

