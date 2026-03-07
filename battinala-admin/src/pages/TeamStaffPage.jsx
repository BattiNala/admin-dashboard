// src/pages/TeamStaffPage.jsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";

// Mock data - replace with real API later
const initialTeamMembers = [
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
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    id: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    activeCases: 0,
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: name === "activeCases" ? Number(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    if (!newMember.id.trim()) return "Staff ID is required";
    if (!newMember.name.trim()) return "Name is required";
    if (!newMember.role.trim()) return "Role is required";
    if (!newMember.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email))
      return "Invalid email format";
    if (!newMember.phone.trim()) return "Phone is required";
    if (!/^\+977-9\d{9}$/.test(newMember.phone))
      return "Phone must be in format +977-9XXXXXXXX";
    if (teamMembers.some((m) => m.id === newMember.id.trim()))
      return "Staff ID already exists";
    return "";
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setTeamMembers((prev) => [
      ...prev,
      { ...newMember, id: newMember.id.trim() },
    ]);
    setFormError("");
    setIsModalOpen(false);
    setNewMember({
      id: "",
      name: "",
      role: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      activeCases: 0,
    });
  };

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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
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
                        <span className="text-sm text-gray-900">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:underline"
                      >
                        {member.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <a
                        href={`tel:${member.phone}`}
                        className="hover:underline"
                      >
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

      {/* Add Staff Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Staff Member
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddMember} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={newMember.id}
                    onChange={handleInputChange}
                    placeholder="STF-006"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Technician"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    placeholder="example@nea.gov.np"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newMember.phone}
                    onChange={handleInputChange}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newMember.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON-LEAVE">ON-LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Active Cases
                  </label>
                  <input
                    type="number"
                    name="activeCases"
                    value={newMember.activeCases}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormError("");
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
