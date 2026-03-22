import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import {
  UserCog,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Phone,
  Lock,
  User,
  Info,
} from "lucide-react";
import {
  VALIDATION_RULES,
  FIELD_LABELS,
  PLACEHOLDERS,
} from "@/constants/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useListDepartments } from "@/hooks/department/useListDepartments";
import { useCreateDepartmentAdmin } from "@/hooks/user/useCreateDepartmentAdmin";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";

const INITIAL_DEPARTMENT_ADMIN_FORM = {
  name: "",
  email: "",
  password: "",
  phone_number: "",
  department_id: "",
};

const DEPARTMENT_ADMIN_RULES = {
  name: VALIDATION_RULES.name,
  email: VALIDATION_RULES.email,
  password: VALIDATION_RULES.password,
  phone_number: VALIDATION_RULES.phone_number,
  department_id: {
    required: true,
    validate: (v) => {
      const n = parseInt(String(v), 10);
      if (!v || String(v).trim() === "" || Number.isNaN(n) || n < 1) {
        return VALIDATION_RULES.department_id.message.required;
      }
      return "";
    },
  },
};

const inputClass = (hasError) =>
  `w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
    hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
  }`;

const UsersPage = ({ user, onLogout }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(INITIAL_DEPARTMENT_ADMIN_FORM, DEPARTMENT_ADMIN_RULES);

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
    refetch: refetchDepartments,
  } = useListDepartments();

  const { mutate: createDepartmentAdmin, isPending } =
    useCreateDepartmentAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    createDepartmentAdmin(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        department_id: formData.department_id,
      },
      {
        onSuccess: (data) => {
          toast.success(
            data?.message || "Department admin created successfully.",
          );
          resetForm();
        },
        onError: (err) => {
          const msg =
            err.message ||
            messageFromFastApiDetail(err?.data?.detail) ||
            "Something went wrong.";
          toast.error(msg);
          if (err.status === 401) onLogout?.();
        },
      },
    );
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserCog className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">
              Create department administrators who manage staff and issues for
              a department.
            </p>
          </div>
        </div>

        <div className="mt-6 mb-8 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 flex gap-3 text-sm text-blue-900">
          <Info className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-medium">Department admins vs. staff</p>
            <p className="text-blue-800/90 mt-1">
              Use this form to register a <strong>department admin</strong>{" "}
              (login + department).{" "}
              <strong>Field staff</strong> are created by a department admin
              using <span className="font-medium">Dashboard → Add Staff</span>{" "}
              — that flow calls{" "}
              <code className="text-xs bg-blue-100/80 px-1 rounded">
                POST /employee/add-staff
              </code>{" "}
              and assigns the new employee to that admin&apos;s department.
            </p>
          </div>
        </div>

        {departmentsError && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>Could not load departments.</span>
            <button
              type="button"
              onClick={() => refetchDepartments()}
              className="font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Create department admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {FIELD_LABELS.name} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(
                    errors.name && touched.name,
                  )}
                  placeholder={PLACEHOLDERS.name}
                />
                <User
                  className={`absolute left-3 top-2.5 ${
                    errors.name && touched.name
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  size={18}
                />
              </div>
              {errors.name && touched.name && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {FIELD_LABELS.email} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(
                    errors.email && touched.email,
                  )}
                  placeholder={PLACEHOLDERS.email}
                />
                <Mail
                  className={`absolute left-3 top-2.5 ${
                    errors.email && touched.email
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  size={18}
                />
              </div>
              {errors.email && touched.email && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {FIELD_LABELS.password} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClass(
                    errors.password && touched.password,
                  )} pr-11`}
                  placeholder={PLACEHOLDERS.password}
                />
                <Lock
                  className={`absolute left-3 top-2.5 ${
                    errors.password && touched.password
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  size={18}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {FIELD_LABELS.phone_number}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone_number"
                  autoComplete="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(
                    errors.phone_number && touched.phone_number,
                  )}
                  placeholder={PLACEHOLDERS.phone_number}
                />
                <Phone
                  className={`absolute left-3 top-2.5 ${
                    errors.phone_number && touched.phone_number
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  size={18}
                />
              </div>
              {errors.phone_number && touched.phone_number && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.phone_number}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {FIELD_LABELS.department_id}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={departmentsLoading || departments.length === 0}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white ${
                    errors.department_id && touched.department_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {departmentsLoading
                      ? "Loading departments…"
                      : PLACEHOLDERS.department_id}
                  </option>
                  {departments.map((d) => (
                    <option
                      key={d.department_id}
                      value={String(d.department_id)}
                    >
                      {d.department_name}
                    </option>
                  ))}
                </select>
                <Building2
                  className={`absolute left-3 top-2.5 pointer-events-none ${
                    errors.department_id && touched.department_id
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  size={18}
                />
              </div>
              {errors.department_id && touched.department_id && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.department_id}
                </div>
              )}
              {!departmentsLoading && departments.length === 0 && !departmentsError && (
                <p className="mt-2 text-sm text-amber-700">
                  No departments yet. Create departments first under{" "}
                  <Link
                    to="/superadmin/departments"
                    className="font-medium underline"
                  >
                    Departments
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={
                  isPending ||
                  departmentsLoading ||
                  departments.length === 0
                }
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Create department admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
