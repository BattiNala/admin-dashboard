import React from "react";
import { Loader2 } from "lucide-react";

export default function ChangeTeamModal({
  selectedEmployee,
  newTeamId,
  setNewTeamId,
  teams = [],
  isLoadingTeams,
  isTeamsError,
  onClose,
  onSave,
  isSubmitting,
}) {
  if (!selectedEmployee) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20 transform animate-in slide-in-from-bottom-5">
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
            Change Team Assignment
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Assign{" "}
            <strong className="text-blue-600 font-bold">
              {selectedEmployee.name}
            </strong>{" "}
            to a different dispatch team for infrastructure reporting response.
          </p>
          <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
              Current Placement
            </span>
            <span className="text-lg font-bold text-blue-900">
              {selectedEmployee.team_name || "Unassigned"}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            New Team Assignment
          </label>
          <div className="relative">
            <select
              autoFocus
              value={newTeamId}
              onChange={(e) => setNewTeamId(e.target.value)}
              disabled={isLoadingTeams || isTeamsError}
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all text-lg font-medium text-gray-900 disabled:opacity-60"
            >
              <option value="">
                {isLoadingTeams
                  ? "Loading teams..."
                  : isTeamsError
                    ? "Unable to load teams"
                    : "Select a team"}
              </option>
              {teams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
            {isLoadingTeams && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-gray-400 leading-tight italic">
            * Teams are loaded from your department registry.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 border border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={
              isSubmitting || !newTeamId || isLoadingTeams || isTeamsError
            }
            className="flex-[1.5] px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Update placement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
