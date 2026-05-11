import React, { useEffect, useMemo, useState } from "react";
import Badge from "@/components/common/Badge";
import { useListIssues } from "@/hooks/data/useIssues";
import { useVerifyIssueStatus } from "@/hooks/data/useVerifyIssueStatus";
import { useRejectIssue } from "@/hooks/data/useRejectIssue";
import { useIssueDetail } from "@/hooks/data/useIssueDetail";
import { toast } from "sonner";
import { Check, Eye, Paperclip, X } from "lucide-react";

export default function IssuesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [verifyModal, setVerifyModal] = useState(null);
  const [detailIssueLabel, setDetailIssueLabel] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
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

  const {
    data: issueDetail,
    isLoading: isIssueDetailLoading,
    error: issueDetailError,
  } = useIssueDetail(detailIssueLabel);

  // Ensure issuesData is an array
  const issues = Array.isArray(issuesData) ? issuesData : [];
  const getPriorityRank = (priority) => {
    const value = (priority || "").toUpperCase();
    if (value === "HIGH") return 3;
    if (value === "NORMAL" || value === "MEDIUM") return 2;
    if (value === "LOW") return 1;
    return 0;
  };

  const toTimestamp = (value) => {
    if (!value) return 0;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedIssues = [...issues].sort((a, b) => {
    const priorityDiff =
      getPriorityRank(b.issue_priority) - getPriorityRank(a.issue_priority);
    if (priorityDiff !== 0) return priorityDiff;
    return toTimestamp(b.created_at) - toTimestamp(a.created_at);
  });
  const filteredIssues = sortedIssues.filter((issue) => {
    const status = (issue.status || "").toUpperCase();

    if (activeStatusFilter === "ALL") return true;
    if (activeStatusFilter === "CLOSED")
      return status === "CLOSED" || status === "RESOLVED";
    return status === activeStatusFilter;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredIssues.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(
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
      if (status === "RESOLVED" || status === "CLOSED") acc.closed += 1;
      if (status === "REJECTED") acc.rejected += 1;
      return acc;
    },
    { total: 0, pending: 0, open: 0, inProgress: 0, closed: 0, rejected: 0 },
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatusFilter]);

  useEffect(() => {
    if (activeStatusFilter === "REJECTED" && statusCounts.rejected === 0) {
      setActiveStatusFilter("ALL");
    }
  }, [activeStatusFilter, statusCounts.rejected]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const handleOpenIssueDetail = (issueLabel) => {
    setDetailIssueLabel(issueLabel);
  };

  const closeIssueDetailModal = () => {
    setDetailIssueLabel(null);
  };

  const formatText = (value, fallback = "N/A") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    const output = String(value).trim();
    return output.length > 0 ? output : fallback;
  };

  const attachmentItems = useMemo(() => {
    if (!issueDetail || typeof issueDetail !== "object") return [];

    const possibleAttachments = [
      issueDetail.attachment_urls,
      issueDetail.attachments,
      issueDetail.image_urls,
      issueDetail.images,
      issueDetail.files,
    ];

    const normalized = possibleAttachments.flatMap((entry) => {
      if (!entry) return [];
      if (Array.isArray(entry)) return entry;
      return [entry];
    });

    return normalized
      .map((item, index) => {
        if (typeof item === "string") {
          const isImage =
            /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|$)/i.test(item);
          return {
            url: item,
            name: `Attachment ${index + 1}`,
            isImage,
          };
        }

        if (item && typeof item === "object") {
          const url = item.url || item.file_url || item.path || "";
          if (!url) return null;

          const contentType = (
            item.content_type ||
            item.mime_type ||
            item.type ||
            ""
          ).toLowerCase();
          const isImage =
            contentType.startsWith("image/") ||
            /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|$)/i.test(url);

          return {
            url,
            name: item.name || item.filename || `Attachment ${index + 1}`,
            isImage,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [issueDetail]);

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

      <div className="px-6 pt-4 overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {[
          {
            label: "Total",
            value: statusCounts.total,
            tone: "text-slate-900",
            filter: "ALL",
          },
          {
            label: "Pending",
            value: statusCounts.pending,
            tone: "text-amber-700",
            filter: "PENDING_VERIFICATION",
          },
          {
            label: "Open",
            value: statusCounts.open,
            tone: "text-blue-700",
            filter: "OPEN",
          },
          {
            label: "In Progress",
            value: statusCounts.inProgress,
            tone: "text-indigo-700",
            filter: "IN_PROGRESS",
          },
          {
            label: "Close",
            value: statusCounts.closed,
            tone: "text-emerald-700",
            filter: "CLOSED",
          },
          ...(statusCounts.rejected > 0
            ? [
                {
                  label: "Rejected",
                  value: statusCounts.rejected,
                  tone: "text-rose-700",
                  filter: "REJECTED",
                },
              ]
            : []),
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveStatusFilter(item.filter)}
              className={`min-w-[190px] rounded-2xl border bg-white px-5 py-5 shadow-sm text-left transition-colors ${activeStatusFilter === item.filter
                ? "border-blue-300 ring-2 ring-blue-100"
                : "border-slate-200 hover:border-slate-300"
                }`}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                {item.label}
              </p>
              <p className={`mt-3 text-3xl font-bold leading-none ${item.tone}`}>
                {item.value}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Loading issues...
          </div>
        ) : paginatedIssues.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            {issues.length === 0
              ? "No issues found"
              : "No issues for selected status"}
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
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenIssueDetail(issue.issue_label)}
                        disabled={!issue.issue_label}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {issue.status?.toUpperCase() === "PENDING_VERIFICATION" && (
                        <button
                          onClick={() => handleVerifyClick(issue)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors inline-flex items-center gap-2"
                        >
                          <Check size={16} />
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredIssues.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-4 text-sm text-gray-600">
          <p>
            {filteredIssues.length === 0
              ? "Showing 0 of 0 issues"
              : `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filteredIssues.length)} of ${filteredIssues.length} issues`}
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

      {/* Issue Detail Modal */}
      {detailIssueLabel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Issue Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Issue: <span className="font-semibold">{detailIssueLabel}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeIssueDetailModal}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Close issue details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {isIssueDetailLoading ? (
                <div className="text-sm text-gray-500">Loading issue details...</div>
              ) : issueDetailError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                  Failed to load issue details:{" "}
                  {issueDetailError.detail || issueDetailError.message || "Unknown error"}
                </div>
              ) : !issueDetail || typeof issueDetail !== "object" ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
                  Issue details not available.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Issue Label
                      </p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        {formatText(issueDetail.issue_label || detailIssueLabel)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Status
                      </p>
                      <div className="mt-2">
                        <Badge variant={getStatusVariant(issueDetail.status)}>
                          {formatText(issueDetail.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Priority
                      </p>
                      <div className="mt-2">
                        <Badge variant={getPriorityVariant(issueDetail.issue_priority)}>
                          {formatText(issueDetail.issue_priority)}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Issue Type
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(issueDetail.issue_type)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Reported At
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(issueDetail.created_at)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Assigned To
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(issueDetail.assigned_to)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Department
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(
                          issueDetail.issue_type ||
                            issueDetail.department_name ||
                            issueDetail.department?.name ||
                            issueDetail.department,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Reported By
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(
                          issueDetail.reported_by ||
                            issueDetail.citizen_name ||
                            issueDetail.user_name ||
                            issueDetail.user?.name,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                      Description
                    </p>
                    <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                      {formatText(issueDetail.description)}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-red-700">
                      Rejected Reason
                    </p>
                    <p className="mt-2 text-sm text-red-800 whitespace-pre-wrap">
                      {formatText(
                        issueDetail.rejected_reason ||
                          issueDetail.rejection_reason ||
                          issueDetail.reason,
                      )}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Issue Location
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(
                          issueDetail.issue_location ||
                            issueDetail.address ||
                            issueDetail.location_text ||
                            issueDetail.location,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Latitude
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(issueDetail.latitude)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Longitude
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {formatText(issueDetail.longitude)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                      Attachments
                    </p>

                    {attachmentItems.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-500">
                        No attachments available.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {attachmentItems.map((item, index) => (
                          <div
                            key={`${item.url}-${index}`}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            {item.isImage ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={item.url}
                                  alt={item.name || `Attachment ${index + 1}`}
                                  className="w-full max-h-64 rounded-md object-cover border border-gray-200"
                                />
                              </a>
                            ) : null}

                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
                            >
                              <Paperclip size={16} />
                              {item.name || `Attachment ${index + 1}`}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
