import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  Settings,
  X,
  RotateCcw
} from 'lucide-react';

/**
 * FocusBoard Sidebar Navigation matching official Figma frames (1:2 & 1:167)
 * - Brand logo & name
 * - Navigation links with active indicator
 * - Reset to sample data button
 * - Mobile responsive drawer overlay
 */
export function Sidebar({
  activeNav = 'Overview',
  setActiveNav,
  mobileOpen = false,
  setMobileOpen,
  taskCount = 0,
  onResetData
}) {
  const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Tasks', label: 'My tasks', icon: CheckSquare, badge: taskCount },
    { id: 'FocusNotes', label: 'Focus Notes', icon: Sparkles },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    if (setActiveNav) setActiveNav(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      {/* Top: Logo & Navigation */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* 4-dots grid icon in purple squircle matching Figma */}
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm shadow-brand-500/20 text-white shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="5.5" height="5.5" rx="1.5" fill="white" />
                <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5" fill="white" />
                <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5" fill="white" />
                <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5" fill="white" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">FocusBoard</span>
              <p className="text-[11px] font-medium text-slate-400">Workspace</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="mt-6 mb-2 px-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            DASHBOARD
          </span>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main navigation" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-100 text-brand-600 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Sample Data Reset & Version */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {onResetData && (
          <button
            onClick={onResetData}
            title="Reset to default sample tasks"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-brand-600 hover:bg-brand-50/70 rounded-lg transition-colors border border-dashed border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>
        )}
        <div className="px-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>FocusBoard v1.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System operational" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Drawer (visible when hamburger menu clicked) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-slide-up">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
