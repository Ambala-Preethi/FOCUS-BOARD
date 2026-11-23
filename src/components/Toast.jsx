import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Provides instant user feedback on task creation, edits, and deletions.
 */
export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 text-xs sm:text-sm font-medium animate-slide-up max-w-sm"
    >
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
      {isError && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-4 h-4 text-brand-500 shrink-0" />}

      <span className="flex-1 truncate">{toast.message}</span>

      <button
        onClick={onDismiss}
        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
