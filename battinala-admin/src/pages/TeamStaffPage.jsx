// src/pages/TeamStaffPage.jsx
import React from "react";
import { Plus } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";

// Mock data - replace with real API later
const teamMembers = [
  {
    id: "STF-001",
    name: "Rajesh Kumar",
    role: "Senior Technician",
    email: "rajesh.k@nea.gov.np",
    phone: "+977-9801234567",
    status: "ACTIVE",
    activeCases: 2,
  },
  {
    id: "STF-002",
    name: "Amit Shrestha",
    role: "Field Engineer",
    email: "amit.s@nea.gov.np",
    phone: "+977-9801234568",
    status: "ACTIVE",
    activeCases: 2,
  },
  {
    id: "STF-003",
    name: "Priya Maharjan",
    role: "Junior Technician",
    email: "priya.m@nea.gov.np",
    phone: "+977-9801234569",
    status: "ACTIVE",
    activeCases: 0,
  },
  {
    id: "STF-004",
    name: "Suresh Thapa",
    role: "Safety Inspector",
    email: "suresh.t@nea.gov.np",
    phone: "+977-9801234570",
    status: "ON-LEAVE",
    activeCases: 0,
  },
  {
    id: "STF-005",
    name: "Binita Gurung",
    role: "Dispatch Coordinator",
    email: "binita.g@nea.gov.np",
    phone: "+977-9801234571",
    status: "ACTIVE",
    activeCases: 0,
  },
];

export default function TeamStaffPage({ user, onLogout }) {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Team Staff Directory
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {teamMembers.length} team members
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Staff Member
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-1000px">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STAFF ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PHONE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTIVE CASES
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{member.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`mailto:${member.email}`} className="hover:underline">
                        {member.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a href={`tel:${member.phone}`} className="hover:underline">
                        {member.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          member.status === "ACTIVE"
                            ? "success"
                            : member.status === "ON-LEAVE"
                            ? "default"
                            : "pending"
                        }
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.activeCases}
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