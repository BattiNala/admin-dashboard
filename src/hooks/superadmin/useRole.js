import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRole, listRoles } from "@/api/services/roles";
import { messageFromFastApiDetail } from "@/api/errors";

export const useListRoles = () => {
  return useQuery({
    queryKey: ["roleList"],
    queryFn: async () => {
      const data = await listRoles();
      // Backend might return nested roles or direct array
      return Array.isArray(data) ? data : data.roles || data.data || [];
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        return await createRole(payload);
      } catch (err) {
        throw new Error(
          messageFromFastApiDetail(err.detail) ||
            "Failed to create security role.",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
  });
};
