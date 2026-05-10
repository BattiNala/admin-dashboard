import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getEmployeeAnalytics,
  getIssueStats,
  getIssueTrend,
  getTeamAnalytics,
} from "@/api/services/analytics";
import { listIssues } from "@/api/services/issues";

const ISSUES_QUERY_KEY = ["issues", null, null, null, null];
const TREND_DAYS = 90;

/**
 * Analytics for the logged-in department only (stats, employees, teams, trend scoped by `department_id`,
 * plus the RBAC-scoped issue list). No cross-department comparison or leaderboard endpoints are called.
 */
export const useResponseAnalytics = (departmentId) => {
  const numericDept =
    departmentId != null && departmentId !== ""
      ? Number(departmentId)
      : null;
  
  // Always enable queries so backend can infer department from token if not provided.
  const deptEnabled = true;

  const queries = useQueries({
    queries: [
      {
        queryKey: ["analytics", "issue-stats", numericDept],
        queryFn: () => getIssueStats({ departmentId: numericDept }),
        enabled: deptEnabled,
      },
      {
        queryKey: ["analytics", "employees", numericDept],
        queryFn: () => getEmployeeAnalytics({ departmentId: numericDept }),
        enabled: deptEnabled,
      },
      {
        queryKey: ["analytics", "issue-trend", numericDept, TREND_DAYS],
        queryFn: () =>
          getIssueTrend({ departmentId: numericDept, days: TREND_DAYS }),
        enabled: deptEnabled,
      },
      {
        queryKey: ["analytics", "teams", numericDept],
        queryFn: () => getTeamAnalytics({ departmentId: numericDept }),
        enabled: deptEnabled,
      },
      {
        queryKey: ISSUES_QUERY_KEY,
        queryFn: async () => {
          const data = await listIssues({});
          return Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [];
        },
      },
    ],
  });

  const [statsQuery, employeesQuery, trendQuery, teamsQuery, issuesQuery] =
    queries;



  const deptScopedPending =
    deptEnabled &&
    (statsQuery.isPending ||
      employeesQuery.isPending ||
      trendQuery.isPending ||
      teamsQuery.isPending);

  const isLoading = issuesQuery.isPending || deptScopedPending;

  const isError =
    issuesQuery.isError ||
    (deptEnabled &&
      (statsQuery.isError ||
        employeesQuery.isError ||
        trendQuery.isError ||
        teamsQuery.isError));

  return {
    deptEnabled,
    numericDept,
    stats: statsQuery.data,
    employeesPayload: employeesQuery.data,
    trendPayload: trendQuery.data,
    teamsPayload: teamsQuery.data,
    issuesData: Array.isArray(issuesQuery.data) ? issuesQuery.data : [],
    isLoading,
    isError,
    issuesError: issuesQuery.isError,
  };
};
