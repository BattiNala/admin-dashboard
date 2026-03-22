import { authFetch } from "@/utils/authFetch";

// Optionally load VITE_API_URL if deployed, else rely on proxy root.
// The proxy configuration in vite.config.js perfectly aliases "/api" to http://localhost:8000/api/v1
export const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const apiClient = {
  get: async (endpoint) => {
    const res = await authFetch(`${API_BASE}${endpoint}`);
    if (res.status === 404) return []; // Auto-handling graceful fallback
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { ...err, status: res.status, ok: false };
    }
    return res.json();
  },
  
  post: async (endpoint, payload) => {
    const res = await authFetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { ...err, status: res.status, ok: false };
    }
    return res.json();
  },
  
  delete: async (endpoint) => {
    const res = await authFetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { ...err, status: res.status, ok: false };
    }
    return res.json();
  }
};
