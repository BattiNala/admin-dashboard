// pages/dashboard/StaffList.jsx
import React, { useState } from "react";
import { Users, Search, Edit, AlertCircle } from "lucide-react";
import Badge from "@/components/common/Badge";
import MainLayout from "@/components/layout/MainLayout";

// Mock data (replace with real fetch when you add GET /employees/my-department)
const mockStaff = [
  {
    employee_id: 1,
    name: "Ramesh Shrestha",
    email: "ramesh@dept.np",
    phone_number: "9841123456",
    team_name: "Maintenance",
    current_status: "active",
  },
  {
    employee_id: 2,
    name: "Sita Gurung",
    email: "sita@dept.np",
    phone_number: "9841987654",
    team_name: "Field Inspection",
    current_status: "on_leave",
  },
  {
    employee_id: 3,
    name: "Bikash Thapa",
    email: "bikash@dept.np",
    phone_number: "9801122334",
    team_name: "Unassigned",
    current_status: "active",
  },
  {
    employee_id: 4,
    name: "Anita Rai",
    email: "anita@dept.np",
    phone_number: "9851045678",
    team_name: "Emergency Response",
    current_status: "active",
  },
];

export default function StaffList({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredStaff = mockStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.team_name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-7 h-7 text-blue-600" />
              Department Staff
            </h1>
            <p className="mt-1 text-gray-600">
              Manage employees in your department
            </p>
          </div>

          <a
            href="/dashboard/AddStaffPage"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <Users size={16} />
            Add New Staff
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search & filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No staff members found
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.employee_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {staff.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {staff.phone_number || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {staff.team_name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            staff.current_status === "active"
                              ? "success"
                              : staff.current_status === "on_leave"
                                ? "warning"
                                : "error"
                          }
                        >
                          {staff.current_status?.replace("_", " ") || "unknown"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedEmployee(staff)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Change Team
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple modal-like overlay for change team (you can extract to separate component later) */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                Change Team for {selectedEmployee.name}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Current team:{" "}
                <strong>{selectedEmployee.team_name || "Unassigned"}</strong>
              </p>
              {/* Here you would normally call ChangeEmployeeTeam component or pass id */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
