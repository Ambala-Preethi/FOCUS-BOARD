import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * - Case-insensitive task search
 * - Live update on typing
 * - One-click clear button
 */
export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks by title or description"
        className="w-full pl-9 pr-8 py-2 bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-slate-200/90 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
