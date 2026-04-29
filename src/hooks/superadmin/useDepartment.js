import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  deleteDepartment,
  listDepartmentAdmins,
  listDepartments,
  listEmployees,
} from "@/api/services/departments";
import { toast } from "sonner";

export const useListDepartments = () => {
  return useQuery({
    queryKey: ["departmentList"],
    queryFn: async () => {
      const data = await listDepartments();
      return data.departments || data || [];
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await createDepartment(payload);
    },
    onSuccess: () => {
      toast.success("Department created successfully.");
      queryClient.invalidateQueries({ queryKey: ["departmentList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create department.");
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await deleteDepartment(id);
    },
    onSuccess: () => {
      toast.success("Department removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["departmentList"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete department.");
    },
  });
};

export const useListDepartmentAdmins = (departmentId = null) => {
  return useQuery({
    queryKey: ["adminList", departmentId],
    queryFn: async () => {
      const data = await listDepartmentAdmins(departmentId);
      return data.items || data || [];
    },
  });
};

export const useListEmployees = () => {
  return useQuery({
    queryKey: ["employeeList"],
    queryFn: async () => {
      const data = await listEmployees();
      return data.items || data || [];
    },
  });
};
