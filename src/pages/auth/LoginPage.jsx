import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginUser } from "@/hooks/user/useLoginUser";
import { saveAuth } from "@/utils/authStorage";

function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  name,
  disabled = false,
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    />
  );
}

function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
}

const LoginCard = ({ setUser, accessDenied = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const { mutate: loginUser, isPending: isLoggingIn } = useLoginUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    loginUser(
      {
        username: form.username.trim(),
        password: form.password,
      },
      {
        onSuccess: (data) => {
          const roleName = data?.role_name || data?.role || "";
          const isAllowedRole =
            roleName === "superadmin" || roleName === "department_admin";
          const dept = data?.department;
          const departmentId =
            data?.department_id ?? dept?.department_id ?? dept?.id;
          const departmentName =
            data?.department_name ?? dept?.department_name ?? dept?.name ?? "";
          const displayName =
            data?.full_name ?? data?.name ?? data?.username ?? "";
          const storedAuth = saveAuth({
            access_token: data?.access_token,
            refresh_token: data?.refresh_token,
            role_name: roleName,
            is_verified: data?.is_verified,
            name: displayName,
            username: data?.username,
            department_id: departmentId,
            department_name: departmentName || undefined,
          });
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
          if (isAllowedRole) {
            toast.success("Logged in successfully! Welcome back.");
            navigate(roleName === "superadmin" ? "/superadmin" : "/");
          } else {
            toast.error("Access restricted to approved roles.");
            navigate("/login", { replace: true });
          }
        },
        onError: (err) => {
          if (err?.status === 401) {
            toast.error("Invalid username or password.");
            setForm({ username: "", password: "" });
            setErrors({});
            return;
          }
          if (err?.status === 429) {
            toast.error(
              "Too many attempts. Please wait a few minutes and try again.",
            );
            return;
          }
          toast.error(err?.message || "Unable to sign in. Please try again.");
        },
      },
    );
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center sm:px-8 sm:py-10">
          <div className="flex justify-center mb-4">
            <img
              src="/batti-nala.png"
              alt="BattiNala Logo"
              className="w-14 h-14 object-contain drop-shadow-lg sm:w-16 sm:h-16"
            />
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {accessDenied && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm text-center">
              Your account does not have access to this portal. Please contact
              your administrator.
            </div>
          )}

          {accessDenied ? (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                This portal is restricted to approved roles only.
              </p>
              <button
                type="button"
                onClick={() => setUser?.(null)}
                className="mt-6 w-full py-3 px-4 flex items-center justify-center gap-2 font-medium text-white rounded-lg transition-all bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              >
                Switch Account
              </button>
            </div>
          ) : (
            <>
              {(errors.username || errors.password) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                  Please fix the highlighted fields and try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Username */}
                <div>
                  <Label htmlFor="username">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                      disabled={isLoggingIn}
                      className={`pl-11 ${
                        errors.username
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={isLoggingIn}
                      className={`pl-11 pr-11 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoggingIn}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={`w-full py-3 px-4 flex items-center justify-center gap-2 font-medium text-white rounded-lg transition-all ${
                    isLoggingIn
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }`}
                >
                  {isLoggingIn ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
            <p className="mt-2">
              Need help? Contact support at{" "}
              <span className="text-blue-600">support@battinala.gov.np</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
