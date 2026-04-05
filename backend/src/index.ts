import express, { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

/* -------------------- Interfaces -------------------- */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface TaskQuery {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
  priority?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/* -------------------- Express Server -------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example route
app.get("/", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "Backend is running successfully!",
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
