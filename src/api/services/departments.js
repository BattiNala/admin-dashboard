import { apiClient } from "@/api/client";

export const listDepartments = () => {
  return apiClient.get("/department/list-departments");
};

export const createDepartment = (payload) => {
  return apiClient.post("/department/create-department", payload);
};

export const deleteDepartment = (id) => {
  return apiClient.delete(`/department/delete-department/${id}`);
};

export const listDepartmentAdmins = (departmentId = null) => {
  const endpoint = departmentId
    ? `/department/list-department-admins?department_id=${departmentId}`
    : "/department/list-department-admins";
  return apiClient.get(endpoint);
};

export const listEmployees = () => {
  return apiClient.get("/department/all-employees");
};

export const createDepartmentAdmin = (payload) => {
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    phone_number: payload.phone_number,
    department_id: parseInt(payload.department_id, 10),
  };

  return apiClient.post("/department/add-department-admin", body);
};
