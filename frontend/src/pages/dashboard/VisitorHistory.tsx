import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronDown,
  MoreHorizontal,
  Download,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDashboardStore } from "./stores/useDashboardStore";
import { LibraryUser, parseDateTime } from "@/types/dashboard.types";
import { exportToCSV } from "@/utils/export-csv";
import TablePagination from "@/components/TablePagination";

export const VisitorHistory: React.FC = () => {
  const {
    filters,
    setMonth,
    setYear,
    setSearchTerm,
    filteredLibraryUserData,
    resetFilters,
  } = useDashboardStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns: ColumnDef<LibraryUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.schoolId}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <div>{row.getValue("department")}</div>,
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => <div>{row.getValue("course")}</div>,
    },
    {
      accessorKey: "timeIn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:text-white"
          >
            Time In
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const timeIn = parseDateTime(row.getValue("timeIn"));
        return <div>{format(timeIn, "MMM dd, yyyy HH:mm")}</div>;
      },
    },
    {
      accessorKey: "timeOut",
      header: "Time Out",
      cell: ({ row }) => {
        const timeOut = parseDateTime(row.getValue("timeOut"));
        return <div>{format(timeOut, "MMM dd, yyyy HH:mm")}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:text-white h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                onClick={() => navigator.clipboard.writeText(user.schoolId)}
              >
                Copy School ID
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLibraryUserData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLibraryUserData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLibraryUserData.length / itemsPerPage);

  const table = useReactTable({
    data: paginatedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - 5 + i).toString()
  );

  const handleExportCSV = () => {
    exportToCSV(filters);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleReset = () => {
    resetFilters();
    setSorting([]);
    setRowSelection({});
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-background rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">
          Visitor History
        </h1>
        <div className="flex items-center space-x-2">
          <div className="relative drop-shadow-md">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search a visitor"
              className="font-noto_sans pl-8 w-[200px] bg-white"
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
          <Select
            value={filters.month}
            onValueChange={(value) => setMonth(value)}
          >
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.year}
            onValueChange={(value) => setYear(value)}
          >
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Year" />
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
            onClick={handleExportCSV}
            className="drop-shadow-md flex items-center bg-white rounded-lg"
          >
            <Download />
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="drop-shadow-md mr-2 bg-white rounded-lg"
          >
            <RotateCcw />
          </Button>
        </div>
      </div>

      <div className="drop-shadow-md rounded-md border">
        <Table>
          <TableHeader className="bg-accent font-poppins">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white font-noto_sans">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No visitor records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="items-center mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default VisitorHistory;
