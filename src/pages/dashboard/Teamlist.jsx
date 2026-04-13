import React, { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useListTeams } from "@/hooks/team/useTeam";

// Consistent UI Components
import TeamHeader from "@/components/team/TeamHeader";
import TeamFilters from "@/components/team/TeamFilters";
import TeamTable from "@/components/team/TeamTable";

export default function TeamList({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: teams = [], isLoading, isError } = useListTeams();

  // Logic: Dynamic search filtering
  const filteredTeams = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return teams;

    return teams.filter(
      (team) =>
        (team.team_name || "").toLowerCase().includes(term) ||
        (team.department_name || "").toLowerCase().includes(term),
    );
  }, [teams, searchTerm]);

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-400 mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Unified Header Style */}
        <TeamHeader />

        {/* Unified Table Container with improved shadow/rounding */}
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden ring-1 ring-black/5 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
          <TeamFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <TeamTable
            data={filteredTeams}
            isLoading={isLoading}
            isError={isError}
          />

          {/* Registry Footnote */}
          {/* {teams.length > 0 && (
            <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Operational Units Registry — {new Date().toLocaleDateString()}
              </span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">
                {filteredTeams.length} units detected
              </span>
            </div>
          )} */}
        </div>
      </div>
    </MainLayout>
  );
}
