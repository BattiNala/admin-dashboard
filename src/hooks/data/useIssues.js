import { useQuery } from "@tanstack/react-query";
import { listIssues } from "@/api/services/issues";

export const useListIssues = (
  status = null,
  priority = null,
  date_from = null,
  date_to = null,
) => {
  return useQuery({
    queryKey: ["issues", status, priority, date_from, date_to],
    queryFn: async () => {
      const data = await listIssues({
        status,
        priority,
        date_from,
        date_to,
      });
      return data.items || data || [];
    },
  });
};
