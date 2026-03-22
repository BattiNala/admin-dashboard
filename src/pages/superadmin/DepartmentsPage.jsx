// pages/superadmin/DepartmentsPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Building2, 
  Loader2,
  Filter,
  Search as SearchIcon
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useListDepartments, useCreateDepartment, useDeleteDepartment } from "@/hooks/superadmin/useDepartment";
import { departmentSchema } from "@/schemas/departmentSchema";

export default function DepartmentsPage({ user, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: departments = [], isLoading, isError } = useListDepartments();
  const { mutate: createDept, isPending: creating } = useCreateDepartment();
  const { mutate: deleteDept } = useDeleteDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
  });

  const onSubmit = (data) => {
    createDept(data, {
      onSuccess: () => {
        toast.success("New department successfully registered in the system.");
        reset();
        setShowForm(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to establish department.");
      },
    });
  };

  const handleDelete = (dept) => {
    if (window.confirm(`Permanently decommission "${dept.department_name}"? This action removes all high-level permissions for this department.`)) {
      deleteDept(dept.department_id, {
        onSuccess: () => toast.success("Department decommissioned."),
        onError: (err) => toast.error(err.message || "Decommissioning failed."),
      });
    }
  };

  const filtered = departments.filter(d => 
    d.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-3xl flex items-center justify-center border border-indigo-100/50 shadow-sm">
                <Building className="text-indigo-600 w-8 h-8" />
              </div>
              Municipal Departments
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              Govern official infrastructure authorities and their systemic administrative.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 shadow-lg shadow-indigo-100 ${
              showForm 
                ? "bg-white border border-gray-100 text-gray-400 hover:text-red-500" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {showForm ? <AlertCircle size={20} /> : <Plus size={20} />}
            {showForm ? "Cancel Entry" : "Register Department"}
          </button>
        </div>

        {/* Creation Overlay/Form */}
        {showForm && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-100/50 p-10 transform animate-in slide-in-from-top-4">
             <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-indigo-50 rounded-2xl">
                 <Plus className="text-indigo-600" size={24} />
               </div>
               <h2 className="text-2xl font-black text-gray-900">Department Onboarding</h2>
             </div>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                    Official Department Designation
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      {...register("department_name")}
                      placeholder="e.g. Water & Sewage Authority"
                      className={`w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all text-lg font-bold text-gray-900 ${errors.department_name ? 'ring-2 ring-red-100' : ''}`}
                    />
                  </div>
                  {errors.department_name && <p className="text-red-500 text-xs font-bold pl-3">{errors.department_name.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg tracking-wide hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {creating ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle size={20} />}
                  Confirm Registration
                </button>
             </form>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden">
           
           {/* Filters Bar */}
           <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="relative w-full max-w-sm group">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  placeholder="Filter designation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all font-bold text-gray-900"
                />
              </div>
              <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest px-4">
                <Filter size={16} />
                {filtered.length} Entities Listed
              </div>
           </div>

           {/* Content Grid */}
           <div className="p-2">
             {isLoading ? (
               <div className="py-32 flex flex-col items-center">
                 <Loader2 className="w-12 h-12 text-indigo-200 animate-spin mb-6" />
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing data nodes...</p>
               </div>
             ) : isError ? (
                <div className="py-24 text-center">
                   <AlertCircle className="w-12 h-12 text-red-100 mx-auto mb-4" />
                   <p className="text-gray-400 font-bold italic">Network signal lost. Requesting retry...</p>
                </div>
             ) : filtered.length === 0 ? (
                <div className="py-24 text-center">
                   <Building className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching designation</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {filtered.map(dept => (
                      <div key={dept.department_id} className="group bg-gray-50/30 hover:bg-white p-6 rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                               <Building2 className="text-indigo-600 w-8 h-8" />
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-gray-900 tracking-tight">{dept.department_name}</h3>
                               <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">ID: DEP-{dept.department_id.toString().padStart(3, '0')}</p>
                            </div>
                         </div>
                         <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100/50 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg shadow-gray-200/50">
                            <button className="p-3 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(dept)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
