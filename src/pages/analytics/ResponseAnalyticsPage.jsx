import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { useResponseAnalytics } from "@/hooks/data/useResponseAnalytics";

const STATUS_COLORS = {
  RESOLVED: "#22c55e",
  CLOSED: "#16a34a",
  IN_PROGRESS: "#f59e0b",
  OPEN: "#3b82f6",
  PENDING_VERIFICATION: "#ef4444",
  REJECTED: "#94a3b8",
};

const CATEGORY_PALETTE = [
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
];

const getStatusKey = (status) => (status || "Unknown").toUpperCase();

const getMonthKey = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 7);
};

const formatMonthLabel = (key) => {
  if (!key) return "";
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "short" });
};

const formatPriorityLabel = (priority) => {
  const p = String(priority || "").toUpperCase();
  if (p === "HIGH") return "High";
  if (p === "LOW") return "Low";
  if (p === "NORMAL") return "Medium";
  return p || "Unknown";
};

/** Format resolution_rate from API (0–1) for display. */
const formatRate = (rate) => {
  if (typeof rate !== "number" || Number.isNaN(rate)) return "—";
  const n = rate <= 1 ? Math.round(rate * 100) : Math.round(rate);
  return `${n}%`;
};

/** Short label for daily trend axis */
const shortDate = (isoDate) => {
  if (!isoDate) return "";
  const s = String(isoDate);
  return s.length >= 10 ? s.slice(5, 10) : s;
};

const ResolutionRateBadge = ({ rate }) => {
  if (typeof rate !== "number" || Number.isNaN(rate))
    return <span className="text-slate-400">—</span>;
  const n = rate <= 1 ? Math.round(rate * 100) : Math.round(rate);
  let colorClass = "bg-slate-100 text-slate-700";
  if (n >= 80) colorClass = "bg-green-100 text-green-700 border-green-200";
  else if (n >= 50) colorClass = "bg-amber-100 text-amber-700 border-amber-200";
  else colorClass = "bg-red-100 text-red-700 border-red-200";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      {n}%
    </span>
  );
};

function buildTimelineFromIssues(issues) {
  const monthBuckets = new Map();
  issues.forEach((issue) => {
    const createdKey = getMonthKey(issue.created_at);
    if (createdKey) {
      if (!monthBuckets.has(createdKey)) {
        monthBuckets.set(createdKey, { reported: 0, resolved: 0 });
      }
      monthBuckets.get(createdKey).reported += 1;
    }

    const statusKey = getStatusKey(issue.status);
    if (statusKey === "RESOLVED" || statusKey === "CLOSED") {
      const resolvedKey = getMonthKey(issue.resolved_at || issue.updated_at);
      if (resolvedKey) {
        if (!monthBuckets.has(resolvedKey)) {
          monthBuckets.set(resolvedKey, { reported: 0, resolved: 0 });
        }
        monthBuckets.get(resolvedKey).resolved += 1;
      }
    }
  });

  const lastEightMonths = [];
  const now = new Date();
  for (let i = 7; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toISOString().slice(0, 7);
    const bucket = monthBuckets.get(key) || { reported: 0, resolved: 0 };
    lastEightMonths.push({
      month: formatMonthLabel(key),
      reported: bucket.reported,
      resolved: bucket.resolved,
    });
  }

  const mostActiveMonth = lastEightMonths.reduce(
    (max, current) => (current.reported > max.reported ? current : max),
    lastEightMonths[0] || { month: "--", reported: 0 },
  ).month;

  return { monthlyTrends: lastEightMonths, mostActiveMonth };
}

function buildAvgResolutionFromIssues(issues) {
  const resolvedDurations = issues
    .filter((issue) => {
      const key = getStatusKey(issue.status);
      return key === "RESOLVED" || key === "CLOSED";
    })
    .map((issue) => {
      const start = new Date(issue.created_at || 0).getTime();
      const end = new Date(
        issue.resolved_at || issue.updated_at || 0,
      ).getTime();
      if (!start || !end || Number.isNaN(start) || Number.isNaN(end))
        return null;
      return Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
    })
    .filter((value) => value !== null);

  if (!resolvedDurations.length) return "--";
  const avg =
    resolvedDurations.reduce((sum, v) => sum + v, 0) / resolvedDurations.length;
  return `${avg.toFixed(1)} days`;
}

function buildAnalyticsFromIssuesOnly(issues) {
  const total = issues.length;
  const statusCounts = issues.reduce((acc, issue) => {
    const key = getStatusKey(issue.status);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const resolvedCount =
    (statusCounts.RESOLVED || 0) + (statusCounts.CLOSED || 0);
  const pendingCount = statusCounts.PENDING_VERIFICATION || 0;
  const openCount = statusCounts.OPEN || 0;
  const inProgressCount = statusCounts.IN_PROGRESS || 0;

  const { monthlyTrends, mostActiveMonth } = buildTimelineFromIssues(issues);

  const categoryCounts = issues.reduce((acc, issue) => {
    const key = issue.issue_type || issue.department_name || "Unassigned";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], index) => ({
      name,
      value,
      fill: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
    }));

  const statusDistribution = Object.entries(statusCounts).map(
    ([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      fill: STATUS_COLORS[name] || "#94a3b8",
    }),
  );

  return {
    resolvedCount,
    rejectedCount: statusCounts.REJECTED || 0,
    pendingCount,
    openCount,
    inProgressCount,
    totalIssues: total,
    avgResolutionTime: buildAvgResolutionFromIssues(issues),
    resolutionRate: total
      ? `${Math.round((resolvedCount / total) * 100)}%`
      : "0%",
    mostActiveMonth: mostActiveMonth || "--",
    monthlyTrends,
    categoryBreakdown,
    statusDistribution,
  };
}

export default function ResponseAnalyticsPage({ user, onLogout }) {
  const deptId =
    user?.department_id ??
    user?.department?.department_id ??
    user?.department?.id ??
    undefined;

  const {
    deptEnabled,
    stats,
    employeesPayload,
    trendPayload,
    teamsPayload,
    issuesData,
    isLoading,
    isError,
  } = useResponseAnalytics(deptId);

  const issues = useMemo(
    () => (Array.isArray(issuesData) ? issuesData : []),
    [issuesData],
  );

  const dailyTrendData = useMemo(() => {
    const raw = trendPayload?.trend;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return raw.map((point) => ({
      date: point.date,
      short: shortDate(point.date),
      count: point.count ?? 0,
    }));
  }, [trendPayload]);

  const employeeRows = useMemo(() => {
    const list = employeesPayload?.employees;
    return Array.isArray(list) ? list : [];
  }, [employeesPayload]);

  const teamRows = useMemo(() => {
    const list = teamsPayload?.teams;
    return Array.isArray(list) ? list : [];
  }, [teamsPayload]);

  /** Best completion rates among your department roster only (same data as the table above). */
  const topEmployeesFiltered = useMemo(() => {
    return [...employeeRows]
      .filter((r) => (r.total_assigned ?? 0) > 0)
      .sort((a, b) => (b.resolution_rate ?? 0) - (a.resolution_rate ?? 0))
      .slice(0, 10);
  }, [employeeRows]);

  /** Your teams ranked by how many reports they are carrying (department data only). */
  const topTeamsFiltered = useMemo(() => {
    return [...teamRows]
      .sort((a, b) => (b.assigned_issues ?? 0) - (a.assigned_issues ?? 0))
      .slice(0, 10);
  }, [teamRows]);

  const analytics = useMemo(() => {
    const { monthlyTrends, mostActiveMonth } = buildTimelineFromIssues(issues);
    const avgResolutionTime = buildAvgResolutionFromIssues(issues);

    const hasStatsPayload =
      stats &&
      typeof stats === "object" &&
      !Array.isArray(stats) &&
      typeof stats.total_issues === "number" &&
      stats.total_issues >= 0;

    if (!hasStatsPayload) {
      return buildAnalyticsFromIssuesOnly(issues);
    }

    const total =
      typeof stats.total_issues === "number" ? stats.total_issues : 0;
    const resolved =
      typeof stats.resolved_issues === "number" ? stats.resolved_issues : 0;
    const rejected =
      typeof stats.rejected_issues === "number" ? stats.rejected_issues : 0;
    const pending =
      typeof stats.pending_verification_issues === "number"
        ? stats.pending_verification_issues
        : 0;
    const open = typeof stats.open_issues === "number" ? stats.open_issues : 0;
    const inProgress =
      typeof stats.in_progress_issues === "number"
        ? stats.in_progress_issues
        : 0;

    const resolutionRate = total
      ? `${Math.round((resolved / total) * 100)}%`
      : "0%";

    let categoryBreakdown = [];
    const rawPriority = stats.priority_breakdown;
    if (Array.isArray(rawPriority) && rawPriority.length > 0) {
      categoryBreakdown = [...rawPriority]
        .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        .slice(0, 6)
        .map((row, index) => ({
          name: formatPriorityLabel(row.priority),
          value: row.count ?? 0,
          fill: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
        }));
    } else {
      categoryBreakdown =
        buildAnalyticsFromIssuesOnly(issues).categoryBreakdown;
    }

    let statusDistribution = [];
    const rawStatuses = stats.status_breakdown;
    if (Array.isArray(rawStatuses) && rawStatuses.length > 0) {
      statusDistribution = rawStatuses.map((row) => {
        const key = String(row.status || "").toUpperCase();
        return {
          name: key.replace(/_/g, " "),
          value: row.count ?? 0,
          fill: STATUS_COLORS[key] || "#94a3b8",
        };
      });
    } else {
      statusDistribution =
        buildAnalyticsFromIssuesOnly(issues).statusDistribution;
    }

    return {
      resolvedCount: resolved,
      rejectedCount: rejected,
      totalIssues: total,
      pendingCount: pending,
      openCount: open,
      inProgressCount: inProgress,
      avgResolutionTime,
      resolutionRate,
      mostActiveMonth: mostActiveMonth || "--",
      monthlyTrends,
      categoryBreakdown,
      statusDistribution,
    };
  }, [stats, issues]);

  const tableCardClass =
    "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden";
  const tableClass = "min-w-full text-sm text-slate-700";
  const thClass =
    "text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 px-4 py-3 border-b border-slate-100";
  const tdClass = "px-4 py-3 border-b border-slate-50";

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 space-y-8">
        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
            Loading your overview…
          </div>
        )}

        {isError && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-sm text-red-700">
            We could not load this page. Please refresh, or try again in a
            moment.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="mb-2"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-12 rounded-full bg-blue-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Closed reports
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.resolvedCount}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {analytics.resolutionRate} of all reports are closed
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-12 rounded-full bg-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Waiting for verification
                </p>
                <p className="text-3xl font-semibold text-amber-600 mt-2">
                  {analytics.pendingCount}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {analytics.openCount + analytics.inProgressCount} reports
                  still open or being worked on
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-12 rounded-full bg-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Busiest month
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.mostActiveMonth}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Highest number of incoming reports (last eight months)
                </p>
              </div>

              {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-12 rounded-full bg-indigo-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  All reports counted
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.totalIssues ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Count for this department alone
                </p>
              </div> */}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-12 rounded-full bg-rose-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Rejected after review
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.rejectedCount ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Reports that did not pass review
                </p>
              </div>
            </div>

            {/* {deptEnabled && employeesPayload && (
              <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Your people
                </span>
                <span className="text-sm text-slate-700">
                  <strong className="text-slate-900">
                    {employeesPayload.total_employees ?? employeeRows.length}
                  </strong>{" "}
                  staff members in the tables below
                </span>
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  Typical share of assigned work closed:
                  <ResolutionRateBadge
                    rate={employeesPayload.avg_resolution_rate}
                  />
                </span>
              </div>
            )} */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Month by month
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      New reports vs closed
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Blue is how many reports arrived each month. Green is how
                      many were closed.
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    Last 8 months
                  </span>
                </div>
                <div className="h-[300px] sm:h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.monthlyTrends}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "13px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reported"
                        name="New reports"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Closed"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Day by day
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      New reports over time
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Each day: how many new reports came in. Useful for
                      spotting busy weeks.
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0 text-right max-w-[8rem]">
                    Last 3 months
                  </span>
                </div>
                {dailyTrendData.length === 0 ? (
                  <p className="text-sm text-slate-500 py-12 text-center">
                    No daily counts for this period yet.
                  </p>
                ) : (
                  <div className="h-[300px] sm:h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={dailyTrendData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
                      >
                        <defs>
                          <linearGradient
                            id="trendBlue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2563eb"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="#2563eb"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="short"
                          stroke="#6b7280"
                          tick={{ fontSize: 10 }}
                          interval={Math.ceil(dailyTrendData.length / 12)}
                        />
                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <Tooltip
                          labelFormatter={(l, payload) =>
                            payload?.[0]?.payload?.date ?? l
                          }
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "13px" }} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name="New reports that day"
                          stroke="#2563eb"
                          fill="url(#trendBlue)"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Urgency
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      Reports by priority
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      How many reports were marked low, medium, or high urgency.
                    </p>
                  </div>
                </div>
                <div className="h-[300px] sm:h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.categoryBreakdown}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {analytics.categoryBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Current picture
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      Where reports stand today
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Open, in progress, waiting for checks, closed, and so on.
                    </p>
                  </div>
                </div>
                <div className="h-[320px] sm:h-[340px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={140}
                        labelLine={false}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {analytics.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = analytics.statusDistribution.reduce(
                            (sum, item) => sum + item.value,
                            0,
                          );
                          const percentage = total
                            ? ((value / total) * 100).toFixed(0)
                            : 0;
                          return [`${value} (${percentage}%)`, name];
                        }}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "13px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${tableCardClass}`}>
                <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Staff
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    Who has what work
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Each person’s assignments, closures, and work still in
                    progress.
                  </p>
                </div>
                <div className="p-6">
                  <div className="max-h-[360px] overflow-y-auto pr-2">
                    <div className="flex flex-col gap-3 pb-2">
                      {!deptEnabled || employeeRows.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-sm text-slate-500">
                            {deptEnabled
                              ? "No staff records to show for your department."
                              : "Sign in as a department admin with a linked department to see this data."}
                          </p>
                        </div>
                      ) : (
                        employeeRows.map((row) => (
                          <div
                            key={row.employee_id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all group"
                          >
                            <div className="mb-3 sm:mb-0">
                              <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {row.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                                  {row.total_assigned ?? 0} Assigned
                                </span>
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-medium">
                                  {row.resolved_count ?? 0} Closed
                                </span>
                                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-medium">
                                  {row.in_progress_count ?? 0} In Progress
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[140px]">
                              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                Completion
                              </span>
                              <ResolutionRateBadge rate={row.resolution_rate} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${tableCardClass}`}>
                <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Teams
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    Teams at a glance
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Team size, who is free or busy, and how many reports sit
                    with each team.
                  </p>
                </div>
                <div className="p-6">
                  <div className="max-h-[360px] overflow-y-auto pr-2">
                    <div className="flex flex-col gap-6 pb-2">
                      {!deptEnabled || teamRows.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-sm text-slate-500">
                            {deptEnabled
                              ? "No teams listed for your department yet."
                              : "Sign in as a department admin with a linked department to see this data."}
                          </p>
                        </div>
                      ) : (
                        teamRows.map((row) => {
                          const total = row.total_members || 1;
                          const busy = row.busy_members || 0;
                          const available = row.available_members || 0;
                          const busyPct = Math.round((busy / total) * 100);
                          const availPct = Math.round(
                            (available / total) * 100,
                          );

                          let workloadColor = "bg-green-500";
                          if (busyPct > 80) workloadColor = "bg-red-500";
                          else if (busyPct > 50) workloadColor = "bg-amber-500";

                          return (
                            <div key={row.team_id} className="group">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {row.team_name}
                                </span>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                  {row.assigned_issues} open reports
                                </span>
                              </div>
                              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                  className={`h-full ${workloadColor} transition-all duration-500`}
                                  style={{ width: `${busyPct}%` }}
                                  title={`${busy} busy`}
                                ></div>
                                <div
                                  className="h-full bg-slate-200 transition-all duration-500"
                                  style={{ width: `${availPct}%` }}
                                  title={`${available} available`}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[11px] font-medium text-slate-500 mt-2 uppercase tracking-wider">
                                <span
                                  className={
                                    busyPct > 50 ? "text-slate-700" : ""
                                  }
                                >
                                  {busy} Busy
                                </span>
                                <span>{total} Total Members</span>
                                <span
                                  className={
                                    availPct > 50 ? "text-green-600" : ""
                                  }
                                >
                                  {available} Available
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${tableCardClass}`}>
                <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Leaders
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    Standout staff
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    The same department roster as the table above, sorted by who
                    closes the largest share of their assigned work (among
                    people who have assignments).
                  </p>
                </div>
                <div className="p-6">
                  <div className="max-h-[360px] overflow-y-auto pr-2">
                    <div className="flex flex-col gap-6 pb-2">
                      {topEmployeesFiltered.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-sm text-slate-500">
                            No one matches this view yet.
                          </p>
                        </div>
                      ) : (
                        topEmployeesFiltered.map((row, idx) => {
                          let badge = null;
                          let borderClass = "border-slate-100";
                          let bgClass = "bg-white";

                          if (idx === 0) {
                            badge = "🥇";
                            borderClass = "border-yellow-300";
                            bgClass =
                              "bg-gradient-to-r from-yellow-50 to-white";
                          } else if (idx === 1) {
                            badge = "🥈";
                            borderClass = "border-slate-300";
                            bgClass = "bg-gradient-to-r from-slate-50 to-white";
                          } else if (idx === 2) {
                            badge = "🥉";
                            borderClass = "border-amber-600/30";
                            bgClass =
                              "bg-gradient-to-r from-amber-50/50 to-white";
                          }

                          const n =
                            row.resolution_rate <= 1
                              ? Math.round(row.resolution_rate * 100)
                              : Math.round(row.resolution_rate);

                          return (
                            <div
                              key={row.employee_id}
                              className={`flex items-center justify-between p-5 rounded-xl border ${borderClass} ${bgClass} shadow-sm transition-all hover:shadow-md`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                                  {badge || (
                                    <span className="text-sm font-semibold text-slate-500">
                                      #{idx + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900">
                                    {row.name}
                                  </h4>
                                  <p className="text-xs text-slate-500">
                                    {row.resolved_count} closed issues
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <ResolutionRateBadge
                                  rate={row.resolution_rate}
                                />
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden ml-auto">
                                  <div
                                    className={`h-full ${
                                      n >= 80
                                        ? "bg-green-500"
                                        : n >= 50
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ width: `${n}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${tableCardClass}`}>
                <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Leaders
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    Teams carrying the most work
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Your teams ranked by open reports assigned to them. Only
                    your department’s teams are listed.
                  </p>
                </div>
                <div className="p-6">
                  <div className="max-h-[360px] overflow-y-auto pr-2">
                    <div className="flex flex-col gap-6 pb-2">
                      {topTeamsFiltered.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-sm text-slate-500">
                            No teams listed for your department yet.
                          </p>
                        </div>
                      ) : (
                        topTeamsFiltered.map((row, idx) => {
                          const maxReports = Math.max(
                            ...topTeamsFiltered.map(
                              (t) => t.assigned_issues || 0,
                            ),
                            1,
                          );
                          const pct = Math.round(
                            ((row.assigned_issues || 0) / maxReports) * 100,
                          );

                          return (
                            <div
                              key={row.team_id}
                              className="relative p-5 rounded-xl border border-slate-100 bg-white hover:border-red-100 hover:shadow-sm transition-all group overflow-hidden z-0"
                            >
                              <div
                                className="absolute top-0 left-0 h-full bg-red-50/50 -z-10 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              ></div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                                    #{idx + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                                      {row.team_name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {row.total_members} Members •{" "}
                                      <span className="font-medium text-slate-700">
                                        {row.available_members} Available
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-red-600">
                                    {row.assigned_issues || 0}
                                  </div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mt-0.5">
                                    Open Reports
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
