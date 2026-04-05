// ============================================================
// TYPES & INTERFACES
// Think of these as "blueprints" describing the shape of data
// ============================================================

import { Request } from "express";

// Extends Express Request to include our logged-in user info
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

// What a user looks like in our system
export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

// Data needed to register a new user
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// Data needed to log in
export interface LoginInput {
  email: string;
  password: string;
}

// Data needed to create/update a task
export interface TaskInput {
  title: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}

// Query parameters for filtering/searching tasks
export interface TaskQuery {
  page?: string;
  limit?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  search?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

// Standard API response shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

// Pagination metadata
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
