import { resolveApiUrl } from "@/utils/apiUrl";

/**
 * Fetch from issue endpoint with fallback URLs
 */
export const fetchIssueEndpoint = async (path, init = {}) => {
  const candidates = [
    resolveApiUrl(`/api/issue/${path}`),
    resolveApiUrl(`/api/issues/${path}`),
  ];

  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, init);
      if (response.ok || response.status !== 404) {
        return response;
      }
      lastError = new Error(`Endpoint not found: ${url}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Issue endpoint request failed");
};

/**
 * Convert data URI to Blob
 */
export const dataURItoBlob = (dataURI) => {
  try {
    const parts = dataURI.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch {
    return null;
  }
};

/**
 * Parse backend validation error details
 */
export const parseBackendError = (data) => {
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((err) => `${err.loc?.join(".")}: ${err.msg}`)
      .join(", ");
  }
  return data?.detail || data?.message || "Failed to submit issue";
};
