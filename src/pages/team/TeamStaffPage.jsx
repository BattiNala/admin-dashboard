// pages/team/TeamStaffPage.jsx
import React, { useState, useEffect } from "react";
import { Users, Search, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Badge from "@/components/common/Badge";
import MainLayout from "@/components/layout/MainLayout";

// Mock data – replace with  API call to GET /teams/{team_id}/staff when backend is ready
const mockTeamStaff = [
  {
    employee_id: 1,
    name: "Ramesh Shrestha",
    email: "ramesh@dept.np",
    phone: "9841123456",
    status: "active",
    role_in_team: "Leader",
  },
  {
    employee_id: 4,
    name: "Anita Rai",
    email: "anita@dept.np",
    phone: "9851045678",
    status: "active",
    role_in_team: "Member",
  },
  {
    employee_id: 7,
    name: "Suman Adhikari",
    email: "suman@dept.np",
    phone: "9801122334",
    status: "on_leave",
    role_in_team: "Member",
  },
  {
    employee_id: 9,
    name: "Puja Karki",
    email: "puja@dept.np",
    phone: "9841987654",
    status: "active",
    role_in_team: "Member",
  },
];

export default function TeamStaffPage({ user, onLogout }) {
  const [teamId, setTeamId] = useState(null);
  const [teamName, setTeamName] = useState("Loading...");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get team_id from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("team_id");
    if (id) {
      setTeamId(id);
      // In real app → fetch team name + staff list
      // For now simulate loading
      setTimeout(() => {
        setTeamName(`Team #${id} - Emergency Response`); // mock
        setStaff(mockTeamStaff);
        setLoading(false);
      }, 800);
    } else {
      setError("No team selected. Please go back and choose a team.");
      setLoading(false);
    }
  }, []);

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.role_in_team || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <MainLayout user={user} onLogout={onLogout}>
        <div className="p-6 flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">
            Loading team members...
          </span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout user={user} onLogout={onLogout}>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <a
              href="/dashboard/TeamList"
              className="mt-6 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Back to Teams
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/dashboard/TeamList"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Teams
          </a>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            {teamName}
          </h1>
          <p className="mt-2 text-gray-600">
            Team members • {staff.length}{" "}
            {staff.length === 1 ? "person" : "people"}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    Role in Team
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No team members match your search"
                        : "This team has no members yet"}
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr key={member.employee_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <Badge variant="info">
                          {member.role_in_team || "Member"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            member.status === "active"
                              ? "success"
                              : member.status === "on_leave"
                                ? "warning"
                                : "error"
                          }
                        >
                          {member.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {staff.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
              Showing {filteredStaff.length} of {staff.length} team members
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
