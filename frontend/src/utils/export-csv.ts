import { MonthlyVisitorSummary } from "@/types/dashboard.types";
import { DashboardFilters } from "@/types/dashboard.types";

const months = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString("default", { month: "long" })
);

export function exportToCSV(filters: DashboardFilters, monthlyVisitorSummaryData:MonthlyVisitorSummary[]) {
  const getDaysInMonth = (month: string, year: string): number => {
    const monthIndex = months.indexOf(month);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(filters.month, filters.year);

  const headerRow1 = [
    `LIBRARY USERS for the MONTH of ${filters.month} ${filters.year}`,
  ];

  const headerRow2 = [
    "COLLEGE/ DEPARTMENT/ OFFICE",
    ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    "Total",
  ];

  const departmentData = monthlyVisitorSummaryData.map((summary) => {
    const dailyVisitors = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return summary.dailyVisitors[day] || 0;
    });

    return {
      department: summary.course,
      dailyVisitors,
      total: dailyVisitors.reduce((sum, visitors) => sum + visitors, 0),
    };
  });

  const departmentRows = departmentData.map((dept) => [
    dept.department,
    ...dept.dailyVisitors,
    dept.total,
  ]);

  const totalRow = [
    "TOTAL",
    ...Array.from({ length: daysInMonth }, (_, i) =>
      departmentData.reduce((sum, dept) => sum + dept.dailyVisitors[i], 0)
    ),
    departmentData.reduce((sum, dept) => sum + dept.total, 0),
  ];

  const csvContent = [
    headerRow1.join(","),
    headerRow2.join(","),
    ...departmentRows.map((row) => row.join(",")),
    totalRow.join(","),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Library_Users_${filters.month}_${filters.year}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
