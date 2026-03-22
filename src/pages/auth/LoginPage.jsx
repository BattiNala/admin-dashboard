// pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginUser } from "@/hooks/user/useLoginUser";
import { saveAuth } from "@/utils/authStorage";
import { loginSchema } from "@/schemas/loginSchema";

export default function LoginPage({ setUser, accessDenied = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: loginUser, isPending: isLoggingIn } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (formData) => {
    loginUser(
      {
        username: formData.username.trim(),
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          const roleName = data?.role_name || data?.role || "";
          const isAllowed = roleName === "superadmin" || roleName === "department_admin";
          
          const dept = data?.department;
          const departmentId = data?.department_id ?? dept?.department_id ?? dept?.id;
          const departmentName = data?.department_name ?? dept?.department_name ?? dept?.name ?? "";
          const displayName = data?.full_name ?? data?.name ?? data?.username ?? "";

          const authInfo = {
            access_token: data?.access_token,
            refresh_token: data?.refresh_token,
            role_name: roleName,
            is_verified: data?.is_verified,
            name: displayName,
            username: data?.username,
            department_id: departmentId,
            department_name: departmentName || undefined,
          };

          const storedAuth = saveAuth(authInfo);
          
          if (setUser) {
            setUser({
              ...data,
              ...(storedAuth || {}),
              role: roleName,
              name: displayName || undefined,
              department_id: departmentId,
              department_name: departmentName || undefined,
            });
          }

          if (isAllowed) {
            toast.success("Authentication successful. Welcome back!");
            navigate(roleName === "superadmin" ? "/superadmin" : "/");
          } else {
            toast.error("Account does not have admin permissions.");
            navigate("/login", { replace: true });
          }
        },
        onError: (err) => {
          if (err?.status === 401) {
            toast.error("Invalid credentials provided. Please check and try again.");
          } else if (err?.status === 429) {
            toast.error("Too many attempts. Security cooldown active.");
          } else {
            toast.error(err?.message || "Internal connection error. Please try later.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden font-outfit">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-3xl opacity-60" />

      <div className="w-full max-w-xl p-6 sm:p-10 z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-12 transform hover:scale-105 transition-transform duration-500 cursor-default">
           <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-blue-100 flex items-center justify-center border border-blue-50 mb-6 group">
             <img
                src="/batti-nala.png"
                alt="Logo"
                className="w-16 h-16 object-contain group-hover:rotate-12 transition-transform duration-300"
              />
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
             Batti Nala <span className="text-blue-600">Admin</span>
           </h1>
           <p className="mt-3 text-gray-400 font-medium text-lg">Central Infrastructure Command</p>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-50/80 p-10 sm:p-14 space-y-10 relative">
          
          {accessDenied && (
            <div className="p-5 bg-red-50/50 rounded-3xl border border-red-100 flex items-center gap-4 animate-bounce-short">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-900">
                Unauthorized entry attempt detected for this user role.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Sign In</h2>
            <p className="text-gray-400 font-medium text-sm">Enter your credentials to access the secure dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Username/Email Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Email Address / Username</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("username")}
                    placeholder="e.g. admin@battinala.gov or username"
                    disabled={isLoggingIn}
                    className={`w-full pl-16 pr-8 py-5 bg-gray-50/50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-lg font-bold text-gray-900 placeholder:text-gray-200 ${errors.username ? 'ring-2 ring-red-100 bg-red-50/10' : ''}`}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-[11px] font-bold pl-2">{errors.username.message}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Passcode</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoggingIn}
                    className={`w-full pl-16 pr-16 py-5 bg-gray-50/50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-lg font-bold text-gray-900 placeholder:text-gray-200 ${errors.password ? 'ring-2 ring-red-100 bg-red-50/10' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[11px] font-bold pl-2">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl tracking-wider hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group overflow-hidden"
            >
              {isLoggingIn ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ShieldCheck size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400 font-medium tracking-tight italic">
              Official Government Administration Node — Kathmandu, Nepal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
