// pages/dashboard/DepartmentDashboard.jsx
import React, { useState } from "react";
import {
  Search,
  Download,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  Zap,
} from "lucide-react";
import Badge from "@/components/common/Badge";
import MainLayout from "@/components/layout/MainLayout";

// Mock data (kept as-is since no real hazards endpoint exists yet)
const initialHazards = [
  {
    id: "HAZ-001",
    priority: "CRITICAL",
    description: "High voltage transformer failure - urgent",
    location: "Thamel, Kathmandu",
    status: "PENDING",
    assignedTo: "Unassigned",
    reported: "2026-02-26 09:30",
    reporter: "Ram Sharma",
  },
  // ... (your other 9 items remain unchanged)
];

const hazardStats = {
  total: initialHazards.length,
  pending: initialHazards.filter((h) => h.status === "PENDING").length,
  inProgress: initialHazards.filter((h) => h.status === "IN PROGRESS").length,
  resolved: initialHazards.filter((h) => h.status === "RESOLVED").length,
  critical: initialHazards.filter((h) => h.priority === "CRITICAL").length,
};

export default function DepartmentDashboardPage({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHazards = initialHazards.filter((hazard) => {
    const matchesSearch =
      hazard.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hazard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hazard.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hazard.reporter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      hazard.status === statusFilter.toUpperCase().replace(" ", "_");

    const matchesPriority =
      priorityFilter === "All Priority" ||
      hazard.priority === priorityFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredHazards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHazards = filteredHazards.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = () => {
    if (filteredHazards.length === 0) {
      alert("No data to export");
      return;
    }

    const headers =
      "HAZARD ID,PRIORITY,DESCRIPTION,LOCATION,STATUS,ASSIGNED TO,REPORTED,REPORTER\n";
    const rows = filteredHazards
      .map(
        (h) =>
          `"${h.id}","${h.priority}","${h.description.replace(/"/g, '""')}","${h.location}","${h.status}","${h.assignedTo}","${h.reported}","${h.reporter}"`,
      )
      .join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "department_hazards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Total Hazards
                </p>
                <p className="text-2xl font-bold text-red-700">
                  {hazardStats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {hazardStats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">In Progress</p>
                <p className="text-2xl font-bold text-blue-700">
                  {hazardStats.inProgress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Resolved</p>
                <p className="text-2xl font-bold text-green-700">
                  {hazardStats.resolved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-pink-800">Critical</p>
                <p className="text-2xl font-bold text-pink-700">
                  {hazardStats.critical}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Department Hazard Pool
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, description, location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
              >
                <option>All Priority</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hazard ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reporter
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedHazards.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm ||
                      statusFilter !== "All Status" ||
                      priorityFilter !== "All Priority"
                        ? "No hazards match your current filters"
                        : "No hazards have been reported in your department yet"}
                    </td>
                  </tr>
                ) : (
                  paginatedHazards.map((hazard) => (
                    <tr
                      key={hazard.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {hazard.id}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={hazard.priority.toLowerCase()}>
                          {hazard.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {hazard.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-500" />
                          {hazard.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={hazard.status
                            .toLowerCase()
                            .replace(" ", "-")}
                        >
                          {hazard.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {hazard.assignedTo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {hazard.reported}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {hazard.reporter}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredHazards.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <p>
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, filteredHazards.length)} of{" "}
                {filteredHazards.length} hazards
              </p>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 7 && <span className="px-2">...</span>}

                {totalPages > 7 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
