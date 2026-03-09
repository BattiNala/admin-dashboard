const AUTH_STORAGE_KEY = "admin-dashboard-auth";

const ACCESS_TTL_MS = 23.5 * 60 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

export const saveAuth = ({
  access_token,
  refresh_token,
  role_name,
  is_verified,
}) => {
  if (!canUseStorage()) return null;
  if (!access_token || !refresh_token) return null;

  const now = Date.now();
  const payload = {
    access_token,
    refresh_token,
    role_name,
    is_verified: Boolean(is_verified),
    access_expires_at: now + ACCESS_TTL_MS,
    refresh_expires_at: now + REFRESH_TTL_MS,
    stored_at: now,
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

export const updateTokens = ({ access_token, refresh_token }) => {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    const now = Date.now();

    const updated = {
      ...data,
      access_token: access_token || data.access_token,
      refresh_token: refresh_token || data.refresh_token,
      access_expires_at: now + ACCESS_TTL_MS,
      refresh_expires_at: now + REFRESH_TTL_MS,
      stored_at: now,
    };

    if (!updated.access_token || !updated.refresh_token) {
      clearAuth();
      return null;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    clearAuth();
    return null;
  }
};

export const clearAuth = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const loadAuth = () => {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    const now = Date.now();

    if (!data?.refresh_expires_at || now > data.refresh_expires_at) {
      clearAuth();
      return null;
    }

    if (!data?.access_expires_at || now > data.access_expires_at) {
      clearAuth();
      return null;
    }

    return {
      ...data,
      role: data.role_name || data.role,
    };
  } catch (error) {
    clearAuth();
    return null;
  }
};
