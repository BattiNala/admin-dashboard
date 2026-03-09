const exportCSV = (data) => {
  const csvRows = [
    ["Category", "Location", "Reported By", "Date", "Status"],
    ...data.map((r) => [
      r.category,
      r.location,
      r.reportedBy,
      r.date,
      r.status,
    ]),
  ];

  const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], {
    type: "text/csv",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "reports.csv");
  a.click();
};

export default exportCSV;
