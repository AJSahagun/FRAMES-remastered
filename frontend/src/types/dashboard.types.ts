export interface BaseVisitor {
  course?: string;
  department?: string;
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
