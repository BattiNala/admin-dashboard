// pages/superadmin/UsersPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCog,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Fingerprint,
  Trash2,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import {
  useListDepartments,
  useListDepartmentAdmins,
} from "@/hooks/superadmin/useDepartment";
import { useCreateDepartmentAdmin } from "@/hooks/superadmin/useAdmin";
import { adminSchema } from "@/schemas/adminSchema";

export default function UsersPage({ user, onLogout }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useListDepartments();
  const {
    data: allAdmins = [],
    isLoading: adminsLoading,
    isError: adminsError,
  } = useListDepartmentAdmins();
  const { mutate: createAdmin, isPending: creating } =
    useCreateDepartmentAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_number: "",
      department_id: "",
    },
  });

  const onSubmit = (data) => {
    createAdmin(data, {
      onSuccess: (result) => {
        toast.success(
          result?.message ||
            "Department Administrator successfully established.",
        );
        reset();
        setShowForm(false);
      },
      onError: (err) => {
        toast.error(
          err.message || "Failed to establish administrator account.",
        );
      },
    });
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Department Admins
            </h1>
            <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
              Create and Manage the department admins.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 shadow-lg shadow-blue-100 ${
              showForm
                ? "bg-white border border-gray-100 text-gray-400 hover:text-red-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showForm ? <AlertCircle size={20} /> : <Plus size={20} />}
            {showForm ? "Cancel Entry" : "Create New Admin"}
          </button>
        </div>

        {departmentsError && (
          <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex items-center gap-4 text-red-900 animate-bounce-short">
            <AlertCircle size={24} className="text-red-500" />
            <div className="text-sm font-bold">
              Critical Connection Error: Infrastructure department nodes could
              not be retrieved.
              <span className="block text-xs font-medium text-red-700 mt-1 opacity-80">
                Security provisioning requires an active department link.
              </span>
            </div>
          </div>
        )}

        {/* Creation Form - Conditional */}
        {showForm && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100/50 p-10 transform animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4 mb-10 relative">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <ShieldAlert className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Provision New Admin
              </h2>
            </div>

            {departmentsLoading ? (
              <div className="py-20 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-200 animate-spin mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  Loading...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 relative max-w-2xl"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                      Admin Name
                    </label>
                    <div className="relative group/input">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        {...register("name")}
                        placeholder="Ramesh Shrestha"
                        className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 ${errors.name ? "ring-2 ring-red-100" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                      Email Identifier
                    </label>
                    <div className="relative group/input">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="ramesh@battinala.gov"
                        className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 ${errors.email ? "ring-2 ring-red-100" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                      Password
                    </label>
                    <div className="relative group/input">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 ${errors.password ? "ring-2 ring-red-100" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                      Contact
                    </label>
                    <div className="relative group/input">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        {...register("phone_number")}
                        placeholder="9841234567"
                        className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 ${errors.phone_number ? "ring-2 ring-red-100" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                      Department
                    </label>
                    <div className="relative group/input">
                      <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/input:text-blue-600 transition-colors pointer-events-none" />
                      <select
                        {...register("department_id")}
                        className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 appearance-none ${errors.department_id ? "ring-2 ring-red-100" : ""}`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.department_id} value={d.department_id}>
                            {d.department_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg tracking-widest hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 mt-6"
                >
                  {creating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  {creating ? "Creating..." : "Create Admin"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Administrators List */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 flex flex-col min-h-150 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <Fingerprint size={18} />
              Department Admin Registry
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto max-h-175">
            {adminsLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-blue-100 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  Loading Admins...
                </p>
              </div>
            ) : adminsError || allAdmins.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-24 text-center px-10">
                <ShieldAlert className="w-16 h-16 text-gray-100 mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mx-auto leading-loose">
                  No department admins created yet.
                  <br />
                  Create a new account to begin governance.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {allAdmins.map((admin) => {
                  const dept = departments.find(
                    (d) => d.department_id === admin.department_id,
                  );
                  return (
                    <div
                      key={admin.id || admin.email}
                      className="group p-8 flex items-start justify-between hover:bg-blue-50/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-6 text-left flex-1">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:border-blue-100 group-hover:scale-105 transition-all shadow-sm shrink-0">
                          <User
                            className="text-gray-400 group-hover:text-blue-600 transition-colors"
                            size={24}
                          />
                        </div>
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">
                              {admin.full_name || admin.name || admin.username}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                              {admin.employee_id ? `Employee ID: ${admin.employee_id}` : `ID: ${admin.id}`}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
                              {dept?.department_name || admin.department_name || "Unknown"}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                              <Mail size={12} className="text-gray-300" />{" "}
                              {admin.email}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                              <Phone size={12} className="text-gray-300" />{" "}
                              {admin.phone_number || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
