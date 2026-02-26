import { useState } from "react";

const mockReports = [
  {
    id: 1,
    category: "water",
    location: "Pulchowk",
    status: "pending",
    reportedBy: "Ram Sharma",
    date: "2026-02-25",
  },
  {
    id: 2,
    category: "electricity",
    location: "Jawalakhel",
    status: "resolved",
    reportedBy: "Sita Thapa",
    date: "2026-02-24",
  },
];

const useReports = () => {
  const [reports, setReports] = useState(mockReports);
  const [filter, setFilter] = useState("all");

  return { reports, setReports, filter, setFilter };
};

export default useReports;
