"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { customerApi, setAccessToken } from "./customer-api";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

interface AuthContextValue {
  user: CustomerUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The access token only ever lives in memory, so a hard reload always
    // starts with none — silently trade the httpOnly refresh cookie (if any)
    // for a fresh one before deciding whether the visitor is signed in.
    customerApi
      .post<{ accessToken: string; user: CustomerUser }>("/auth/refresh")
      .then((res) => {
        setAccessToken(res.accessToken);
        setUser(res.user);
      })
      .catch(() => {
        // No valid session cookie — that's a normal logged-out state, not an error.
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/login", { email, password });
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const res = await customerApi.post<{ accessToken: string; user: CustomerUser }>("/auth/register", { email, password, name, phone });
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await customerApi.post("/auth/logout");
    } catch {
      // Best-effort — clear local state regardless of whether the server call succeeded.
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
