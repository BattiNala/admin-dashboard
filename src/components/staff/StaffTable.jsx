import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import StaffTableRow from "./StaffTableRow";

export default function StaffTable({
  data = [],
  isLoading,
  isError,
  onRowAction,
}) {
  const staffMembers = Array.isArray(data) ? data : [];
  const tableHeaders = ["Name", "Email", "Phone", "Team", "Status", "Actions"];

  if (isLoading) {
    return (
      <div className="px-6 py-20 text-center animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading staff records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-12 text-center bg-red-50/50 rounded-xl m-4 border border-red-100">
        <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">
          Failed to load staff list
        </h3>
        <p className="text-red-600 max-w-sm mx-auto">
          Please check your connection or wait while we retry fetching data.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-y border-gray-100">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staffMembers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-16 text-center text-gray-500 italic"
              >
                No staff members found matching your current view
              </td>
            </tr>
          ) : (
            staffMembers.map((staff) => (
              <StaffTableRow
                key={staff.employee_id}
                staff={staff}
                onChangeTeam={onRowAction}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
