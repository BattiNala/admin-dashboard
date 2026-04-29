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
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { useListIssues } from "@/hooks/data/useIssues";

const STATUS_COLORS = {
  RESOLVED: "#22c55e",
  CLOSED: "#16a34a",
  IN_PROGRESS: "#f59e0b",
  OPEN: "#3b82f6",
  PENDING_VERIFICATION: "#ef4444",
};

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

export default function ResponseAnalyticsPage({ user, onLogout }) {
  const { data: issuesData = [], isLoading, isError } = useListIssues();
  const issues = Array.isArray(issuesData) ? issuesData : [];

  const analytics = useMemo(() => {
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
        const diffDays = Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
        return diffDays;
      })
      .filter((value) => value !== null);

    const avgResolutionTime = resolvedDurations.length
      ? `${(
          resolvedDurations.reduce((sum, value) => sum + value, 0) /
          resolvedDurations.length
        ).toFixed(1)} days`
      : "--";

    const resolutionRate = total
      ? `${Math.round((resolvedCount / total) * 100)}%`
      : "0%";

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
        fill: [
          "#0ea5e9",
          "#22c55e",
          "#f97316",
          "#6366f1",
          "#14b8a6",
          "#f43f5e",
        ][index % 6],
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
      pendingCount,
      openCount,
      inProgressCount,
      avgResolutionTime,
      resolutionRate,
      mostActiveMonth: mostActiveMonth || "--",
      monthlyTrends: lastEightMonths,
      categoryBreakdown,
      statusDistribution,
    };
  }, [issues]);

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 space-y-8">
        {/* <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -left-10 -bottom-14 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Performance overview
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 mt-2">
                Response Analytics
              </h1>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                Department-wide performance, backlog pressure, and resolution
                rhythm across the last eight months.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Live feed from issue tracking
            </div>
          </div>
        </div> */}

        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
            Loading analytics...
          </div>
        )}

        {isError && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-sm text-red-700">
            Failed to load analytics. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="h-1.5 w-12 rounded-full bg-blue-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Total Resolved
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.resolvedCount}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Resolution rate {analytics.resolutionRate}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="h-1.5 w-12 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Avg Resolution Time
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.avgResolutionTime}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Based on resolved issues
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="h-1.5 w-12 rounded-full bg-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Pending Verification
                </p>
                <p className="text-3xl font-semibold text-amber-600 mt-2">
                  {analytics.pendingCount}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Open backlog {analytics.openCount + analytics.inProgressCount}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="h-1.5 w-12 rounded-full bg-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mt-4">
                  Most Active Month
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {analytics.mostActiveMonth}
                </p>
                <p className="text-xs text-slate-500 mt-2">Last 8 months</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Timeline
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      Monthly Resolution Trends
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">Last 8 months</span>
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
                        name="Reported"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved"
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
                      Categories
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      Hazard Category Breakdown
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">Top 6</span>
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
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#0ea5e9"
                        radius={[10, 10, 0, 0]}
                      >
                        {analytics.categoryBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Status
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      Overall Status Distribution
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Current snapshot
                  </span>
                </div>
                <div className="h-[320px] sm:h-[400px] flex items-center justify-center">
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
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
