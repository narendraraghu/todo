import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchTasks, updateTask, addTask as apiAddTask, editTask as apiEditTask, deleteTask as apiDeleteTask, toggleCompletion as apiToggleCompletion } from '../services/taskService.jsx';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Move task between quadrants
  const moveTask = useCallback(async (id, newQuadrant) => {
    console.log('[TaskContext] moveTask called', id, newQuadrant);
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, quadrant: newQuadrant } : t)); // optimistic
    try {
      await updateTask(id, { quadrant: newQuadrant });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Add a new task
  const addTask = useCallback(async (task) => {
    console.log('[TaskContext] addTask called', task);
    setLoading(true);
    try {
      const newTask = await apiAddTask({ ...task, status: 'Pending' });
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set task status
  const setTaskStatus = useCallback(async (id, status) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    try {
      await apiEditTask(id, { status });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Edit a task
  const editTask = useCallback(async (id, updates) => {
    console.log('[TaskContext] editTask called', id, updates);
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t)); // optimistic
    try {
      await apiEditTask(id, updates);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Remove a task
  const removeTask = useCallback(async (id) => {
    console.log('[TaskContext] removeTask called', id);
    setTasks((prev) => prev.filter((t) => t.id !== id)); // optimistic
    try {
      await apiDeleteTask(id);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Toggle completion
  const toggleCompletion = useCallback(async (id, completed) => {
    console.log('[TaskContext] toggleCompletion called', id, completed);
    setTasks((prev) => {
      const newTasks = prev.map((t) => t.id === id ? { ...t, completed, status: completed ? 'Closed' : 'Pending' } : t);
      return newTasks;
    }); // optimistic
    try {
      await apiToggleCompletion(id, completed);
      await apiEditTask(id, { status: completed ? 'Closed' : 'Pending' });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const value = { tasks, loading, error, moveTask, addTask, editTask, removeTask, toggleCompletion, setTaskStatus };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  return useContext(TaskContext);
} 