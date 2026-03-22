import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";

export const useListRoles = () => {
  return useQuery({
    queryKey: ["roleList"],
    queryFn: async () => {
      const data = await apiClient.get("/role/list-roles");
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
        return await apiClient.post("/role/create-role", payload);
      } catch (err) {
        throw new Error(messageFromFastApiDetail(err.detail) || "Failed to create security role.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
  });
};
