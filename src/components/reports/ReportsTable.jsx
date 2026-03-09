import React from "react";

const ReportsTable = ({ reports, filter }) => {
  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Category</th>
            <th className="p-3">Location</th>
            <th className="p-3">Reported By</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((report) => (
            <tr key={report.id} className="border-b">
              <td className="p-3">{report.category}</td>
              <td className="p-3">{report.location}</td>
              <td className="p-3">{report.reportedBy}</td>
              <td className="p-3">{report.date}</td>
              <td className="p-3 capitalize">{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
