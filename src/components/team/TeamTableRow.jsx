import React from "react";
import Badge from "@/components/common/Badge";

export default function TeamTableRow({ team }) {
  return (
    <tr className="hover:bg-blue-50/20 bg-white transition-all duration-300 border-b border-gray-50 last:border-0 group">
      <td className="px-6 py-6">
        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
          {team.team_name}
        </div>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-tight">
          ID: TM-{team.team_id.toString().padStart(3, "0")}
        </div>
      </td>
      <td className="px-6 py-6">
        <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100/50">
          {team.department_name}
        </span>
      </td>
      <td className="px-6 py-6">
        <Badge variant={team.status ? "low" : "critical"}>
          {team.status ? "Operational" : "Standby"}
        </Badge>
      </td>
      {/* <td className="px-6 py-6 text-sm">
        <button
          onClick={() => alert(`Accessing personnel manifest for: ${team.team_name}`)}
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all border border-blue-50/50 hover:border-blue-600 font-bold text-xs uppercase tracking-widest"
        >
          Manage Staff
        </button>
      </td> */}
    </tr>
  );
}
