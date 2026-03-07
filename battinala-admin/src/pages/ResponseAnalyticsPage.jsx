// src/pages/ResponseAnalyticsPage.jsx
import React from "react";
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
import MainLayout from "../components/layout/MainLayout";

// Mock data - replace with real API later
const monthlyTrends = [
  { month: "Jul", reported: 45, resolved: 30 },
  { month: "Aug", reported: 52, resolved: 38 },
  { month: "Sep", reported: 48, resolved: 40 },
  { month: "Oct", reported: 61, resolved: 50 },
  { month: "Nov", reported: 55, resolved: 45 },
  { month: "Dec", reported: 58, resolved: 52 },
  { month: "Jan", reported: 64, resolved: 58 },
  { month: "Feb", reported: 70, resolved: 62 },
];

const categoryBreakdown = [
  { name: "Electricity", value: 320, fill: "#3b82f6" },
  { name: "Water", value: 280, fill: "#10b981" },
];

const statusDistribution = [
  { name: "Resolved", value: 420, fill: "#22c55e" },
  { name: "In Progress", value: 180, fill: "#eab308" },
  { name: "Pending", value: 220, fill: "#ef4444" },
];

const summaryStats = {
  totalResolved: 420,
  avgResolutionTime: "4.8 days",
  resolutionRate: "62%",
  mostActiveMonth: "Feb 2026",
};

export default function ResponseAnalyticsPage({ user, onLogout }) {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Response Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of hazard resolution trends and performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Resolved</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {summaryStats.totalResolved}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">
              Avg Resolution Time
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {summaryStats.avgResolutionTime}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {summaryStats.resolutionRate}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">
              Most Active Month
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {summaryStats.mostActiveMonth}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Monthly Trends - Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Monthly Resolution Trends
            </h3>
            <div className="h-300px sm:h-340px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrends}
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
                    name="Reported Hazards"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved Hazards"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown - Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Hazard Category Breakdown
            </h3>
            <div className="h-300px sm:h-340px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryBreakdown}
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
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution - Pie Chart (no custom label) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Overall Status Distribution
            </h3>
            <div className="h-320px sm:h-400px flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    labelLine={false}
                    // No custom label → percentages will show in tooltip only
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${((value / statusDistribution.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%)`,
                      name,
                    ]}
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
      </div>
    </MainLayout>
  );
}
