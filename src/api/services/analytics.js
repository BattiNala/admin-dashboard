import { apiClient } from "@/api/client";

const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

/** GET /analytics/issues/stats */
export const getIssueStats = ({
  departmentId,
  dateFrom,
  dateTo,
} = {}) => {
  return apiClient.get(
    `/analytics/issues/stats${buildQuery({
      department_id: departmentId,
      date_from: dateFrom,
      date_to: dateTo,
    })}`,
  );
};

/** GET /analytics/employees */
export const getEmployeeAnalytics = ({ departmentId } = {}) => {
  return apiClient.get(
    `/analytics/employees${buildQuery({ department_id: departmentId })}`,
  );
};

/** GET /analytics/issues/trend */
export const getIssueTrend = ({
  days = 90,
  departmentId,
} = {}) => {
  return apiClient.get(
    `/analytics/issues/trend${buildQuery({
      days,
      department_id: departmentId,
    })}`,
  );
};

/** GET /analytics/teams */
export const getTeamAnalytics = ({ departmentId } = {}) => {
  return apiClient.get(
    `/analytics/teams${buildQuery({ department_id: departmentId })}`,
  );
};
