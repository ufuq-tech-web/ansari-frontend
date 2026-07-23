const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// Access token lives in memory only (never localStorage) — the refresh
// token is an httpOnly cookie the browser manages on its own, invisible to
// JS. A hard reload loses this in-memory value, so AuthProvider silently
// calls /auth/refresh on mount to get a fresh one back before rendering
// anything gated on auth state.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
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
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
        if (!res.ok) return false;
        const body = await res.json();
        accessToken = body.accessToken;
        return true;
      })
      .catch(() => false)
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
    throw new ApiError(res.status, Array.isArray(body.message) ? body.message.join(", ") : body.message ?? "Request failed");
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
