import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function StaffHeader() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
      <div className="relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full" />
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-4 tracking-tight">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-sm shadow-blue-100/50 group-hover:scale-110 transition-transform">
             <Users className="w-6 h-6 text-blue-600" />
          </div>
          Personnel Management
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-400 max-w-md">
          Oversee infrastructure response teams, manage employee placement, and monitor active staff across your department.
        </p>
      </div>

      <Link
        to="/dashboard/add-staff"
        className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 text-sm font-bold tracking-wide transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95 group shrink-0"
      >
        <Users size={18} className="group-hover:rotate-6 transition-transform" />
        Register New Staff
      </Link>
    </div>
  );
}
