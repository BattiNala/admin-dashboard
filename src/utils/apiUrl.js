/**
 * Resolves `/api/...` paths for the backend.
 */
export function resolveApiUrl(path) {
  const base = import.meta.env.VITE_API_URL?.trim();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  const cleanBase = base.replace(/\/$/, "");
  const rest = p.replace(/^\/api/, "") || "/";
  return `${cleanBase}${rest}`;
}
