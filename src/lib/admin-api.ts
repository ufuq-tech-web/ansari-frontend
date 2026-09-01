const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "ansari_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function handleRefresh(): Promise<string | null> {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include" })
    .then(async (res) => {
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdminToken(data.accessToken);
      return data.accessToken as string;
    })
    .catch(() => {
      clearAdminToken();
      if (typeof window !== "undefined") window.location.href = "/admin/login";
      return null;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = (currentToken: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...options.headers,
      },
    });

  let token = getAdminToken();
  let res = await makeRequest(token);

  if (res.status === 401 && path !== "/auth/login" && path !== "/auth/refresh") {
    token = await handleRefresh();
    if (token) {
      res = await makeRequest(token);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, Array.isArray(body.message) ? body.message.join(", ") : body.message ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const makeRequest = (currentToken: string | null) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined,
      body: formData,
    });

  let token = getAdminToken();
  let res = await makeRequest(token);

  if (res.status === 401 && path !== "/auth/login" && path !== "/auth/refresh") {
    token = await handleRefresh();
    if (token) {
      res = await makeRequest(token);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, Array.isArray(body.message) ? body.message.join(", ") : body.message ?? "Request failed");
  }

  return res.json();
}

export const adminApi = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, data?: unknown) => apiFetch<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) => apiFetch<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) => apiFetch<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => apiUpload<T>(path, formData),
};
