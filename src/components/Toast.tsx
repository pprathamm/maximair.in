import React from 'react';

export interface ToastItem {
  id: string;
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'cart';
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-[#00231b] text-white rounded-xl shadow-2xl border border-white/10 text-xs font-bold transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-2"
        >
          <span className="material-symbols-outlined text-[#59fdc5] text-base">
            {toast.icon || 'check_circle'}
          </span>
          <span>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss toast"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
