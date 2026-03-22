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
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useListDepartments } from "@/hooks/superadmin/useDepartment";
import { useCreateDepartmentAdmin } from "@/hooks/superadmin/useAdmin";
import { adminSchema } from "@/schemas/adminSchema";

export default function UsersPage({ user, onLogout }) {
  const [showPassword, setShowPassword] = useState(false);
  const { data: departments = [], isLoading: departmentsLoading, isError: departmentsError } = useListDepartments();
  const { mutate: createAdmin, isPending: creating } = useCreateDepartmentAdmin();

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
        toast.success(result?.message || "Department Administrator successfully established.");
        reset();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to establish administrator account.");
      },
    });
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="space-y-3 px-2">
          <div className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100 shadow-sm mb-4">
            <UserCog className="text-blue-600 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Access Control</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
            Provision new Department Administrators. These users command infrastructure response teams and manage regional personnel.
          </p>
        </div>

        {departmentsError && (
          <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex items-center gap-4 text-red-900 animate-bounce-short">
            <AlertCircle size={24} className="text-red-500" />
            <div className="text-sm font-bold">
              Critical Connection Error: Infrastructure department nodes could not be retrieved. 
              <span className="block text-xs font-medium text-red-700 mt-1 opacity-80">Security provisioning requires an active department link.</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 p-12 relative">
          
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-blue-50/50 rounded-2xl">
               <ShieldAlert className="text-blue-600" size={24} />
             </div>
             <h2 className="text-2xl font-black text-gray-900">Administrator Provisioning</h2>
          </div>

          {departmentsLoading ? (
            <div className="py-24 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-200 animate-spin mb-6" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Department Databases...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Legal Designation</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      {...register("name")}
                      placeholder="e.g. Ramesh Shrestha"
                      className={`w-full pl-16 pr-8 py-5 bg-gray-50/80 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.name ? 'ring-2 ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Security Email Node</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="ramesh@battinala.gov"
                      className={`w-full pl-16 pr-8 py-5 bg-gray-50/80 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.email ? 'ring-2 ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Security Passcode</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full pl-16 pr-16 py-5 bg-gray-50/80 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.password ? 'ring-2 ring-red-100' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.password.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Registry Contact</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      {...register("phone_number")}
                      placeholder="9841234567"
                      className={`w-full pl-16 pr-8 py-5 bg-gray-50/80 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.phone_number ? 'ring-2 ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.phone_number && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.phone_number.message}</p>}
                </div>
              </div>

              {/* Department Select */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Command Sector Assignment</label>
                <div className="relative group">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <select
                    {...register("department_id")}
                    disabled={departments.length === 0}
                    className={`w-full pl-16 pr-8 py-5 bg-gray-50/80 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 appearance-none disabled:opacity-50 ${errors.department_id ? 'ring-2 ring-red-100' : ''}`}
                  >
                    <option value="">Select Department Node</option>
                    {departments.map(d => (
                      <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                    ))}
                  </select>
                </div>
                {errors.department_id && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.department_id.message}</p>}
                {departments.length === 0 && !departmentsLoading && !departmentsError && (
                   <p className="text-xs font-bold text-amber-600 p-4 bg-amber-50 rounded-2xl flex items-center gap-3">
                     <AlertCircle size={16} />
                     Access Denied: No available departmental nodes. Establish a department before provisioning admins.
                   </p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={creating || departmentsLoading}
                  className="w-full flex items-center justify-center gap-4 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl tracking-wider hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 group"
                >
                  {creating ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                      Provision Administrator
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
