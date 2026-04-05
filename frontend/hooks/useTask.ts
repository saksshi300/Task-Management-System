"use client";
// ============================================================
// useTasks HOOK
// Manages all task state and operations in one place
// ============================================================

import { useState, useCallback } from "react";
import { Task, PaginationMeta, TaskFilters, TaskFormData } from "../types";
import * as taskApi from "../lib/tasks";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1 });

  // Load tasks from the backend
  const loadTasks = useCallback(
    async (newFilters?: TaskFilters) => {
      setLoading(true);
      try {
        const activeFilters = newFilters ?? filters;
        const data = await taskApi.fetchTasks(activeFilters);
        setTasks(data.tasks);
        setMeta(data.meta);
      } catch {
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  // Create a new task
  const addTask = async (data: TaskFormData): Promise<boolean> => {
    try {
      await taskApi.createTask(data);
      toast.success("Task created successfully! ✅");
      await loadTasks();
      return true;
    } catch {
      toast.error("Failed to create task. Please try again.");
      return false;
    }
  };

  // Update an existing task
  const editTask = async (
    id: number,
    data: Partial<TaskFormData>,
  ): Promise<boolean> => {
    try {
      const updated = await taskApi.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Task updated successfully! ✏️");
      return true;
    } catch {
      toast.error("Failed to update task. Please try again.");
      return false;
    }
  };

  // Delete a task
  const removeTask = async (id: number): Promise<boolean> => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted. 🗑️");
      // Update meta total
      setMeta((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      return true;
    } catch {
      toast.error("Failed to delete task. Please try again.");
      return false;
    }
  };

  // Toggle task status
  const toggle = async (id: number): Promise<boolean> => {
    try {
      const updated = await taskApi.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.info(
        `Task marked as ${updated.status.replace("_", " ").toLowerCase()} 🔄`,
      );
      return true;
    } catch {
      toast.error("Failed to update task status.");
      return false;
    }
  };

  // Update filters and reload
  const applyFilters = (newFilters: Partial<TaskFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    loadTasks(updated);
  };

  // Change page
  const changePage = (page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    loadTasks(updated);
  };

  return {
    tasks,
    meta,
    loading,
    filters,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    toggle,
    applyFilters,
    changePage,
  };
};
