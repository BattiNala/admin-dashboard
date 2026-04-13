import React, { useState } from "react";
import Badge from "@/components/common/Badge";
import { useListIssues } from "@/hooks/useIssues";

export default function IssuesSection() {
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch issues with filters
  const {
    data: issuesData = [],
    isLoading,
    error,
  } = useListIssues(statusFilter, priorityFilter, null, null);

  // Ensure issuesData is an array
  const issues = Array.isArray(issuesData) ? issuesData : [];
  const totalPages = Math.ceil(issues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = issues.slice(startIndex, startIndex + itemsPerPage);

  const getPriorityVariant = (priority) => {
    const lowerPriority = (priority || "").toLowerCase();
    if (lowerPriority === "high") return "critical";
    if (lowerPriority === "normal") return "medium";
    if (lowerPriority === "low") return "low";
    return lowerPriority;
  };

  const getStatusVariant = (status) => {
    const lowerStatus = (status || "").toLowerCase();
    if (lowerStatus === "open") return "pending";
    if (lowerStatus === "in_progress") return "in-progress";
    if (lowerStatus === "resolved" || lowerStatus === "closed")
      return "resolved";
    return lowerStatus;
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <p className="text-red-600">Error loading issues: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Department Issues</h2>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <select
            value={statusFilter || ""}
            onChange={(e) => {
              setStatusFilter(e.target.value || null);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-35"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter || ""}
            onChange={(e) => {
              setPriorityFilter(e.target.value || null);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-35"
          >
            <option value="">All Priority</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Loading issues...
          </div>
        ) : paginatedIssues.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            {issues.length === 0 ? "No issues found" : "No issues on this page"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Issue ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Issue Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Reported
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedIssues.map((issue) => (
                <tr
                  key={issue.issue_label}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {issue.issue_label || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getPriorityVariant(issue.issue_priority)}>
                      {issue.issue_priority || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-64">
                    {issue.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {issue.issue_type || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(issue.status)}>
                      {issue.status || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {issue.created_at
                      ? new Date(issue.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {issues.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-4 text-sm text-gray-600">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, issues.length)} of{" "}
            {issues.length} issues
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
