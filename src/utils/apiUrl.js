/**
 * Resolves `/api/...` paths for the backend.
 *
 * - **Default (no env):** returns a relative path like `/api/department/...` so the
 *   browser hits the Vite dev/preview server, which proxies to FastAPI (see `vite.config.js`).
 * - **VITE_API_URL** (e.g. `http://localhost:8000/api/v1`): calls the backend directly.
 *   Your FastAPI app must allow CORS for the frontend origin (e.g. `http://localhost:5173`).
 */
export function resolveApiUrl(path) {
  const base = import.meta.env.VITE_API_URL?.trim();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  const cleanBase = base.replace(/\/$/, "");
  const rest = p.replace(/^\/api/, "") || "/";
  return `${cleanBase}${rest}`;
}
