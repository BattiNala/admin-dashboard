import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { loadAuth } from "@/utils/authStorage";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building2,
} from "lucide-react";
import {
  VALIDATION_RULES,
  API_ERROR_MESSAGES,
  FIELD_LABELS,
  PLACEHOLDERS,
} from "@/constants/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";
import { resolveApiUrl } from "@/utils/apiUrl";

const DEPARTMENT_CREATE_RULES = {
  department_name: VALIDATION_RULES.department_name,
};

const INITIAL_DEPARTMENT_FORM = { department_name: "" };

const DepartmentsPage = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(INITIAL_DEPARTMENT_FORM, DEPARTMENT_CREATE_RULES);
  const fetchDepartments = useCallback(async () => {
    try {
      const auth = loadAuth();
      if (!auth?.access_token) {
        console.error("No valid authentication token found");
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch("/api/department/list-departments", {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      } else if (response.status === 401) {
        console.error("Unauthorized: Token may have expired");
        toast.error("Your session has expired. Please log in again.");
        onLogout();
      } else {
        console.error(
          "Failed to fetch departments:",
          response.status,
          response.statusText,
        );
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments. Please try again.");
      setDepartments([]);
    }
  }, [onLogout]);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setLoading(true);

    const auth = loadAuth();
    if (!auth?.access_token) {
      toast.error("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = {
      department_name: formData.department_name.trim(),
    };

    try {
      const response = await fetch(resolveApiUrl("/api/department/create-department"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success(data.message || "Department created successfully!");
        resetForm();
        setShowForm(false);
        // Refresh the departments list
        fetchDepartments();
      } else if (response.status === 401) {
        console.error("Unauthorized: Token may have expired");
        toast.error("Your session has expired. Please log in again.");
        onLogout();
      } else if (response.status === 400) {
        const msg =
          messageFromFastApiDetail(data.detail) ||
          "Invalid department data. Please check your input.";
        toast.error(msg);
      } else if (response.status === 409) {
        toast.error("Department with this code already exists.");
      } else if (response.status === 500) {
        console.error("Server error:", data);
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(data.detail || "Failed to create department.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(API_ERROR_MESSAGES.CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId, departmentName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${departmentName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    const auth = loadAuth();
    if (!auth?.access_token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        resolveApiUrl(`/api/department/delete-department/${departmentId}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        },
      );

      if (response.ok) {
        toast.success("Department deleted successfully!");
        fetchDepartments();
      } else if (response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        onLogout();
      } else if (response.status === 403) {
        toast.error("You don't have permission to delete departments.");
      } else if (response.status === 404) {
        toast.error("Department not found.");
      } else {
        toast.error("Failed to delete department.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete department. Please try again.");
    }
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600">
                Manage municipal infrastructure departments
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            {showForm ? "Cancel" : "Add Department"}
          </button>
        </div>

        {/* Create Department Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 shadow-blue-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Plus className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Department
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {FIELD_LABELS.department_name}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="department_name"
                    required
                    value={formData.department_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.department_name && touched.department_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={PLACEHOLDERS.department_name}
                  />
                  <Building2
                    className={`absolute left-3 top-2.5 ${
                      errors.department_name && touched.department_name
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                    size={18}
                  />
                </div>
                {errors.department_name && touched.department_name && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    {errors.department_name}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Create Department
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Departments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden shadow-blue-50/50">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Departments
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and view all municipal infrastructure departments
            </p>
          </div>

          {departments.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No departments found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first department.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Create Department
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.department_id} className="hover:bg-gray-50">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dept.department_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.created_at
                          ? new Date(dept.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              // TODO: Implement edit functionality
                              toast.info("Edit functionality coming soon");
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit department"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDepartment(
                                dept.department_id,
                                dept.department_name,
                              )
                            }
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete department"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentsPage;
