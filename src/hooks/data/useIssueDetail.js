import { useQuery } from "@tanstack/react-query";
import { getIssueByLabel } from "@/api/services/issues";

export const useIssueDetail = (issueLabel) => {
  return useQuery({
    queryKey: ["issueDetail", issueLabel],
    enabled: Boolean(issueLabel),
    queryFn: async () => {
      const data = await getIssueByLabel(issueLabel);
      return data?.issue || data?.item || data || null;
    },
  });
};
