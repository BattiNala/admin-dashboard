import React from "react";
import { MapPin } from "lucide-react";
import Badge from "@/components/common/Badge";

export default function TeamTableRow({ team }) {
  return (
    <tr className="hover:bg-blue-50/20 bg-white transition-all duration-300 border-b border-gray-50 last:border-0 group">
      <td className="px-6 py-6">
        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
          {team.team_name}
        </div>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-tight">
          ID: TM-{team.team_id?.toString().padStart(3, "0") || "N/A"}
        </div>
      </td>
      <td className="px-6 py-6">
        <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100/50">
          {team.department_name || "N/A"}
        </span>
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div className="text-sm">
            <div className="font-semibold text-gray-900">
              {team.base_latitude?.toFixed(4) || "N/A"},{" "}
              {team.base_longitude?.toFixed(4) || "N/A"}
            </div>
            <div className="text-xs text-gray-500">Coordinates</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-6">
        <div className="text-sm">
          <div className="font-semibold text-gray-900">
            {team.coverage_radius_km || "N/A"} km
          </div>
          <div className="text-xs text-gray-500">Service Radius</div>
        </div>
      </td>
      <td className="px-6 py-6">
        <Badge variant={team.status ? "low" : "critical"}>
          {team.status ? "Operational" : "Standby"}
        </Badge>
      </td>
    </tr>
  );
}
