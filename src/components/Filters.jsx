import React from 'react';
import { ChevronDown, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { SearchBar } from './SearchBar';

/**
 * FocusBoard Filters Component
 * 
 * Combines:
 * - Status Tabs: All, To do, In progress, Completed (with dynamic counts)
 * - Search input
 * - Priority Filter dropdown: All, Low, Medium, High
 * - View mode toggle: List (rows) / Grid (cards)
 */
export function Filters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  statusCounts = {},
  viewMode = 'list',
  setViewMode
}) {
  const tabs = [
    { id: 'All', label: 'All tasks', count: statusCounts.all || 0 },
    { id: 'To do', label: 'To do', count: statusCounts.todo || 0 },
    { id: 'In progress', label: 'In progress', count: statusCounts.inProgress || 0 },
    { id: 'Completed', label: 'Completed', count: statusCounts.completed || 0 },
  ];

  return (
    <div className="w-full mb-5 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3">
      {/* Left: Status Filter Tabs Capsule */}
      <div
        role="tablist"
        aria-label="Filter tasks by status"
        className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full"
      >
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-white text-brand-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Search + Priority Dropdown + View Toggle */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Priority Filter Dropdown */}
        <div className="relative shrink-0">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter tasks by priority"
            className="appearance-none bg-white text-slate-700 text-xs sm:text-sm font-medium pl-3 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-all"
          >
            <option value="All">Priority: All</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* View Mode Toggle (Grid / List) */}
        {setViewMode && (
          <div className="hidden sm:inline-flex items-center p-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              title="List view matching Figma table rows"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Switch to list view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid card view"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
