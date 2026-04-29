import { apiClient } from "@/api/client";

export const listStaff = () => {
  return apiClient.get("/department/list-employees");
};

export const addStaff = (payload) => {
  return apiClient.post("/employee/add-staff", {
    name: payload.name,
    email: payload.email,
    phone_number: payload.phone_number,
    team_id: parseInt(payload.team_id || 0, 10),
    current_status: payload.current_status,
  });
};

export const changeStaffTeam = (payload) => {
  return apiClient.post("/employee/change-team", payload);
};

export const deleteStaff = (employeeId) => {
  return apiClient.delete(`/employees/delete-staff/${employeeId}`);
};
