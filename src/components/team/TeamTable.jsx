import React from "react";
import { Loader2, AlertCircle, Users } from "lucide-react";
import TeamTableRow from "./TeamTableRow";

export default function TeamTable({ 
  data = [], 
  isLoading, 
  isError 
}) {
  const tableHeaders = [
    "Team Identity",
    "Department",
    "Status"
  ];

  if (isLoading) {
    return (
      <div className="px-6 py-24 text-center bg-white border-t border-gray-100">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-100 mb-6" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-16 text-center bg-red-50/20 border-t border-red-50">
        <AlertCircle className="w-12 h-12 mx-auto text-red-200 mb-4" />
        <h3 className="text-sm font-black text-red-900 uppercase tracking-widest mb-1">Failed to load</h3>
        <p className="text-red-600/60 text-xs font-medium max-w-sm mx-auto">Failed to load teams. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-24 text-center">
                <div className="flex flex-col items-center gap-4">
                   <Users className="w-12 h-12 text-gray-100" />
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No teams found</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((team) => (
              <TeamTableRow
                key={team.team_id}
                team={team}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
