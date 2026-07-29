const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

import { useAuthStore } from "./auth-store";
import toast from "react-hot-toast";

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function rawFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(useAuthStore.getState().accessToken ? { Authorization: `Bearer ${useAuthStore.getState().accessToken}` } : {}),
      ...options.headers,
    },
  });
}

// Concurrent 401s (several requests failing around the same moment) share
// one in-flight /auth/refresh call instead of each firing their own.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          useAuthStore.setState({ user: null, isAuthenticated: false, accessToken: null, loading: false });
          return false;
        }
        const body = await res.json();
        useAuthStore.setState({ accessToken: body.accessToken });
        return true;
      })
      .catch(() => {
        useAuthStore.setState({ user: null, isAuthenticated: false, accessToken: null, loading: false });
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

const NO_RETRY_PATHS = ["/auth/refresh", "/auth/login", "/auth/register"];

export async function customerApiFetch<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const res = await rawFetch(path, options);

  if (res.status === 401 && !isRetry && !NO_RETRY_PATHS.includes(path)) {
    const refreshed = await tryRefresh();
    if (refreshed) return customerApiFetch<T>(path, options, true);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const errorMsg = Array.isArray(body.message) ? body.message.join(", ") : body.message ?? "Request failed";
    
    // Global 401 Handler
    if (res.status === 401) {
      // Always clear auth state when unauthorized
      useAuthStore.setState({ user: null, isAuthenticated: false, accessToken: null, loading: false });
      
      // Only force severe redirects & global toasts for blocked accounts
      if (typeof window !== "undefined" && errorMsg.toLowerCase().includes("blocked")) {
        toast.error(errorMsg, { id: "blocked-error" });
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
          // Suspend strictly so that React doesn't crash from Unhandled Exception before tearing down
          return new Promise(() => {}) as Promise<T>;
        }
      }
    }
    
    throw new ApiError(res.status, errorMsg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const customerApi = {
  get: <T>(path: string) => customerApiFetch<T>(path),
  post: <T>(path: string, data?: unknown) => customerApiFetch<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) => customerApiFetch<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => customerApiFetch<T>(path, { method: "DELETE" }),
};
