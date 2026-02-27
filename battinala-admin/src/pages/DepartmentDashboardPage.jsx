// src/pages/DepartmentDashboardPage.jsx
import React from "react";
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

// Mock data - later replace with real API
const stats = {
  total: 7,
  pending: 3,
  inProgress: 3,
  resolved: 1,
  critical: 3,
};

const hazards = [
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
];

export default function DepartmentDashboardPage({ user, onLogout }) {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      {/* Stats row */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  TOTAL HAZARDS
                </p>
                <p className="text-2xl font-bold text-red-700">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">PENDING</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">IN PROGRESS</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.inProgress}
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
                  {stats.resolved}
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
                  {stats.critical}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filter bar */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Department Hazard Pool
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, description, or location..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Priority</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
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
                {hazards.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {h.id}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={h.priority.toLowerCase()}>
                        {h.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {h.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-500" />
                        {h.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={h.status.toLowerCase().replace(" ", "-")}>
                        {h.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {h.assignedTo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {h.reported}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {h.reporter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
