import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";
import { apiClient } from "@/api/client";

export const useListTeams = () => {
  return useQuery({
    queryKey: ["teamList"],
    queryFn: async () => {
      const data = await apiClient.get("/team/list-teams");
      return Array.isArray(data) ? data : data.teams || [];
    },
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        return await apiClient.post("/team/create-team", payload);
      } catch (err) {
        const parsedError = messageFromFastApiDetail(err.detail) || "Failed to create team";
        throw new Error(parsedError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },
  });
};
