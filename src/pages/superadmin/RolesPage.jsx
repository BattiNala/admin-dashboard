// pages/superadmin/RolesPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Shield, Lock, ShieldCheck, Loader2, AlertCircle, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useListRoles, useCreateRole } from "@/hooks/superadmin/useRole";
import { roleSchema } from "@/schemas/roleSchema";

export default function RolesPage({ user, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: roles = [], isLoading, isError } = useListRoles();
  const { mutate: createRole, isPending: creating } = useCreateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
  });

  const onSubmit = (data) => {
    createRole(data, {
      onSuccess: () => {
        toast.success("Security role successfully registered.");
        reset();
        setIsModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create security role.");
      },
    });
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100/50 shadow-sm">
                <Shield className="text-blue-600 w-8 h-8" />
              </div>
              Permission Nodes
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              Govern system-wide access levels and security definitions across Batti Nala sectors.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold tracking-wide transition-all active:scale-95 shadow-lg shadow-blue-100 hover:bg-blue-700"
          >
            <Plus size={20} />
            Define New Role
          </button>
        </div>

        {/* Roles List */}
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden">
           <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Authorized Access Entities</h2>
              <div className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest">
                {roles.length} Roles Active
              </div>
           </div>

           <div className="p-4">
             {isLoading ? (
                <div className="py-32 flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-blue-200 animate-spin mb-6" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Security Manifest...</p>
                </div>
             ) : isError ? (
                <div className="py-24 text-center">
                   <AlertCircle className="w-12 h-12 text-red-100 mx-auto mb-4" />
                   <p className="text-gray-400 font-bold italic">Role sync failed. Check system heartbeat.</p>
                </div>
             ) : roles.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                   <Lock className="w-12 h-12 text-gray-100 mx-auto" />
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active permission nodes found</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                   {roles.map((role, idx) => (
                      <div 
                        key={role.role_id || idx} 
                        className="group relative bg-[#fafafa] hover:bg-white p-8 rounded-[2.5rem] border border-transparent hover:border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
                      >
                         <div className="absolute top-6 right-8">
                            <Fingerprint size={24} className="text-gray-100 group-hover:text-blue-50 transition-colors" />
                         </div>
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-100 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                            <ShieldCheck className="text-blue-500 w-7 h-7" />
                         </div>
                         <h3 className="text-xl font-black text-gray-900 tracking-tight capitalize">{role.role_name}</h3>
                         <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-2 italic">Entity ID: {role.role_id || "SYS-GEN"}</p>
                      </div>
                   ))}
                </div>
             )}
           </div>
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-md transition-all duration-300">
             <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-white/20 p-10 transform animate-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-2xl">
                         <Plus className="text-blue-600" size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900">Define Role</h2>
                   </div>
                   <button onClick={() => { setIsModalOpen(false); reset(); }} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                     <X size={24} />
                   </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">System Label</label>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          {...register("role_name")}
                          placeholder="e.g. Field Engineer"
                          disabled={creating}
                          className={`w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.role_name ? 'ring-2 ring-red-100' : ''}`}
                        />
                      </div>
                      {errors.role_name && <p className="text-red-500 text-[11px] font-bold pl-3">{errors.role_name.message}</p>}
                   </div>

                   <button
                     type="submit"
                     disabled={creating}
                     className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl tracking-wider hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                   >
                     {creating ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck size={24} />}
                     Confirm Manifest
                   </button>
                </form>
             </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
