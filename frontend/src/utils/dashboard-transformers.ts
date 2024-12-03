import {
  DailyVisitorEntry,
  MonthlyVisitorSummary,
  LibraryUser,
} from "@/types/dashboard.types";
import { monthlySummaryResponse, HistoryResponse } from "@/types/db.types";

const DEPARTMENT_COLORS: Record<string, string> = {
  COE: "#C30D26",
  CAFAD: "#8BA757",
  CET: "#FFAE4C",
  CICS: "#302977",
  default: "#7C7070",
};

export const transformMonthlySummaryData = (
  response: monthlySummaryResponse[]
): MonthlyVisitorSummary[] => {
  return response
    .map((visitorGroup) => ({
      month: visitorGroup.month,
      year: visitorGroup.year,
      course: visitorGroup.program,
      department: visitorGroup.department || "Others",
      visitors: parseInt(visitorGroup.visitors),
      dailyVisitors: Object.fromEntries(
        Object.entries(visitorGroup.dailyVisitors).map(([day, count]) => [
          parseInt(day),
          count,
        ])
      ),
      color:
        DEPARTMENT_COLORS[visitorGroup.department] ||
        DEPARTMENT_COLORS["default"],
    }))
    .sort((a, b) => (a.department || "").localeCompare(b.department || ""));
};

export const transformDailyVisitorData = (
  summaryData: MonthlyVisitorSummary[]
): DailyVisitorEntry[] => {
  const aggregatedVisitors: Record<string, number> = {};

  summaryData.forEach((summary) => {
    Object.entries(summary.dailyVisitors).forEach(([day, count]) => {
      const date = `${summary.year}-${summary.month
        .slice(0, 3)
        .toLowerCase()}-${day.padStart(2, "0")}`;
      aggregatedVisitors[date] = (aggregatedVisitors[date] || 0) + count;
    });
  });

  return Object.entries(aggregatedVisitors)
    .map(([date, visitors]) => ({ date, visitors }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const transformLibraryUserData = (
  historyResponse: HistoryResponse[]
): LibraryUser[] => {
  const libraryUsers: LibraryUser[] = [];

  historyResponse.forEach((user) => {
    user.history.forEach((visit) => {
      libraryUsers.push({
        name: user.name,
        schoolId: user.school_id,
        department: user.department,
        course: user.program,
        timeIn: formatDateTime(visit.time_in),
        timeOut: formatDateTime(visit.time_out),
      });
    });
  });

  return libraryUsers.sort(
    (a, b) => new Date(a.timeIn).getTime() - new Date(b.timeIn).getTime()
  );
};

const formatDateTime = (isoDatetime: string): string => {
  const date = new Date(isoDatetime);
  return date.toISOString().slice(0, 16).replace("T", " ");
};
