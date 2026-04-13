import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { loadAuth } from "@/utils/authStorage";

export const useListIssues = (
  status = null,
  priority = null,
  date_from = null,
  date_to = null,
) => {
  const auth = loadAuth();
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("issue_status", status);
  if (priority) queryParams.append("priority", priority);
  if (date_from) queryParams.append("date_from", date_from);
  if (date_to) queryParams.append("date_to", date_to);

  const queryString = queryParams.toString();
  const endpoint = `/issues${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["issues", status, priority, date_from, date_to],
    queryFn: async () => {
      const response = await apiClient.get(endpoint);
      // API returns { items: [...] }, extract the array
      return response.items || [];
    },
    enabled: !!auth?.access_token,
  });
};
