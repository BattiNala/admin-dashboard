import React from "react";
import exportCSV from "../../utils/exportCSV";

const ExportButton = ({ reports }) => {
  return (
    <button
      onClick={() => exportCSV(reports)}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Export CSV
    </button>
  );
};

export default ExportButton;
