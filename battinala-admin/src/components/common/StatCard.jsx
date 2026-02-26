// src/components/common/StatCard.jsx
import React from "react";

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendColor = "green",
  bgColor = "blue",
}) {
  // Map string values → full Tailwind class names
  const bgMap = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    // add more colors if needed
  };

  const trendMap = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50",
    blue: "text-blue-600 bg-blue-50",
    // add more if needed
  };

  // Fallback if unknown color
  const bgClasses = bgMap[bgColor] || "bg-gray-50 text-gray-600";
  const trendClasses = trendMap[trendColor] || "text-gray-600 bg-gray-50";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-xl ${bgClasses} flex items-center justify-center`}
        >
          <Icon className="w-7 h-7" />
        </div>

        {trend && (
          <span
            className={`text-xs font-medium ${trendClasses} px-2.5 py-1 rounded-full`}
          >
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
