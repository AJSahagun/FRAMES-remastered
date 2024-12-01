export interface BaseVisitor {
  visitors: number;
  color?: string; // Optional for visualization
}

export interface DailyVisitorEntry extends BaseVisitor {
  date: string | number; // Can be a specific date or day of month
}

export interface MonthlyVisitorSummary extends BaseVisitor {
  course: string;
  department: string;
  month: string;
  year: string;
  dailyVisitors: Record<number, number>;
}

export interface LibraryUser {
  name: string;
  schoolId: string;
  department: string;
  course: string;
  timeIn: string;
  timeOut: string;
}

export const parseDateTime = (dateString: string): Date => {
  return new Date(dateString);
}

export interface DashboardFilters {
  month: string;
  year: string;
  searchTerm: string;
}