import React from "react";

const ReportsFilter = ({ filter, setFilter }) => {
  const options = ["all", "pending", "resolved"];

  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setFilter(option)}
          className={`px-4 py-2 rounded-lg border ${
            filter === option ? "bg-black text-white" : "bg-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ReportsFilter;
