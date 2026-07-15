"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminApi, getAdminToken, setAdminToken, clearAdminToken } from "./admin-api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .get<AdminUser>("/auth/me")
      .then((me) => setUser(me))
      .catch(() => clearAdminToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.post<{ accessToken: string; user: AdminUser }>("/auth/login", { email, password });
    if (res.user.role !== "ADMIN") {
      throw new Error("This account does not have admin access");
    }
    setAdminToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setUser(null);
  }, []);

  return <AdminAuthContext.Provider value={{ user, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
