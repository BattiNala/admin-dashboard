import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";

export const useListDepartments = () => {
  return useQuery({
    queryKey: ["departmentList"],
    queryFn: async () => {
      const data = await apiClient.get("/department/list-departments");
      return data.departments || [];
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        return await apiClient.post("/department/create-department", payload);
      } catch (err) {
        throw new Error(
          messageFromFastApiDetail(err.detail) || "Failed to create department",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departmentList"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        return await apiClient.delete(`/department/delete-department/${id}`);
      } catch (err) {
        throw new Error(
          messageFromFastApiDetail(err.detail) || "Failed to delete department",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departmentList"] });
    },
  });
};
export const useListDepartmentAdmins = (departmentId = null) => {
  return useQuery({
    queryKey: ["departmentAdminList", departmentId],
    queryFn: async () => {
      const url = departmentId
        ? `/department/list-department-admins?department_id=${departmentId}`
        : "/department/list-department-admins";
      const data = await apiClient.get(url);
      return Array.isArray(data) ? data : data.admins || [];
    },
  });
};

export const useListEmployees = () => {
  return useQuery({
    queryKey: ["employeeList"],
    queryFn: async () => {
      const data = await apiClient.get("/department/list-employees");
      return Array.isArray(data) ? data : data.employees || [];
    },
  });
};
