// pages/dashboard/AddStaffPage.jsx
import React, { useState, useEffect } from "react";
import { UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function AddStaffPage({ user, onLogout }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    team_id: "", // can be empty string if no team
    current_status: "active", // default value – adjust if your schema uses different
  });

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch teams for dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/list-teams`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load teams");
        }

        const data = await res.json();
        // Assuming response shape: { teams: [{team_id, team_name, ...}] }
        setTeams(data.teams || []);
      } catch (err) {
        setMessage({
          type: "error",
          text: err.message || "Could not load teams",
        });
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Name and email are required" });
      setSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email" });
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim() || undefined,
        team_id: formData.team_id ? Number(formData.team_id) : undefined,
        current_status: formData.current_status,
      };

      const res = await fetch(`${API_BASE}/add-staff`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to add staff member");
      }

      const result = await res.json();
      // Your backend returns: { message: "...", employee_id: ... }

      setMessage({
        type: "success",
        text: result.message || "Staff member added successfully!",
      });

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        team_id: "",
        current_status: "active",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UserPlus className="w-7 h-7 text-blue-600" />
            Add New Staff Member
          </h1>
          <p className="mt-2 text-gray-600">
            Create a new employee account in your department
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Ramesh Shrestha"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ramesh@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+977 9841XXXXXX"
            />
          </div>

          {/* Team Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Team
            </label>
            {loadingTeams ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading teams...
              </div>
            ) : (
              <select
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">— No team / Unassigned —</option>
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <select
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || loadingTeams}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors
                ${
                  submitting || loadingTeams
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating staff member...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Add Staff Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
