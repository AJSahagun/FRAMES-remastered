import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FileDown, Search } from "lucide-react";
import {
  dailyVisitorData,
  monthlyVisitorSummaryData,
  libraryUserData,
} from "@/data/dashboard-mockdata";
import { MonthlyVisitorSummary } from "@/types/dashboard.types";
import { useDashboardStore } from "./stores/useDashboardStore";

const DashboardHome: React.FC = () => {
  const { filters, setMonth, setYear, setSearchTerm } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Calculate total visitors from monthly visitor summary
  const totalVisitors = monthlyVisitorSummaryData.reduce(
    (sum, summary) => sum + summary.visitors,
    0
  );

  const handleExportCSV = () => {
    const getDaysInMonth = (month: string, year: string): number => {
      const monthIndex = monthNames.indexOf(month);
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

    // Prepare department data for CSV export
    const departmentData = monthlyVisitorSummaryData.map((summary) => {
      const dailyVisitors = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return summary.dailyVisitors[day] || 0;
      });

      return {
        department: summary.department,
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
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = libraryUserData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(libraryUserData.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">
          Dashboard
        </h1>
        <div className="flex space-x-4">
          <Select value={filters.month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {["2022", "2023", "2024"].map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Visitor Overview */}
        <Card className="h-64 xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-noto_sans font-thin uppercase text-sm">
              Visitor Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={dailyVisitorData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 shadow-lg rounded">
                          <p>{`Date: ${data.date}`}</p>
                          <p>{`Visitors: ${data.visitors}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Visitor Distribution */}
        <Card className="h-64">
          <CardContent className="flex items-center justify-center">
            <div className="font-poppins absolute text-center z-0 translate-x-[-4rem]">
              <p className="text-xs font-base uppercase text-gray-400">
                Total Visitors
              </p>
              <p className="text-4xl font-bold">{totalVisitors}</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={monthlyVisitorSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visitors"
                >
                  {monthlyVisitorSummaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as MonthlyVisitorSummary;
                      return (
                        <div className="bg-white p-4 shadow-lg rounded z-100">
                          <p>{`Department: ${data.department}`}</p>
                          <p>{`Course: ${data.course}`}</p>
                          <p>{`Visitors: ${data.visitors}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  width={125}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconSize={10}
                  iconType="circle"
                  formatter={(value, entry) => {
                    if (entry && entry.payload) {
                      const summaryData =
                        entry.payload as unknown as MonthlyVisitorSummary;
                      return `${summaryData.course} (${summaryData.department})`;
                    }
                    return value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Library Visitors Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="font-poppins font-semibold text-xl">
              All Users
            </CardTitle>
            <CardDescription className="font-noto_sans text-primary">
              Library Visitors
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                placeholder="Search..."
                className="font-noto_sans pl-8 w-[200px]"
                value={filters.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="font-noto_sans rounded-xl"
            >
              <FileDown size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="font-poppins font-semibold">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>School ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.schoolId}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.course}</TableCell>
                  <TableCell>{user.timeIn}</TableCell>
                  <TableCell>{user.timeOut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : undefined}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className="hover:text-white"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? +1 : undefined}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
