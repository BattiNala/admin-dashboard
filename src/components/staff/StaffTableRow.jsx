import React from "react";
import { Edit } from "lucide-react";
import Badge from "@/components/common/Badge";

export default function StaffTableRow({ staff, onChangeTeam }) {
  return (
    <tr className="hover:bg-gray-50 bg-white transition-colors border-b border-gray-100 last:border-0">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{staff.name}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate max-w-[200px]" title={staff.email}>
          {staff.email}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {staff.phone_number || "—"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <span className={staff.team_name ? "text-blue-700 font-medium" : "text-gray-400 italic"}>
          {staff.team_name || "Unassigned"}
        </span>
      </td>
      <td className="px-6 py-4">
        <Badge variant={staff.current_status || "default"}>
          {staff.current_status?.replace("_", " ") || "unknown"}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm">
        <button
          onClick={() => onChangeTeam(staff)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-blue-50/50 hover:border-blue-600 font-medium group"
        >
          <Edit size={14} className="group-hover:scale-110 transition-transform" />
          Change Team
        </button>
      </td>
    </tr>
  );
}
