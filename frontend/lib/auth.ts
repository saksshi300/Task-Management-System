// ============================================================
// AUTH HELPERS (lib/auth.ts)
// Functions for login, register, logout, and token management
// ============================================================

import api from "./api";
import { User, ApiResponse, AuthTokens } from "../types";

interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Save tokens to localStorage after login/register
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// Save user info to localStorage
export const saveUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get the currently logged-in user from localStorage
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/register", {
    name,
    email,
    password,
  });
  const data = res.data.data!;
  saveTokens(data.accessToken, data.refreshToken);
  saveUser(data.user);
  return data;
};

// Log in
export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/login", {
    email,
    password,
  });
  const data = res.data.data!;
  saveTokens(data.accessToken, data.refreshToken);
  saveUser(data.user);
  return data;
};

// Log out
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    // Always clear local data even if API call fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Get current user from API (fresh data)
export const fetchCurrentUser = async (): Promise<User> => {
  const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  return res.data.data!.user;
};
