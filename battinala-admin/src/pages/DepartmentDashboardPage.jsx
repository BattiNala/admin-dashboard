// src/pages/DepartmentDashboardPage.jsx
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
import Badge from "../components/common/Badge";
import MainLayout from "../components/layout/MainLayout";

// Mock data
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
  {
    id: "HAZ-002",
    priority: "HIGH",
    description: "Power outage affecting 200+ homes",
    location: "Patan, Lalitpur",
    status: "IN PROGRESS",
    assignedTo: "Rajesh Kumar",
    reported: "2026-02-27 08:15",
    reporter: "Sita Thapa",
  },
  {
    id: "HAZ-003",
    priority: "MEDIUM",
    description: "Street light circuit malfunction",
    location: "Bhaktapur",
    status: "IN PROGRESS",
    assignedTo: "Amit Shrestha",
    reported: "2026-02-26 14:45",
    reporter: "Maya Gurung",
  },
  {
    id: "HAZ-004",
    priority: "HIGH",
    description: "Damaged underground cable",
    location: "Baluwatar",
    status: "PENDING",
    assignedTo: "Unassigned",
    reported: "2026-02-27 11:00",
    reporter: "Krishna Tamang",
  },
  {
    id: "HAZ-005",
    priority: "LOW",
    description: "Meter reading discrepancy",
    location: "Kirtipur",
    status: "RESOLVED",
    assignedTo: "Rajesh Kumar",
    reported: "2026-02-25 16:30",
    reporter: "Anita Rai",
  },
  {
    id: "HAZ-006",
    priority: "CRITICAL",
    description: "Substation equipment overheating",
    location: "Lazimpat",
    status: "PENDING",
    assignedTo: "Unassigned",
    reported: "2026-02-27 13:20",
    reporter: "Bikash Rana",
  },
  {
    id: "HAZ-007",
    priority: "CRITICAL",
    description: "Fallen power line after storm",
    location: "Jawalakhel",
    status: "IN PROGRESS",
    assignedTo: "Amit Shrestha",
    reported: "2026-02-27 07:00",
    reporter: "Suman Adhikari",
  },
  {
    id: "HAZ-008",
    priority: "MEDIUM",
    description: "Low water pressure in main line",
    location: "Koteshwor",
    status: "PENDING",
    assignedTo: "Unassigned",
    reported: "2026-02-28 10:15",
    reporter: "Puja Karki",
  },
  {
    id: "HAZ-009",
    priority: "HIGH",
    description: "Electrical short circuit in substation",
    location: "New Baneshwor",
    status: "RESOLVED",
    assignedTo: "Rajesh Kumar",
    reported: "2026-02-25 15:45",
    reporter: "Hari Prasad",
  },
  {
    id: "HAZ-010",
    priority: "LOW",
    description: "Minor leakage in water pipe",
    location: "Lalitpur",
    status: "IN PROGRESS",
    assignedTo: "Amit Shrestha",
    reported: "2026-02-27 12:00",
    reporter: "Suman Shrestha",
  },
];

// Stats (calculated from initial data)
const hazardStats = {
  total: initialHazards.length,
  pending: initialHazards.filter((h) => h.status === "PENDING").length,
  inProgress: initialHazards.filter((h) => h.status === "IN PROGRESS").length,
  resolved: initialHazards.filter((h) => h.status === "RESOLVED").length,
  critical: initialHazards.filter((h) => h.priority === "CRITICAL").length,
};

export default function DepartmentDashboardPage({ user, onLogout }) {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter hazards
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

  // Pagination calculations (must be after filteredHazards)
  const totalPages = Math.ceil(filteredHazards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHazards = filteredHazards.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Go to page helper
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export filtered data to CSV
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
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        {/* Stats row */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    TOTAL HAZARDS
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
                  <p className="text-sm font-medium text-yellow-800">PENDING</p>
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
                  <p className="text-sm font-medium text-blue-800">
                    IN PROGRESS
                  </p>
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
                  <p className="text-sm font-medium text-green-800">RESOLVED</p>
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
                  <p className="text-sm font-medium text-pink-800">CRITICAL</p>
                  <p className="text-2xl font-bold text-pink-700">
                    {hazardStats.critical}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filter bar */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Department Hazard Pool
            </h2>

            <div className="flex flex-col md:flex-row gap-3 flex-wrap">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, description, location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset to page 1 on search
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Priority</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-1000px">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    HAZARD ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PRIORITY
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ASSIGNED TO
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    REPORTED
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    REPORTER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedHazards.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hazards found matching your filters
                    </td>
                  </tr>
                ) : (
                  paginatedHazards.map((hazard) => (
                    <tr key={hazard.id} className="hover:bg-gray-50">
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

          {/* Pagination */}
          {filteredHazards.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, filteredHazards.length)} of{" "}
                {filteredHazards.length} hazards
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
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
