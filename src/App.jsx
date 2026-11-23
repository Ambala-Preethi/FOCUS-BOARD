import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FocusNotes } from './components/FocusNotes';
import { Filters } from './components/Filters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  Plus
} from 'lucide-react';

/**
 * FocusBoard Main Application
 * 
 * Implements:
 * - Single source of truth for tasks via useLocalStorage
 * - Derived overview statistics
 * - Combined Search + Status Tab + Priority filtering pipeline
 * - Create, Edit, Delete, and Status update modal workflows
 * - Focus Notes Carousel matching Figma
 * - Full responsive layout for 1440px desktop, 768px tablet, 390px mobile
 */
export function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetToSampleTasks
  } = useLocalStorage();

  // Navigation & Drawer State
  const [activeNav, setActiveNav] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Modal Dialogs State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // User Feedback Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Dynamic status counts for filter badges
  const statusCounts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'To do').length,
      inProgress: tasks.filter(t => t.status === 'In progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
    };
  }, [tasks]);

  // Derived filtered & searched task list
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Case-insensitive title/description search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      // 2. Status tab filter
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

      // 3. Priority dropdown filter
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchQuery.trim() || statusFilter !== 'All' || priorityFilter !== 'All'
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  // Create Task Flow
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleCreateTask = (newTaskData) => {
    const created = addTask(newTaskData);
    showToast(`Task "${created.title}" created successfully!`, 'success');
  };

  // Edit Task Flow
  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleUpdateTask = (updatedData) => {
    updateTask(updatedData);
    showToast(`Task "${updatedData.title}" updated successfully!`, 'success');
  };

  // Delete Task Flow
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    deleteTask(taskId);
    showToast(`Task "${taskToDelete?.title || 'item'}" deleted.`, 'info');
  };

  // Status Change Flow
  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
    showToast(`Status updated to "${newStatus}".`, 'success');
  };

  // Reset to Sample Data
  const handleResetData = () => {
    resetToSampleTasks();
    showToast('Reset tasks to default sample dataset.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        taskCount={tasks.length}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 md:pb-12">
        {/* Header */}
        <Header
          onOpenCreateModal={handleOpenCreateModal}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Focus Notes Carousel (matching Figma frames 15:2, 15:30, 15:58) */}
        <FocusNotes />

        {/* Dynamic Overview Statistics Cards (Total, In Progress, Completed, Completion %) */}
        <StatsCards tasks={tasks} />

        {/* Task Management Section ("My tasks") */}
        <section aria-label="Task Management" className="w-full mt-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                My tasks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage and track everything in one place.
              </p>
            </div>
            {tasks.length > 0 && (
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} shown
              </span>
            )}
          </div>

          {/* Search, Status Tabs, and Priority Filters */}
          <Filters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusCounts={statusCounts}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Task List / Grid matching Figma layout */}
          <TaskList
            tasks={filteredTasks}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onStatusChange={handleStatusChange}
            onOpenCreateModal={handleOpenCreateModal}
            onClearFilters={handleClearFilters}
            viewMode={viewMode}
            hasActiveFilters={hasActiveFilters}
          />
        </section>
      </main>

      {/* Mobile Floating Action Button for Quick Task Creation */}
      <button
        onClick={handleOpenCreateModal}
        className="md:hidden fixed bottom-20 right-5 z-40 w-13 h-13 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40 flex items-center justify-center active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-brand-300"
        aria-label="Create new task"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Mobile Bottom Navigation Bar matching Figma 1:167 */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg"
      >
        {[
          { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'Tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'Calendar', label: 'Calendar', icon: Calendar },
          { id: 'Settings', label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <span className="w-4 h-0.5 bg-brand-500 rounded-full -mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Create / Edit Task Modal Dialog */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={formMode === 'create' ? handleCreateTask : handleUpdateTask}
        initialData={selectedTask}
        mode={formMode}
      />

      {/* Delete Confirmation Modal Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        task={deletingTask}
      />

      {/* Toast Feedback Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export default App;
