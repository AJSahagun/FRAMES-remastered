import { HistoryResponse, monthlySummaryResponse } from "@/types/db.types";

// Mock Data for Line, Chart, and CSV export
export const monthlySummaryResponseData: monthlySummaryResponse[] = [
  {
    month: "November",
    year: "2024",
    program: "BSCoE",
    department: "COE",
    color: "#fc746a",
    visitors: "371",
    dailyVisitors: {
      "1": 12,
      "2": 14,
      "3": 16,
      "4": 16,
      "5": 9,
      "6": 11,
      "7": 12,
      "8": 18,
      "9": 15,
      "10": 9,
      "11": 15,
      "12": 11,
      "13": 16,
      "14": 10,
      "15": 19,
      "16": 10,
      "17": 7,
      "18": 17,
      "19": 8,
      "20": 10,
      "21": 21,
      "22": 19,
      "23": 17,
      "24": 10,
      "25": 14,
      "26": 7,
      "27": 14,
      "28": 14,
    },
  },
  {
    month: "November",
    year: "2024",
    program: "BS Electronics Engineering",
    department: "COE",
    color: "#fc746a",
    visitors: "26",
    dailyVisitors: {
      "1": 2,
      "2": 2,
      "3": 1,
      "5": 1,
      "6": 1,
      "8": 2,
      "9": 2,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 1,
      "16": 1,
      "17": 1,
      "18": 1,
      "19": 1,
      "21": 1,
      "23": 1,
      "24": 1,
      "25": 1,
      "26": 1,
      "27": 1,
    },
  },
];

// Mock data for User table
export const visitorHistoryData: HistoryResponse[] = [
  {
    school_id: "24-00008",
    name: "Parker Alfonso Lacson",
    department: "COE",
    program: "MSAI",
    history: [
      {
        time_in: "2024-11-11T11:13:51+00:00",
        time_out: "2024-11-11T13:24:51+00:00",
      },
      {
        time_in: "2024-11-12T10:05:23+00:00",
        time_out: "2024-11-12T12:04:23+00:00",
      },
      {
        time_in: "2024-11-16T10:48:16+00:00",
        time_out: "2024-11-16T13:31:16+00:00",
      },
      {
        time_in: "2024-11-16T11:08:36+00:00",
        time_out: "2024-11-16T12:16:36+00:00",
      },
      {
        time_in: "2024-11-19T10:15:10+00:00",
        time_out: "2024-11-19T11:10:10+00:00",
      },
      {
        time_in: "2024-11-20T10:37:16+00:00",
        time_out: "2024-11-20T11:22:16+00:00",
      },
      {
        time_in: "2024-11-01T13:48:31+00:00",
        time_out: "2024-11-01T15:22:31+00:00",
      },
    ],
  },
  {
    school_id: "19-00001",
    name: "Maria Santos Cruz",
    department: "CAFAD",
    program: "BSArchi",
    history: [
      {
        time_in: "2024-11-08T14:59:53+00:00",
        time_out: "2024-11-08T17:41:53+00:00",
      },
      {
        time_in: "2024-11-14T12:09:21+00:00",
        time_out: "2024-11-14T13:42:21+00:00",
      },
      {
        time_in: "2024-11-12T10:37:26+00:00",
        time_out: "2024-11-12T12:13:26+00:00",
      },
      {
        time_in: "2024-11-21T13:26:18+00:00",
        time_out: "2024-11-21T16:15:18+00:00",
      },
      {
        time_in: "2024-11-08T14:33:04+00:00",
        time_out: "2024-11-08T16:21:04+00:00",
      },
      {
        time_in: "2024-11-28T14:04:27+00:00",
        time_out: "2024-11-28T15:58:27+00:00",
      },
      {
        time_in: "2024-11-13T10:40:28+00:00",
        time_out: "2024-11-13T11:37:28+00:00",
      },
    ],
  },
];
