// ============================================================
// TASK API FUNCTIONS (lib/tasks.ts)
// All functions that talk to the backend task endpoints
// ============================================================

import api from "./api";
import {
  Task,
  PaginationMeta,
  ApiResponse,
  TaskFormData,
  TaskFilters,
} from "../types";

interface TasksResponse {
  tasks: Task[];
  meta: PaginationMeta;
}

// GET /tasks - Fetch tasks with optional filters
export const fetchTasks = async (
  filters: TaskFilters = {},
): Promise<TasksResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.search) params.append("search", filters.search);

  const res = await api.get<ApiResponse<TasksResponse>>(
    `/tasks?${params.toString()}`,
  );
  return res.data.data!;
};

// POST /tasks - Create a new task
export const createTask = async (data: TaskFormData): Promise<Task> => {
  const res = await api.post<ApiResponse<{ task: Task }>>("/tasks", data);
  return res.data.data!.task;
};

// GET /tasks/:id - Get a single task
export const fetchTask = async (id: number): Promise<Task> => {
  const res = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
  return res.data.data!.task;
};

// PATCH /tasks/:id - Update a task
export const updateTask = async (
  id: number,
  data: Partial<TaskFormData>,
): Promise<Task> => {
  const res = await api.patch<ApiResponse<{ task: Task }>>(
    `/tasks/${id}`,
    data,
  );
  return res.data.data!.task;
};

// DELETE /tasks/:id - Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// PATCH /tasks/:id/toggle - Toggle task status
export const toggleTask = async (id: number): Promise<Task> => {
  const res = await api.patch<ApiResponse<{ task: Task }>>(
    `/tasks/${id}/toggle`,
  );
  return res.data.data!.task;
};
