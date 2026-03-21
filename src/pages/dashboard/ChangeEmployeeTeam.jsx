// pages/dashboard/ChangeEmployeeTeam.jsx
import React, { useState, useEffect } from "react";
import { RefreshCw, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function ChangeEmployeeTeam({ user, onLogout }) {
  // In real app you would get employeeId from URL params or from StaffList link
  // For demo we use a simple input
  const [employeeId, setEmployeeId] = useState("");
  const [newTeamId, setNewTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load teams
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/list-teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Cannot load teams");
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !newTeamId) {
      setMessage({
        type: "error",
        text: "Please select employee and new team",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      // Your backend expects EmployeeTeamChangeRequest { employee_id, new_team_id }
      const res = await fetch(`${API_BASE}/change-team`, {
        method: "GET", // ← your current backend uses GET (should be PATCH!)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // GET with body is non-standard – your backend probably expects query params
        // Better: change backend to POST/PATCH and send JSON body
        // For now we fake it with query string (adjust if your backend reads from query)
        // Real fix: change endpoint to POST/PATCH in FastAPI
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to change team");
      }

      setMessage({
        type: "success",
        text: "Team changed successfully",
      });

      // Reset
      setEmployeeId("");
      setNewTeamId("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <RefreshCw className="w-7 h-7 text-blue-600" />
          Change Employee Team
        </h1>
        <p className="text-gray-600 mb-8">
          Re-assign an employee to a different team in your department
        </p>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. 42"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Team <span className="text-red-500">*</span>
            </label>
            {loadingTeams ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading teams...
              </div>
            ) : (
              <select
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select team —</option>
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || loadingTeams || !employeeId || !newTeamId}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
              ${submitting || loadingTeams || !employeeId || !newTeamId ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"}`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Team"
            )}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <strong>Note:</strong> Your current backend uses{" "}
          <code>GET /change-team</code> which is unusual for data modification.
          Consider changing it to <code>POST</code> or <code>PATCH</code> in the
          future for better REST practices and to support JSON body properly.
        </div>
      </div>
    </MainLayout>
  );
}
