import React from 'react';
import { Plus, Menu } from 'lucide-react';

/**
 * FocusBoard Header Component matching Figma frames 1:2 & 1:167
 * - Breadcrumbs / Workspace indicator
 * - Avatar with initials (JD)
 * - Heading: "Your work, in focus."
 * - Subtitle: "Plan your day, stay organized, and get more done."
 * - Primary Action: "+ New task" CTA button
 * - Mobile hamburger trigger
 */
export function Header({ onOpenCreateModal, onOpenMobileMenu }) {
  return (
    <header className="w-full mb-6">
      {/* Top Bar: Breadcrumb + User Profile Avatar (matching Figma desktop 1:2) */}
      <div className="flex items-center justify-between py-3 border-b border-slate-200/60 mb-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-700 cursor-pointer transition-colors">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Overview</span>
          </nav>
        </div>

        {/* User Profile Avatar matching Figma ('JD') */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200/80 flex items-center justify-center text-brand-600 font-bold text-xs tracking-wider shadow-2xs hover:ring-2 hover:ring-brand-400/40 transition-all cursor-pointer"
            title="Logged in as John Doe (JD)"
            aria-label="User Profile: John Doe"
          >
            JD
          </div>
        </div>
      </div>

      {/* Hero Title & Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your work, in focus.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plan your day, stay organized, and get more done.
          </p>
        </div>

        {/* "+ New task" button */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New task</span>
        </button>
      </div>
    </header>
  );
}
