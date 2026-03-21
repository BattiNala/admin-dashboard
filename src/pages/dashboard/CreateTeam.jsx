// pages/dashboard/CreateTeamPage.jsx
import React, { useState } from "react";
import {
  PlusCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function CreateTeamPage({ user, onLogout }) {
  const [formData, setFormData] = useState({
    team_name: "",
    // description: "",     // ← uncomment if your TeamCreate schema has description
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    // Basic validation
    if (!formData.team_name.trim()) {
      setMessage({ type: "error", text: "Team name is required" });
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        team_name: formData.team_name.trim(),
        // description: formData.description.trim() || undefined,   // ← add if needed
      };

      const response = await fetch(`${API_BASE}/create-team`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to create team");
      }

      const result = await response.json();
      // Your backend returns: { "message": "Team created successfully. ..." }

      setMessage({
        type: "success",
        text: result.message || "Team created successfully!",
      });

      // Optional: auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard/TeamList";
      }, 2000);
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
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <a
              href="/dashboard/TeamList"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              Back to Teams
            </a>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-blue-600" />
            Create New Team
          </h1>
          <p className="mt-2 text-gray-600">
            Add a new team to organize work in your department
          </p>
        </div>

        {/* Messages */}
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
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6"
        >
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="team_name"
              value={formData.team_name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. Emergency Response Team"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Optional: Description (uncomment if your backend supports it) */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the team's responsibilities..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors
                ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating team...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>

        {/* Optional hint */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          After creation, you can assign staff members to this team from the
          staff management page.
        </div>
      </div>
    </MainLayout>
  );
}
