// pages/dashboard/TeamList.jsx
import React, { useState, useEffect } from "react";
import { Users, Search, Plus, Loader2, AlertCircle } from "lucide-react";
import Badge from "@/components/common/Badge";
import MainLayout from "@/components/layout/MainLayout";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function TeamList({ user, onLogout }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teams from backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE}/list-teams`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 403)
            throw new Error("Access denied – you need department admin rights");
          if (response.status === 401) throw new Error("Please login again");
          throw new Error(`Failed to load teams (${response.status})`);
        }

        const data = await response.json();
        // Assuming response shape: { teams: [ {team_id, team_name, ...} ] }
        setTeams(data.teams || []);
      } catch (err) {
        setError(err.message || "Could not load department teams");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams by search
  const filteredTeams = teams.filter(
    (team) =>
      (team.team_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-7 h-7 text-blue-600" />
              Department Teams
            </h1>
            <p className="mt-1 text-gray-600">
              Manage teams in your department
            </p>
          </div>

          <a
            href="/dashboard/CreateTeamPage"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Create New Team
          </a>
        </div>

        {/* Main content area */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Loading teams...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to load teams
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Search bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by team name or description..."
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
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTeams.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {teams.length === 0
                          ? "No teams have been created in your department yet"
                          : "No teams match your search"}
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map((team) => (
                      <tr key={team.team_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {team.team_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {team.description || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {/* If you later add member count from backend */}
                          {team.member_count || "0"} members
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {team.created_at
                            ? new Date(team.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() =>
                              alert(`View details for team: ${team.team_name}`)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Staff
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Optional footer with count */}
            {teams.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
                Showing {filteredTeams.length} of {teams.length} teams
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
