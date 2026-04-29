import { resolveApiUrl } from "@/api/client";
import { parseBackendError } from "@/api/errors";

const issueEndpointCandidates = (path) => [
  `/api/issue/${path}`,
  `/api/issues/${path}`,
];

export const fetchIssueEndpoint = async (path, init = {}) => {
  let lastError = null;

  for (const candidate of issueEndpointCandidates(path)) {
    try {
      const response = await fetch(resolveApiUrl(candidate), init);
      if (response.ok || response.status !== 404) {
        return response;
      }
      lastError = new Error(`Endpoint not found: ${candidate}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Issue endpoint request failed");
};

export const getIssueTypes = async () => {
  const response = await fetchIssueEndpoint("get-issue-types", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseBackendError(data) || "Failed to load issue types");
  }

  return data;
};

export const createAnonymousIssue = async (formData) => {
  const response = await fetchIssueEndpoint("anon-create", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseBackendError(data) || "Failed to submit issue");
  }

  return data;
};
