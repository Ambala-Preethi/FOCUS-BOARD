import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Accessible Delete Confirmation Modal
 * Uses role="alertdialog" to prevent accidental destructive operations.
 */
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  task
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-200/90 z-10 p-6 overflow-hidden animate-slide-up">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Trash2 className="w-5 h-5 stroke-[2]" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cancel deletion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900 tracking-tight">
          Delete task?
        </h3>
        <p id="delete-dialog-desc" className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-slate-700 font-semibold">"{task.title}"</strong>? This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
