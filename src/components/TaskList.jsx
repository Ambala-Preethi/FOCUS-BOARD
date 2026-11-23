import React from 'react';
import { TaskCard } from './TaskCard';
import { Plus, SearchX } from 'lucide-react';

/**
 * TaskList Component
 * Displays the list or grid of filtered tasks, or an empty state when no tasks match.
 */
export function TaskList({
  tasks = [],
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
  onClearFilters,
  viewMode = 'list',
  hasActiveFilters = false
}) {
  if (tasks.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <SearchX className="w-6 h-6 stroke-[1.75]" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          {hasActiveFilters
            ? 'No tasks match your current search and filter criteria. Try adjusting or clearing your filters.'
            : 'You have no tasks yet. Start planning by creating your first task.'}
        </p>

        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
            >
              Clear filters
            </button>
          )}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create new task</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4'
          : 'space-y-2.5'
      }
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
