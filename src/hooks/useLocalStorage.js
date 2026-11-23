import { useState, useEffect } from 'react';
import { SAMPLE_TASKS } from '../data/sampleTasks';

const STORAGE_KEY = 'focusboard_tasks_v1';
const INITIALIZED_KEY = 'focusboard_initialized_v1';

/**
 * Custom React Hook for safe browser localStorage synchronization.
 *
 * Guarantees:
 * 1. Restores user tasks from localStorage on first mount.
 * 2. Only seeds SAMPLE_TASKS if the storage key has never been initialized.
 * 3. Never overwrites existing user data (even an empty task list `[]`) upon refresh.
 * 4. Safely encapsulates JSON serialization/deserialization with try-catch blocks.
 * 5. Provides predictable, immutable state update callbacks.
 */
export function useLocalStorage() {
  const [tasks, setTasks] = useState(() => {
    try {
      const isInitialized = window.localStorage.getItem(INITIALIZED_KEY);
      const savedTasksJson = window.localStorage.getItem(STORAGE_KEY);

      if (isInitialized && savedTasksJson !== null) {
        const parsed = JSON.parse(savedTasksJson);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      // First run: seed with sample tasks and flag as initialized
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
      window.localStorage.setItem(INITIALIZED_KEY, 'true');
      return SAMPLE_TASKS;
    } catch (error) {
      console.warn('Failed to access browser localStorage; falling back to memory state:', error);
      return SAMPLE_TASKS;
    }
  });

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      window.localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  /**
   * Add a newly created task immutably to the beginning of the list.
   */
  const addTask = (newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: `fb-task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  /**
   * Update an existing task immutably.
   */
  const updateTask = (updatedTask) => {
    setTasks(prev =>
      prev.map(t => (t.id === updatedTask.id ? { ...t, ...updatedTask, updatedAt: new Date().toISOString() } : t))
    );
  };

  /**
   * Remove a task immutably by its ID.
   */
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  /**
   * Fast toggle / status transition for a task.
   */
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );
  };

  /**
   * Manually reset tasks back to sample data.
   */
  const resetToSampleTasks = () => {
    setTasks(SAMPLE_TASKS);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
      window.localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    resetToSampleTasks
  };
}
