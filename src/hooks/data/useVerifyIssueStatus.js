import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyIssueStatus } from "@/api/services/issues";
import { toast } from "sonner";

export const useVerifyIssueStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issue_label, status }) => {
      return await verifyIssueStatus({ issue_label, status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Issue ${variables.issue_label} successfully verified.`);
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (err) => {
      toast.error(err.detail || err.message || "Failed to verify issue status.");
    },
  });
};
