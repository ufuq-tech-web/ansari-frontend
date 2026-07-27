"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { customerApi } from "./customer-api";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  walletBalance: number;
}

interface AuthState {
  user: CustomerUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ requiresVerification: boolean }>;
  verifyRegistration: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/login", { email, password });
    set({ user: res.user, isAuthenticated: true, accessToken: res.accessToken });
  },

  googleLogin: async (token) => {
    const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/google", { token });
    set({ user: res.user, isAuthenticated: true, accessToken: res.accessToken });
  },

  register: async (email, password, name, phone) => {
    const res = await customerApi.post<{ requiresVerification?: boolean; accessToken?: string; user?: CustomerUser }>("/auth/register", { email, password, name, phone });
    if (res.requiresVerification) {
      return { requiresVerification: true };
    }
    set({ user: res.user!, isAuthenticated: true, accessToken: res.accessToken! });
    return { requiresVerification: false };
  },

  verifyRegistration: async (email, otp) => {
    const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/verify-registration", { email, otp });
    set({ user: res.user, isAuthenticated: true, accessToken: res.accessToken });
  },

  logout: async () => {
    try {
      await customerApi.post("/auth/logout");
    } catch {
      // Best effort removal
    }
    set({ user: null, isAuthenticated: false, accessToken: null, loading: false });
  },

  silentRefresh: async () => {
    try {
      const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/refresh");
      set({ user: res.user, isAuthenticated: true, accessToken: res.accessToken, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, accessToken: null, loading: false });
    }
  },
}));

// Component wrapper to initiate silent refresh on app load
export function AuthInit() {
  const silentRefresh = useAuthStore((state) => state.silentRefresh);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (loading) {
      silentRefresh();
    }
  }, [loading, silentRefresh]);

  return null;
}
