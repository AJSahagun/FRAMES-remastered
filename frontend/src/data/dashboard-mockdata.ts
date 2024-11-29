import {
  DailyVisitorEntry,
  MonthlyVisitorSummary,
  LibraryUser
} from "@/types/dashboard.types";

export const dailyVisitorData: DailyVisitorEntry[] = [
  { date: "2024-11-01", visitors: 100 },
  { date: "2024-11-02", visitors: 120 },
  { date: "2024-11-03", visitors: 110 },
  { date: "2024-11-04", visitors: 95 },
  { date: "2024-11-05", visitors: 140 },
  { date: "2024-11-06", visitors: 90 },
  { date: "2024-11-07", visitors: 110 },
  { date: "2024-11-08", visitors: 130 },
  { date: "2024-11-09", visitors: 160 },
  { date: "2024-11-10", visitors: 90 },
  { date: "2024-11-11", visitors: 70 },
  { date: "2024-11-12", visitors: 150 },
  { date: "2024-11-13", visitors: 85 },
  { date: "2024-11-14", visitors: 190 },
  { date: "2024-11-15", visitors: 120 },
  { date: "2024-11-16", visitors: 105 },
  { date: "2024-11-17", visitors: 145 },
  { date: "2024-11-18", visitors: 95 },
  { date: "2024-11-19", visitors: 135 },
  { date: "2024-11-20", visitors: 175 },
];

export const monthlyVisitorSummaryData: MonthlyVisitorSummary[] = [
  {
    month: "November",
    year: "2024",
    course: "BSCS",
    department: "CICS",
    visitors: 3000,
    dailyVisitors: {
      1: 100,
      2: 150,
      3: 120,
      4: 130,
      5: 140,
      6: 110,
      7: 190,
      8: 160,
      9: 180,
      10: 140,
    },
    color: "#302977",
  },
  {
    month: "November",
    year: "2024",
    course: "BSME",
    department: "CoE",
    visitors: 2400,
    dailyVisitors: {
      1: 70,
      2: 90,
      3: 110,
      4: 95,
      5: 120,
      6: 140,
      7: 110,
      8: 125,
      9: 105,
      10: 145,
    },
    color: "#C30D26",
  },
  {
    month: "November",
    year: "2024",
    course: "BSIntDes",
    department: "CAFAD",
    visitors: 2100,
    dailyVisitors: {
      1: 60,
      2: 75,
      3: 85,
      4: 90,
      5: 100,
      6: 115,
      7: 125,
      8: 140,
      9: 155,
      10: 160,
    },
    color: "#8BA757",
  },
];

export const libraryUserData: LibraryUser[] = [
  {
    name: "John Doe",
    schoolId: "22-12345",
    department: "CICS",
    course: "BSIT",
    timeIn: "2024-11-11 08:00",
    timeOut: "2024-11-11 08:45",
  },
  {
    name: "Alice Smith",
    schoolId: "22-67890",
    department: "CAFAD",
    course: "BS Interior Design",
    timeIn: "2024-11-01 09:00",
    timeOut: "2024-11-01 09:35",
  },
  {
    name: "Bob Johnson",
    schoolId: "22-54321",
    department: "CoE",
    course: "BS Civil Engineering",
    timeIn: "2024-11-01 10:00",
    timeOut: "2024-11-01 10:25",
  },
  {
    name: "Jessica Taylor",
    schoolId: "23-11223",
    department: "CICS",
    course: "BSCS",
    timeIn: "2024-11-01 11:00",
    timeOut: "2024-11-01 11:50",
  },
  {
    name: "Michael Brown",
    schoolId: "24-44567",
    department: "CoE",
    course: "BSEE",
    timeIn: "2024-11-01 12:30",
    timeOut: "2024-11-01 13:15",
  },
  {
    name: "Sophia Martinez",
    schoolId: "22-99876",
    department: "CAFAD",
    course: "BFA",
    timeIn: "2024-11-01 14:00",
    timeOut: "2024-11-01 14:40",
  },
  {
    name: "David Wilson",
    schoolId: "25-33456",
    department: "CET",
    course: "Mexet",
    timeIn: "2024-11-01 15:00",
    timeOut: "2024-11-01 15:35",
  },
  {
    name: "Emily Davis",
    schoolId: "23-66789",
    department: "CAFAD",
    course: "BS Interior Design",
    timeIn: "2024-11-01 16:00",
    timeOut: "2024-11-01 16:45",
  },
  {
    name: "Daniel Garcia",
    schoolId: "22-55678",
    department: "CoE",
    course: "BSME",
    timeIn: "2024-11-01 17:00",
    timeOut: "2024-11-01 17:30",
  },
  {
    name: "Emma Thomas",
    schoolId: "24-77889",
    department: "CICS",
    course: "BSIT",
    timeIn: "2024-11-01 18:00",
    timeOut: "2024-11-01 18:40",
  },
  {
    name: "Oliver Harris",
    schoolId: "23-11234",
    department: "CICS",
    course: "BSCS",
    timeIn: "2024-11-02 08:15",
    timeOut: "2024-11-02 09:00",
  },
  {
    name: "Mia Clark",
    schoolId: "22-44567",
    department: "CAFAD",
    course: "BS Interior Design",
    timeIn: "2024-11-02 09:30",
    timeOut: "2024-11-02 10:10",
  },
  {
    name: "Noah Wright",
    schoolId: "24-55678",
    department: "CoE",
    course: "BS Civil Engineering",
    timeIn: "2024-11-02 10:30",
    timeOut: "2024-11-02 11:15",
  },
  {
    name: "Liam Young",
    schoolId: "25-66789",
    department: "CET",
    course: "Mexet",
    timeIn: "2024-11-02 11:45",
    timeOut: "2024-11-02 12:20",
  },
  {
    name: "Charlotte King",
    schoolId: "23-77890",
    department: "CAFAD",
    course: "BFA",
    timeIn: "2024-11-02 13:00",
    timeOut: "2024-11-02 13:50",
  },
  {
    name: "Ethan Walker",
    schoolId: "22-99877",
    department: "CoE",
    course: "BSEE",
    timeIn: "2024-11-02 14:30",
    timeOut: "2024-11-02 15:00",
  },
  {
    name: "Amelia Hill",
    schoolId: "24-11222",
    department: "CICS",
    course: "BSIT",
    timeIn: "2024-11-02 15:45",
    timeOut: "2024-11-02 16:20",
  },
  {
    name: "James Scott",
    schoolId: "23-33456",
    department: "CoE",
    course: "BSME",
    timeIn: "2024-11-02 16:45",
    timeOut: "2024-11-02 17:30",
  },
  {
    name: "Ava Lewis",
    schoolId: "22-77889",
    department: "CAFAD",
    course: "BS Interior Design",
    timeIn: "2024-11-02 18:00",
    timeOut: "2024-11-02 18:35",
  },
  {
    name: "Benjamin Hall",
    schoolId: "25-44566",
    department: "CICS",
    course: "BSCS",
    timeIn: "2024-11-02 19:00",
    timeOut: "2024-11-02 19:40",
  },
];

