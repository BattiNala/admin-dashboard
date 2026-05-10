import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectIssue } from "@/api/services/issues";
import { toast } from "sonner";

export const useRejectIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issue_label, reason, status }) => {
      return await rejectIssue({ issue_label, reason, status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Issue ${variables.issue_label} successfully rejected.`);
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (err) => {
      toast.error(err.detail || err.message || "Failed to reject issue.");
    },
  });
};
