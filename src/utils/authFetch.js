import { loadAuth, updateTokens } from "@/utils/authStorage";
import { resolveApiUrl } from "@/utils/apiUrl";

const DEFAULT_REFRESH_ENDPOINT = "/api/auth/refresh";

const prepareInit = (init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Authorization")) {
    const auth = loadAuth();
    const token = auth?.access_token;
    if (token) {
      const authHeader = `Bearer ${token}`;
      headers.set("Authorization", authHeader);
    }
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

  // Convert Headers to plain object for better compatibility
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

  let refreshData = null;
  try {
    refreshData = await refreshResponse.json();
  } catch (error) {
    return response;
  }

  updateTokens({
    access_token: refreshData?.access_token,
    refresh_token: refreshData?.refresh_token,
  });

  const retryInit = prepareInit(init);
  return fetch(url, retryInit);
};
