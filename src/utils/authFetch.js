import { loadAuth, updateTokens } from "@/utils/authStorage";

const DEFAULT_REFRESH_ENDPOINT = "/api/v1/auth/refresh";

const prepareInit = (init = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Authorization")) {
    const token = loadAuth()?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
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
  { refreshEndpoint = DEFAULT_REFRESH_ENDPOINT } = {}
) => {
  const baseInit = prepareInit(init);
  const response = await fetch(input, baseInit);
  if (response.status !== 401) {
    return response;
  }

  const auth = loadAuth();
  if (!auth?.refresh_token) {
    return response;
  }

  const refreshResponse = await fetch(refreshEndpoint, {
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
  return fetch(input, retryInit);
};
