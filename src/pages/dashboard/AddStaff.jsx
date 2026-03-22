// pages/dashboard/AddStaffPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Loader2, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useAddStaff } from "@/hooks/employee/useEmployee";
import { useListTeams } from "@/hooks/team/useTeam";
import { staffSchema } from "@/schemas/staffSchema";

export default function AddStaffPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { data: teams = [], isLoading: loadingTeams } = useListTeams();
  const { mutate: addStaff, isPending: submitting } = useAddStaff();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      team_id: "",
      current_status: "available",
    },
  });

  const onSubmit = (data) => {
    addStaff(
      {
        ...data,
        phone_number: data.phone_number?.trim() || undefined,
        team_id: data.team_id ? parseInt(data.team_id, 10) : undefined,
      },
      {
        onSuccess: (result) => {
          toast.success(result.message || "Personnel successfully registered.");
          reset();
          // Optional redirect back to list
          setTimeout(() => navigate("/dashboard/staff"), 2000);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to register personnel.");
        },
      }
    );
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Link 
            to="/dashboard/staff" 
            className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Link>
        </div>

        <div>
           <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 mb-6">
             <UserPlus className="w-8 h-8 text-white" />
           </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Register Personnel
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            Onboard new response staff for active dispatch across municipal sectors.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100/50 p-10 space-y-8"
        >
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Full Legal Name
              </label>
              <input
                {...register("name")}
                className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all text-lg font-medium text-gray-900 placeholder:text-gray-300 ${errors.name ? 'ring-2 ring-red-500/20 bg-red-50/20' : ''}`}
                placeholder="e.g. Ramesh Shrestha"
              />
              {errors.name && <p className="text-red-500 text-xs font-bold pl-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Official Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all text-lg font-medium text-gray-900 placeholder:text-gray-300 ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50/20' : ''}`}
                placeholder="ramesh@battinala.gov"
              />
              {errors.email && <p className="text-red-500 text-xs font-bold pl-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Contact Number
                </label>
                <input
                  {...register("phone_number")}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all text-lg font-medium text-gray-900 placeholder:text-gray-300"
                  placeholder="+977 98XXXXXXX"
                />
              </div>

               {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Current Status
                </label>
                <select
                  {...register("current_status")}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white appearance-none transition-all text-lg font-medium text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy / On Case</option>
                  <option value="off_duty">Off Duty</option>
                </select>
              </div>
            </div>

            {/* Team Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Team Unit Assignment
              </label>
              <div className="relative">
                <select
                  {...register("team_id")}
                  disabled={loadingTeams}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white appearance-none transition-all text-lg font-medium text-gray-900 disabled:opacity-50"
                >
                  <option value="">No Initial Assignment (Floating)</option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name} (ID: {team.team_id})
                    </option>
                  ))}
                </select>
                {loadingTeams && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingTeams}
            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-extrabold text-lg tracking-wide hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {submitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus size={24} />
                Confirm Registration
              </>
            )}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
