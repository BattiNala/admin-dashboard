import { apiClient } from "@/api/client";

export const listIssues = ({ status, priority, date_from, date_to } = {}) => {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("issue_status", status);
  if (priority) queryParams.append("priority", priority);
  if (date_from) queryParams.append("date_from", date_from);
  if (date_to) queryParams.append("date_to", date_to);

  const queryString = queryParams.toString();
  const endpoint = `/issues/${queryString ? `?${queryString}` : ""}`;
  return apiClient.get(endpoint);
};

export const verifyIssueStatus = ({ issue_label, status }) => {
  return apiClient.post("/issues/verify-status", { issue_label, status });
};
