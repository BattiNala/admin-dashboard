// src/views/DashboardView.jsx
import React from "react";
import {
  LayoutDashboard,
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
  LogOut,
  Download,
  Search,
  Droplets,
  Zap,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import StatCard from "../components/common/StatCard";
import HighlightCard from "../components/dashboard/HighlightCard";

// Mock data
const statsData = {
  totalReports: 1248,
  pendingReports: 342,
  inProgressReports: 186,
  resolvedReports: 720,
  todayReports: 47,
  activeUsers: 8934,
  municipalStaff: 156,
  averageResolutionTime: "4.2 hours",
};

const monthlyData = [
  { month: "Jul", water: 45, electricity: 38 },
  { month: "Aug", water: 52, electricity: 42 },
  { month: "Sep", water: 48, electricity: 55 },
  { month: "Oct", water: 61, electricity: 48 },
  { month: "Nov", water: 55, electricity: 52 },
  { month: "Dec", water: 58, electricity: 61 },
  { month: "Jan", water: 64, electricity: 57 },
];

const statusData = [
  { name: "Resolved", value: 720, color: "#22c55e" },
  { name: "In Progress", value: 186, color: "#eab308" },
  { name: "Pending", value: 342, color: "#ef4444" },
];

const mockIssues = [
  {
    id: "1",
    category: "water",
    description: "Water pipeline burst near Thamel",
    locationName: "Thamel, Kathmandu",
    reportedBy: "Ram Sharma",
    reportedAt: "2025-01-26 09:30",
    status: "in-progress",
  },
  {
    id: "2",
    category: "electricity",
    description: "Power outage in Patan area",
    locationName: "Patan, Lalitpur",
    reportedBy: "Sita Thapa",
    reportedAt: "2025-01-26 10:15",
    status: "pending",
  },
  {
    id: "3",
    category: "water",
    description: "Low water pressure",
    locationName: "Baluwatar, Kathmandu",
    reportedBy: "Hari Prasad",
    reportedAt: "2025-01-25 14:20",
    status: "resolved",
  },
  {
    id: "4",
    category: "electricity",
    description: "Street lights not working",
    locationName: "Bhaktapur",
    reportedBy: "Maya Gurung",
    reportedAt: "2025-01-26 08:45",
    status: "in-progress",
  },
  {
    id: "5",
    category: "water",
    description: "Contaminated water supply",
    locationName: "Kathmandu",
    reportedBy: "Krishna Tamang",
    reportedAt: "2025-01-26 11:00",
    status: "pending",
  },
  {
    id: "6",
    category: "electricity",
    description: "Transformer failure",
    locationName: "Kirtipur",
    reportedBy: "Anita Rai",
    reportedAt: "2025-01-25 16:30",
    status: "resolved",
  },
  {
    id: "7",
    category: "water",
    description: "Leakage in main supply line",
    locationName: "Lazimpat",
    reportedBy: "Suman Shrestha",
    reportedAt: "2025-02-01 08:20",
    status: "in-progress",
  },
  {
    id: "8",
    category: "electricity",
    description: "Frequent voltage fluctuation",
    locationName: "Koteshwor",
    reportedBy: "Puja Karki",
    reportedAt: "2025-02-02 14:45",
    status: "pending",
  },
];

// Pie chart custom label
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardView({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-1600px mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/batti-nala.png"
              alt="BattiNala"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-md"
            />

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                BattiNala Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                System-wide monitoring and management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 md:gap-8">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-12">
        <div className="max-w-1600px mx-auto px-5 md:px-8 py-6 lg:py-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-8">
            <StatCard
              icon={LayoutDashboard}
              title="Total Reports"
              value={statsData.totalReports.toLocaleString()}
              trend="+12% today"
              trendColor="green"
              bgColor="blue"
            />
            <StatCard
              icon={AlertCircle}
              title="Pending Reports"
              value={statsData.pendingReports}
              subtitle={`${statsData.todayReports} today`}
              trendColor="red"
              bgColor="red"
            />
            <StatCard
              icon={Clock}
              title="Active Cases"
              value={statsData.inProgressReports}
              subtitle="In Progress"
              trendColor="yellow"
              bgColor="yellow"
            />
            <StatCard
              icon={CheckCircle}
              title="Resolved Issues"
              value={statsData.resolvedReports}
              subtitle={`Avg: ${statsData.averageResolutionTime}`}
              bgColor="green"
            />
          </div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-10">
            <HighlightCard
              icon={Users}
              title="Active Citizens"
              value={statsData.activeUsers.toLocaleString()}
              color="blue"
              progressWidth="68%"
            />
            <HighlightCard
              icon={TrendingUp}
              title="Municipal Staff"
              value={statsData.municipalStaff}
              color="yellow"
              progressWidth="85%"
            />
            <HighlightCard
              icon={MapPin}
              title="Districts Covered"
              value="75+"
              color="green"
              progressWidth="92%"
            />
          </div>

          {/* Charts + Table Section */}
          <div className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Monthly Report Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Report Trends
                  </h3>
                  <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    <Download size={16} />
                    Export
                  </button>
                </div>

                <div className="h-340px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
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
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [`${value} Issues`, ""]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "13px" }}
                      />

                      <Line
                        type="monotone"
                        dataKey="electricity"
                        name="Electricity Issues"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="water"
                        name="Water Issues"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Status Distribution
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-gray-700">Resolved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-gray-700">In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="text-gray-700">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="h-340px flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={1}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} (${((value / statsData.totalReports) * 100).toFixed(0)}%)`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Reports Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Reports
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search reports..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Categories</option>
                      <option>Water</option>
                      <option>Electricity</option>
                    </select>

                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-900px">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Reported By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockIssues.slice(0, 8).map((issue) => (
                      <tr
                        key={issue.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{issue.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {issue.category === "water" ? (
                              <Droplets className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Zap className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="text-sm text-gray-700 capitalize">
                              {issue.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {issue.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {issue.locationName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {issue.reportedBy}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {issue.reportedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              issue.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : issue.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {issue.status === "resolved"
                              ? "Resolved"
                              : issue.status === "in-progress"
                                ? "In Progress"
                                : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                <p>Showing 1–8 of {mockIssues.length} reports</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
