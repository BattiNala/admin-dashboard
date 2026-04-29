import React from "react";
import { Edit } from "lucide-react";
import Badge from "@/components/common/Badge";

export default function StaffTableRow({ staff, onChangeTeam }) {
  return (
    <tr className="hover:bg-blue-50/20 bg-white transition-all duration-300 border-b border-gray-50 last:border-0 group">
      <td className="px-6 py-6">
        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
          {staff.name}
        </div>
      </td>
      <td className="px-6 py-6 text-sm">
        <div
          className="font-medium text-gray-500 truncate max-w-[180px]"
          title={staff.email}
        >
          {staff.email}
        </div>
      </td>
      <td className="px-6 py-6 text-sm font-medium text-gray-400">
        {staff.phone_number || "—"}
      </td>
      <td className="px-6 py-6 text-sm">
        <span
          className={`${staff.team_name ? "text-indigo-600 bg-indigo-50 border border-indigo-100/50" : "text-gray-400 bg-gray-50 border border-gray-100"} font-bold uppercase text-[10px] tracking-widest px-3 py-1 rounded-lg`}
        >
          {staff.team_name || "Unassigned"}
        </span>
      </td>
      <td className="px-6 py-6">
        <Badge variant={staff.current_status || "default"}>
          {staff.current_status?.replace("_", " ") || "unknown"}
        </Badge>
      </td>
      <td className="px-6 py-6 text-sm">
        <button
          onClick={() => onChangeTeam(staff)}
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all border border-blue-50/50 hover:border-blue-600 font-bold text-xs uppercase tracking-widest group"
        >
          <Edit
            size={14}
            className="group-hover:rotate-12 transition-transform"
          />
          Assign Team
        </button>
      </td>
    </tr>
  );
}
