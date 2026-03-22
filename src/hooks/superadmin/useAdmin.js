import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";

export const useCreateDepartmentAdmin = () => {
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const departmentId = parseInt(payload.department_id, 10);
        
        // Final backend mapping before dispatching
        const body = {
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          phone_number: payload.phone_number,
          department_id: departmentId,
        };

        return await apiClient.post("/department/add-department-admin", body);
      } catch (err) {
        let msg = messageFromFastApiDetail(err?.detail) || "Failed to create department admin account.";
        
        // Handle specific duplicate conflict cases from DB
        if (err.status === 400 && msg.toLowerCase().includes("email already exists")) {
            msg = "A user with this email address is already registered in the system.";
        }
        
        throw new Error(msg);
      }
    },
  });
};
