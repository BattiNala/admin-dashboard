import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addStaff,
  changeStaffTeam,
  deleteStaff,
  listStaff,
} from "@/api/services/staff";
import { toast } from "sonner";

export const useListStaff = () => {
  return useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      const data = await listStaff();
      return data.items || data || [];
    },
  });
};

export const useAddStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await addStaff(payload);
    },
    onSuccess: () => {
      toast.success("Staff member added successfully.");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add staff member.");
    },
  });
};

export const useChangeTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await changeStaffTeam(payload);
    },
    onSuccess: () => {
      toast.success("Staff team updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update team.");
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeId) => {
      return await deleteStaff(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });
};
