// src/components/dashboard/HighlightCard.jsx
import React from "react";

export default function HighlightCard({
  icon: Icon,
  title,
  value,
  color,
  progressWidth,
}) {
  const gradientMap = {
    blue: "from-blue-600 to-blue-700",
    yellow: "from-yellow-500 to-orange-600",
    green: "from-green-600 to-green-700",
  };

  return (
    <div
      className={`bg-linear-to-r ${gradientMap[color]} rounded-2xl p-6 shadow-lg text-white`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Icon className="w-10 h-10" />
        <div>
          <h3 className="text-4xl font-bold">{value}</h3>
          <p className="text-sm text-opacity-90">{title}</p>
        </div>
      </div>
      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/70 rounded-full"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
}
