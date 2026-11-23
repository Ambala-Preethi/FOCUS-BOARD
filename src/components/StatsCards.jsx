import React from 'react';
import { ClipboardList, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * FocusBoard Overview Statistics Cards
 * 
 * Dynamically calculated derived state from live tasks:
 * 1. Total tasks
 * 2. In progress
 * 3. Completed
 * 4. Completion Percentage (with animated visual progress bar)
 *
 * Meets strict requirement: Never hardcode statistics!
 */
export function StatsCards({ tasks = [] }) {
  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    {
      id: 'total',
      label: 'Total tasks',
      count: total,
      subtext: 'Across all projects',
      icon: ClipboardList,
      iconBg: 'bg-brand-50 text-brand-600 border border-brand-100/60',
    },
    {
      id: 'in-progress',
      label: 'In progress',
      count: inProgress,
      subtext: 'Currently active tasks',
      icon: Clock,
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100/60',
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completed,
      subtext: 'Done and delivered',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100/60',
    },
    {
      id: 'completion-rate',
      label: 'Completion',
      count: `${completionPercentage}%`,
      subtext: `${completed} of ${total} finished`,
      icon: TrendingUp,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100/60',
      progressBar: completionPercentage,
    },
  ];

  return (
    <section aria-label="Dashboard Statistics Overview" className="w-full mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              {/* Header: Icon + Label */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  {stat.label}
                </span>
              </div>

              {/* Number and Subtext */}
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.count}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  {stat.subtext}
                </p>

                {/* Progress bar if applicable */}
                {stat.progressBar !== undefined && (
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${stat.progressBar}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
