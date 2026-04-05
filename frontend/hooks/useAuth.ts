"use client";
// ============================================================
// useAuth HOOK
// A custom React hook to manage authentication state
// Hooks = reusable logic you can share across components
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { getStoredUser, isAuthenticated, logoutUser } from "../lib/auth";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, check if user is already logged in
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch {
      // Clear local state even if API fails
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return { user, setUser, loading, logout, isLoggedIn: !!user };
};
