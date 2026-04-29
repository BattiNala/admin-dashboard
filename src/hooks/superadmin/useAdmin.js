import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartmentAdmin } from "@/api/services/departments";
import { toast } from "sonner";

export const useCreateDepartmentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await createDepartmentAdmin(payload);
    },
    onSuccess: () => {
      toast.success("Department Administrator successfully established.");
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to establish administrator account.");
    },
  });
};
