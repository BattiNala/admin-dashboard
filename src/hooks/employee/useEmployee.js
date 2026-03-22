import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";
import { apiClient } from "@/api/client";

export const useListStaff = () => {
  return useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      const data = await apiClient.get("/employee/list-staff");
      return Array.isArray(data) ? data : data.employees || data.staff || [];
    },
  });
};

export const useAddStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        return await apiClient.post("/employee/add-staff", {
          ...payload,
          team_id: payload.team_id ? parseInt(payload.team_id, 10) : null,
        });
      } catch (err) {
        const parsedError = messageFromFastApiDetail(err.detail) || "Failed to create staff member";
        throw new Error(parsedError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });
};

export const useChangeTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        return await apiClient.post("/employee/change-team", payload);
      } catch (err) {
        const parsedError = messageFromFastApiDetail(err.detail) || "Failed to update team";
        throw new Error(parsedError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeId) => {
      try {
        return await apiClient.delete(`/employee/delete-staff/${employeeId}`);
      } catch (err) {
        const parsedError = messageFromFastApiDetail(err.detail) || "Failed to delete staff member";
        throw new Error(parsedError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });
};
