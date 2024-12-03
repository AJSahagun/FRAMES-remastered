import {
  DailyVisitorEntry,
  MonthlyVisitorSummary,
  LibraryUser,
} from "@/types/dashboard.types";
import {
  monthlySummaryResponse,
  HistoryResponse,
} from "@/types/db.types";

const DEPARTMENT_COLORS: Record<string, string> = {
  CoE: "#C30D26",
  CAFAD: "#8BA757",
  CET: "#FFAE4C",
  CICS: "#302977",
  default: "#7C7070",
};

export const transformMonthlySummaryData = (
  response: monthlySummaryResponse
): MonthlyVisitorSummary[] => {
  return response.visitors.map((visitorGroup) => ({
    month: response.month,
    year: response.year,
    course: visitorGroup.program,
    department: visitorGroup.department,
    visitors: visitorGroup.total_counts,
    dailyVisitors: Object.fromEntries(
      Object.entries(visitorGroup.counts_per_day).map(([day, count]) => [
        parseInt(day),
        count,
      ])
    ),
    color:
      DEPARTMENT_COLORS[visitorGroup.department] ||
      DEPARTMENT_COLORS["default"],
  }));
};

export const transformDailyVisitorData = (
  summaryData: MonthlyVisitorSummary[]
): DailyVisitorEntry[] => {
  const visitors: DailyVisitorEntry[] = [];

  summaryData.forEach((summary) => {
    Object.entries(summary.dailyVisitors).forEach(([day, count]) => {
      visitors.push({
        date: `${summary.year}-${summary.month
          .slice(0, 3)
          .toLowerCase()}-${day.padStart(2, "0")}`,
        visitors: count,
      });
    });
  });

  return visitors.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
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
