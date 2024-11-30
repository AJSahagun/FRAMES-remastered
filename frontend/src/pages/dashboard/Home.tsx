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
import TablePagination from "@/components/TablePagination";
import { FileDown, Search, X, RotateCcw } from "lucide-react";
import { MonthlyVisitorSummary } from "@/types/dashboard.types";
import { useDashboardStore } from "./stores/useDashboardStore";
import { format } from "date-fns";
import { exportToCSV } from "@/utils/export-csv";

const DashboardHome: React.FC = () => {
  const {
    filters,
    filteredVisitorData,
    filteredVisitorSummaryData,
    filteredLibraryUserData,
    setMonth,
    setYear,
    setSearchTerm,
    resetFilters
  } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const totalVisitors = filteredVisitorSummaryData.reduce(
    (sum, summary) => sum + summary.visitors,
    0
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLibraryUserData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredLibraryUserData.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - 5 + i).toString()
  );

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
              {months.map((month) => (
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
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={resetFilters}
            className="drop-shadow-md mr-2 bg-white rounded-lg"
          >
            <RotateCcw />
          </Button>
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
              <LineChart data={filteredVisitorData}>
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
                  data={filteredVisitorSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visitors"
                >
                  {filteredVisitorSummaryData.map((entry, index) => (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className={`hover:bg-transparent absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground ${
                  filters.searchTerm ? "visible" : "invisible"
                }`}
              >
                <X size={16} />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => exportToCSV(filters)}
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
                  <TableCell>
                    {format(user.timeIn, "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(user.timeOut, "MMM dd, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="items-center mt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
