import React, { useState } from "react";
import Badge from "@/components/common/Badge";
import { useListIssues } from "@/hooks/data/useIssues";
import { useVerifyIssueStatus } from "@/hooks/data/useVerifyIssueStatus";
import { useRejectIssue } from "@/hooks/data/useRejectIssue";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function IssuesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [verifyModal, setVerifyModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");
  const [rejectReason, setRejectReason] = useState("");
  const itemsPerPage = 10;

  // Fetch issues with filters
  const {
    data: issuesData = [],
    isLoading,
    error,
    refetch,
  } = useListIssues(null, null, null, null);

  // Verify issue status mutation
  const { mutate: verifyStatus, isPending: isVerifying } =
    useVerifyIssueStatus();

  // Reject issue mutation
  const { mutate: rejectIssue, isPending: isRejecting } = useRejectIssue();
  const isSubmitting = isVerifying || isRejecting;

  // Ensure issuesData is an array
  const issues = Array.isArray(issuesData) ? issuesData : [];
  const sortedIssues = [...issues].sort((a, b) => {
    const aPending = a.status?.toUpperCase() === "PENDING_VERIFICATION";
    const bPending = b.status?.toUpperCase() === "PENDING_VERIFICATION";
    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return 0;
  });
  const totalPages = Math.ceil(issues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = sortedIssues.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const statusCounts = issues.reduce(
    (acc, issue) => {
      const status = (issue.status || "").toUpperCase();
      acc.total += 1;
      if (status === "PENDING_VERIFICATION") acc.pending += 1;
      if (status === "OPEN") acc.open += 1;
      if (status === "IN_PROGRESS") acc.inProgress += 1;
      if (status === "RESOLVED") acc.resolved += 1;
      return acc;
    },
    { total: 0, pending: 0, open: 0, inProgress: 0, resolved: 0 },
  );

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
    if (lowerStatus === "pending_verification") return "pending";
    if (lowerStatus === "in_progress") return "in-progress";
    if (lowerStatus === "resolved" || lowerStatus === "closed")
      return "resolved";
    return lowerStatus;
  };

  const handleVerifyClick = (issue) => {
    setVerifyModal(issue);
    setSelectedStatus("OPEN");
    setRejectReason("");
  };

  const handleVerifySubmit = () => {
    console.log("handleVerifySubmit triggered. selectedStatus:", selectedStatus);
    if (!verifyModal) {
      console.log("No verifyModal found, returning.");
      return;
    }

    if (selectedStatus === "REJECTED") {
      if (!rejectReason.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      console.log("Calling rejectIssue for label:", verifyModal.issue_label);
      rejectIssue(
        {
          issue_label: verifyModal.issue_label,
          reason: rejectReason.trim(),
          status: selectedStatus,
        },
        {
          onSuccess: () => {
            console.log("Rejection successful!");
            setVerifyModal(null);
            refetch();
          },
          onError: (err) => {
            console.error("Rejection error:", err);
            toast.error(err.detail || err.message || "Failed to reject issue");
          },
        }
      );
    } else {
      console.log("Calling verifyStatus for label:", verifyModal.issue_label);
      verifyStatus(
        {
          issue_label: verifyModal.issue_label,
          status: selectedStatus,
        },
        {
          onSuccess: () => {
            console.log("Verification successful!");
            setVerifyModal(null);
            refetch();
          },
          onError: (err) => {
            console.error("Verification error:", err);
            toast.error(err.detail || err.message || "Failed to verify issue status");
          },
        },
      );
    }
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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Department Issues</h2>
      </div>

      <div className="px-6 pt-6 grid gap-4 lg:grid-cols-5">
        {[
          { label: "Total", value: statusCounts.total, tone: "text-slate-900" },
          {
            label: "Pending",
            value: statusCounts.pending,
            tone: "text-amber-700",
          },
          { label: "Open", value: statusCounts.open, tone: "text-blue-700" },
          {
            label: "In Progress",
            value: statusCounts.inProgress,
            tone: "text-indigo-700",
          },
          {
            label: "Resolved",
            value: statusCounts.resolved,
            tone: "text-emerald-700",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {item.label}
            </p>
            <p className={`mt-2 text-2xl font-bold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Action
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
                  <td className="px-6 py-4">
                    {issue.status?.toUpperCase() === "PENDING_VERIFICATION" ? (
                      <button
                        onClick={() => handleVerifyClick(issue)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                      >
                        <Check size={16} />
                        Verify
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
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

      {/* Verification Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Verify Issue Status
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Issue:{" "}
              <span className="font-semibold">{verifyModal.issue_label}</span>
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEN">Open (Verified)</option>
                  <option value="REJECTED">Rejected (Invalid)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500 italic">
                  * Only Open or Rejected are allowed for initial verification.
                </p>
              </div>

              {selectedStatus === "REJECTED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide a clear reason why this issue is invalid or cannot be processed..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setVerifyModal(null)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifySubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 ${
                  selectedStatus === "REJECTED" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {selectedStatus === "REJECTED" ? "Rejecting..." : "Verifying..."}
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {selectedStatus === "REJECTED" ? "Reject Issue" : "Verify Issue"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
