import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastSnackbarProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastSnackbar: React.FC<ToastSnackbarProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />
  };

  const bgMap = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-900/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-rose-900/10',
    warning: 'bg-white border-amber-200 text-slate-800 shadow-amber-900/10',
    info: 'bg-white border-blue-200 text-slate-800 shadow-blue-900/10'
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2.5 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all ${
            bgMap[toast.type]
          } animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-slate-900">{toast.title}</h4>
            {toast.message && (
              <p className="mt-0.5 text-xs text-slate-600 leading-snug font-medium">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
