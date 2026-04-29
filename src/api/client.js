import { loadAuth, updateTokens } from "@/utils/authStorage";

// Optional VITE_API_URL; fall back to /api proxy in development.
export const API_BASE = import.meta.env.VITE_API_URL?.trim() || "/api";

export const resolveApiUrl = (path) => {
  if (!path) return API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const cleanBase = API_BASE.replace(/\/$/, "");

  if (normalized.startsWith("/api/")) {
    if (API_BASE === "/api") return normalized;
    return `${cleanBase}${normalized.slice(4)}`;
  }

  return `${cleanBase}${normalized}`;
};

const DEFAULT_REFRESH_ENDPOINT = "/api/auth/refresh";

const prepareInit = (init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Authorization")) {
    const auth = loadAuth();
    const token = auth?.access_token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    ...init,
    headers,
  };
};

export const authFetch = async (
  input,
  init = {},
  { refreshEndpoint = DEFAULT_REFRESH_ENDPOINT } = {},
) => {
  const url = typeof input === "string" ? resolveApiUrl(input) : input;
  const baseInit = prepareInit(init);

  const fetchInit = {
    ...baseInit,
    headers: Object.fromEntries(baseInit.headers.entries()),
  };

  const response = await fetch(url, fetchInit);
  if (response.status !== 401) {
    return response;
  }

  const auth = loadAuth();
  if (!auth?.refresh_token) {
    return response;
  }

  const refreshResponse = await fetch(resolveApiUrl(refreshEndpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: auth.refresh_token }),
  });

  if (!refreshResponse.ok) {
    return response;
  }

  try {
    const refreshData = await refreshResponse.json();
    const { access_token, refresh_token } = refreshData;

    updateTokens({ access_token, refresh_token });

    const retryInit = prepareInit(init);
    const retryFetchInit = {
      ...retryInit,
      headers: Object.fromEntries(retryInit.headers.entries()),
    };

    return await fetch(url, retryFetchInit);
  } catch (error) {
    return response;
  }
};

const parseJsonSafely = async (response) => {
  return response.json().catch(() => ({}));
};

export const apiClient = {
  get: async (endpoint) => {
    const res = await authFetch(resolveApiUrl(endpoint));
    if (res.status === 404) return [];
    if (!res.ok) {
      const err = await parseJsonSafely(res);
      throw { ...err, status: res.status, ok: false };
    }
    return parseJsonSafely(res);
  },

  post: async (endpoint, payload) => {
    const res = await authFetch(resolveApiUrl(endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await parseJsonSafely(res);
      throw { ...err, status: res.status, ok: false };
    }
    return parseJsonSafely(res);
  },

  delete: async (endpoint) => {
    const res = await authFetch(resolveApiUrl(endpoint), {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await parseJsonSafely(res);
      throw { ...err, status: res.status, ok: false };
    }
    return parseJsonSafely(res);
  },

  raw: async (endpoint, init = {}) => {
    return authFetch(resolveApiUrl(endpoint), init);
  },
};
