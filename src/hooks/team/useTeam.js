import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listTeams, createTeam } from "@/api/services/teams";
import { toast } from "sonner";

export const useListTeams = () => {
  return useQuery({
    queryKey: ["teamList"],
    queryFn: async () => {
      const data = await listTeams();
      return data.teams || data.items || data || [];
    },
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await createTeam(payload);
    },
    onSuccess: () => {
      toast.success("Team created successfully.");
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create team.");
    },
  });
};
