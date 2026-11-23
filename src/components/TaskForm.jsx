import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

/**
 * TaskForm Component
 * - Modal dialog matching Figma 1:279 (Create-task form: 760 × 822)
 * - Supports both Task Creation and Editing
 * - Validates required title with inline error messaging
 * - Accessible keyboard navigation (Esc to close)
 */
export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = 'create' // 'create' | 'edit'
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [status, setStatus] = useState('To do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);

  // Populate or reset form fields whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setCategory(initialData.category || 'Development');
        setStatus(initialData.status || 'To do');
        setPriority(initialData.priority || 'Medium');
        setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
      } else {
        // Default values for new task
        setTitle('');
        setDescription('');
        setCategory('Development');
        setStatus('To do');
        setPriority('Medium');
        // Default due date: 3 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        setDueDate(defaultDate.toISOString().split('T')[0]);
      }
      setError('');

      // Auto-focus title input
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialData]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    if (!title.trim()) {
      setError('Task title is required. Please enter a title.');
      titleInputRef.current?.focus();
      return;
    }

    const taskPayload = {
      ...(initialData || {}),
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      status,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    };

    onSubmit(taskPayload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card (Max width 760px matching Figma reference 1:279) */}
      <div className="relative w-full max-w-[760px] bg-white rounded-2xl shadow-modal border border-slate-200/90 z-10 overflow-hidden animate-slide-up my-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-7 border-b border-slate-100">
          <div>
            <h2 id="task-form-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'edit' ? 'Edit task' : 'Create new task'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add your task details to stay on top of your work.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Task Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              Task title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Complete React Dashboard"
              className={`w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-1.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              Description
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-y"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="task-priority" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Category & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="task-category" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Documentation">Documentation</option>
                <option value="Research">Research</option>
                <option value="Assessment">Assessment</option>
                <option value="Content">Content</option>
                <option value="Planning">Planning</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-due-date" className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Due date
              </label>
              <div className="relative">
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Required footnote */}
          <p className="text-[11px] text-slate-400">
            * Required field
          </p>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              {mode === 'edit' ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
