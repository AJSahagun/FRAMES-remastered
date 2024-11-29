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

interface Visitor {
  date: string;
  visitors: number;
}

interface DepartmentVisitor {
  department: string;
  visitors: number;
  color: string;
}

interface LibraryUser {
  name: string;
  schoolId: string;
  department: string;
  course: string;
  timeIn: string;
  timeOut: string;
}

// Sample data
const visitorData: Visitor[] = [
  { date: "2024-01-01", visitors: 100 },
  { date: "2024-01-02", visitors: 120 },
  { date: "2024-01-03", visitors: 90 },
  { date: "2024-01-04", visitors: 120 },
  { date: "2024-01-05", visitors: 92 },
  { date: "2024-01-06", visitors: 74 },
  { date: "2024-01-07", visitors: 150 },
  { date: "2024-01-08", visitors: 120 },
  { date: "2024-01-09", visitors: 160 },
  { date: "2024-01-10", visitors: 70 },
  { date: "2024-01-11", visitors: 50 },
  { date: "2024-01-12", visitors: 120 },
];

const departmentVisitorData: DepartmentVisitor[] = [
  { department: "CICS", visitors: 150, color: "#302977" },
  { department: "CoE", visitors: 305, color: "#C30D26" },
  { department: "CAFAD", visitors: 100, color: "#8BA757" },
  { department: "CET", visitors: 130, color: "#FFAE4C" },
  { department: "Others", visitors: 50, color: "#7C7070" },
];

const libraryUserData: LibraryUser[] = [
  {
    name: "Jane Cooper",
    schoolId: "21-43421",
    department: "CICS",
    course: "BSIT",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
  {
    name: "Jane Cooper",
    schoolId: "21-43421",
    department: "CICS",
    course: "BSIT",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
  {
    name: "Jane Cooper",
    schoolId: "21-43421",
    department: "CICS",
    course: "BSIT",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
  {
    name: "Jake Sam",
    schoolId: "21-34252",
    department: "CICS",
    course: "BSCS",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
  {
    name: "Jake Sam",
    schoolId: "21-34252",
    department: "CICS",
    course: "BSCS",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
  {
    name: "Jake Sam",
    schoolId: "21-34252",
    department: "CICS",
    course: "BSCS",
    timeIn: "2023-01-02 07:00",
    timeOut: "2023-01-02 07:12",
  },
];

const DashboardHome: React.FC = () => {
  // Implement useDashboardStore here when integration
  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const totalVisitors = departmentVisitorData.reduce(
    (sum, dept) => sum + dept.visitors,
    0
  );

  const handleExportCSV = () => {
    const headerRow1 = [
      `LIBRARY USERS for the MONTH of ${selectedMonth} ${selectedYear}`,
    ];

    const headerRow2 = [
      "COLLEGE/ DEPARTMENT/ OFFICE",
      ...Array.from({ length: 31 }, (_, i) => `${i + 1}`), // Change length depend on month
      "Total",
    ];

    // Placeholder logic since no individual days yet (Change into days value)
    const departmentRows = departmentVisitorData.map((dept) => [
      dept.department,
      ...Array.from({ length: 31 }, () => dept.visitors / 31), // Average lol
      dept.visitors,
    ]);

    const totalRow = [
      "TOTAL",
      ...Array.from({ length: 31 }, () =>
        departmentVisitorData.reduce((sum, dept) => sum + dept.visitors / 31, 0)
      ),
      totalVisitors,
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
      `Library_Users_${selectedMonth}_${selectedYear}.csv`
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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {[
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
              ].map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
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
              <LineChart data={visitorData}>
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
            <div className="absolute text-center z-0 -translate-x-10">
              <p className="text-2xl font-bold">{totalVisitors}</p>
              <p className="text-sm text-gray-500">Total Visitors</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={departmentVisitorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visitors"
                >
                  {departmentVisitorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 shadow-lg rounded z-100">
                          <p>{`Department: ${data.department}`}</p>
                          <p>{`Visitors: ${data.visitors}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value, entry) => {
                    if (entry && entry.payload) {
                      const departmentData =
                        entry.payload as unknown as DepartmentVisitor;
                      return departmentData.department;
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
                value={searchTerm}
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
