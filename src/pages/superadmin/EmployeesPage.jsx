// pages/superadmin/EmployeesPage.jsx
import React, { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Building2,
  Loader2,
  AlertCircle,
  Search as SearchIcon,
  Filter,
  Clock,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useListEmployees } from "@/hooks/superadmin/useDepartment";

export default function EmployeesPage({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: employees = [], isLoading, isError } = useListEmployees();

  // Filter employees based on search and status
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.team_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || emp.current_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Get unique statuses
  const statusOptions = [
    "all",
    ...new Set(employees.map((e) => e.current_status)),
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "busy":
        return "bg-red-50 text-red-700 border-red-100";
      case "available":
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "idle":
      case "away":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "busy":
        return "Busy";
      case "available":
      case "active":
        return "Active";
      case "idle":
      case "away":
        return "Away";
      default:
        return "Unknown";
    }
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100/50 shadow-sm">
                <Users className="text-emerald-600 w-8 h-8" />
              </div>
              Department Employees
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              View and manage all employees across departments and teams.
            </p>
          </div>

          <div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {filtered.length} Employees
            </span>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex items-center gap-4 text-red-900 animate-bounce-short">
            <AlertCircle size={24} className="text-red-500" />
            <div className="text-sm font-bold">
              Unable to Load Employees: The employee registry could not be
              retrieval.
              <span className="block text-xs font-medium text-red-700 mt-1 opacity-80">
                Please check your connection and try again.
              </span>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group/search">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within/search:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, department, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all text-sm font-medium text-gray-900"
            />
          </div>

          <div className="relative group/filter">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within/filter:text-emerald-600 transition-colors pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all text-sm font-medium text-gray-900 appearance-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : `Status: ${status}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <Users size={20} className="text-emerald-600" />
            <h2 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">
              Employee Directory
            </h2>
            <span className="ml-auto text-xs font-bold text-gray-400">
              {filtered.length} of {employees.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-200 overflow-y-auto">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-100 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  Loading employees...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center px-10">
                <Users className="w-16 h-16 text-gray-100 mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  {searchTerm || filterStatus !== "all"
                    ? "No employees match your filters."
                    : "No employees found."}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Employee
                    </th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Department
                    </th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Team
                    </th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((employee, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
                            <span className="text-sm font-bold text-emerald-700">
                              {employee.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {employee.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-300" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-300" />
                            {employee.phone_number || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                          <Building2 size={12} />
                          {employee.department_name || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-semibold text-gray-700">
                          {employee.team_name || "—"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg border ${getStatusColor(
                            employee.current_status,
                          )}`}
                        >
                          {getStatusIcon(employee.current_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
