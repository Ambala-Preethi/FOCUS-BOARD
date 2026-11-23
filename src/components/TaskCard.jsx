import React from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical
} from 'lucide-react';

/**
 * TaskCard Component
 * Supports both:
 * - 'list' view mode (table-like clean row matching Figma 1:2)
 * - 'grid' view mode (cards matching Figma mobile 1:167)
 */
export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  viewMode = 'list'
}) {
  // Category badge styles
  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case 'design':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'development':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'content':
      case 'marketing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'planning':
      case 'documentation':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'assessment':
        return 'bg-violet-50 text-violet-700 border-violet-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Priority badge styles
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Medium':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Low':
        return 'bg-slate-100 text-slate-600 border-slate-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Cycle status on clicking status icon: To do -> In progress -> Completed -> To do
  const handleToggleStatus = () => {
    let nextStatus = 'To do';
    if (task.status === 'To do') nextStatus = 'In progress';
    else if (task.status === 'In progress') nextStatus = 'Completed';
    else if (task.status === 'Completed') nextStatus = 'To do';
    onStatusChange(task.id, nextStatus);
  };

  // Format date nicely (e.g., Nov 26)
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Render status icon
  const renderStatusIcon = () => {
    if (task.status === 'Completed') {
      return (
        <CheckCircle2
          className="w-5 h-5 text-emerald-500 hover:text-emerald-600 transition-colors"
          aria-hidden="true"
        />
      );
    }
    if (task.status === 'In progress') {
      return (
        <Clock
          className="w-5 h-5 text-brand-500 hover:text-brand-600 transition-colors"
          aria-hidden="true"
        />
      );
    }
    return (
      <Circle
        className="w-5 h-5 text-slate-300 hover:text-brand-500 transition-colors"
        aria-hidden="true"
      />
    );
  };

  /* -------------------------------------------------------------
     LIST VIEW ROW (Matching Figma Desktop 1:2)
     ------------------------------------------------------------- */
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-brand-200 hover:shadow-card transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Status Icon + Title + Description */}
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <button
            onClick={handleToggleStatus}
            title={`Status: ${task.status}. Click to cycle status.`}
            className="mt-0.5 sm:mt-0 p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label={`Current status: ${task.status}. Click to advance status.`}
          >
            {renderStatusIcon()}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate ${
                task.status === 'Completed' ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Badges + Due Date + Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category badge */}
            {task.category && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryStyle(
                  task.category
                )}`}
              >
                {task.category}
              </span>
            )}

            {/* Priority badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {/* Due date */}
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium px-2 py-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              title="Edit task"
              aria-label={`Edit ${task.title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Delete task"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     GRID CARD VIEW (Matching Figma Mobile 1:167)
     ------------------------------------------------------------- */
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-brand-200 hover:shadow-card transition-all duration-150 flex flex-col justify-between h-full">
      {/* Top: Status toggle + Title + Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <button
            onClick={handleToggleStatus}
            title={`Status: ${task.status}. Click to cycle status.`}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label={`Current status: ${task.status}. Click to advance status.`}
          >
            {renderStatusIcon()}
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              title="Edit task"
              aria-label={`Edit ${task.title}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete task"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3
          className={`text-sm sm:text-base font-bold text-slate-900 tracking-tight ${
            task.status === 'Completed' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom: Category + Priority + Due Date */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.category && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryStyle(
                task.category
              )}`}
            >
              {task.category}
            </span>
          )}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
