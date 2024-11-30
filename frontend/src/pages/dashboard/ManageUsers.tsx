import { useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateUserModal from '@/components/createUserModal';

interface Librarian {
  username: string;
  role: string;
  dateCreated: string;
}

const librarianData: Librarian[] = [
  {
    username: 'lib_mooms',
    role: 'Librarian',
    dateCreated: '2021-08-25',
  },
  {
    username: 'lib_krons',
    role: 'Librarian',
    dateCreated: '2021-08-25',
  },
  {
    username: 'lib_bae',
    role: 'Librarian',
    dateCreated: '2021-08-25',
  },
  {
    username: 'hlib_fauna',
    role: 'Head Librarian',
    dateCreated: '2021-08-25',
  },
  {
    username: 'lib_irys',
    role: 'Librarian',
    dateCreated: '2021-07-11',
  },
  {
    username: 'lib_mori',
    role: 'Librarian',
    dateCreated: '2020-09-13',
  },
  {
    username: 'lib_kiara',
    role: 'Librarian',
    dateCreated: '2020-09-13',
  },
  {
    username: 'lib_gooba',
    role: 'Librarian',
    dateCreated: '2020-09-13',
  },
  {
    username: 'lib_wah',
    role: 'Librarian',
    dateCreated: '2020-09-13',
  },
  {
    username: 'lib_ame',
    role: 'Librarian',
    dateCreated: '2020-09-13',
  },
]


const ManageUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = librarianData.slice(indexOfFirstRow, indexOfLastRow);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  

  const totalPages = Math.ceil(librarianData.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateUser = () => {
    setShowCreateUserModal(true);
  };


	return (
		<div className="max-h-dvh p-6" >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex">
          <h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">
            Manage Users
          </h1>
        </div>

        <div className="relative drop-shadow-md mr-6">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground "
            size={16}
          />
          <Input
            placeholder="Search..."
            className="font-noto_sans pl-8 w-[200px] py-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-10">
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-row w-full">
            <div className="flex items-start justify-start">
              <CardTitle className="font-poppins font-semibold text-xl">
                All Users
              </CardTitle>
            </div>
          </div>

          <div className="flex w-full items-end justify-end pr-10">
            <button className="font-poppins font-medium text-sm bg-white border-2 border-accent rounded-sm p-2 drop-shadow-md hover:bg-accent hover:text-white transition-all duration-100 active:opacity-60"
            onClick={handleCreateUser}
            >+ Create User</button>
          </div>
          <div className="flex items-center space-x-3">
            {/* Search */}
            {/* <div className="relative">
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
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="font-poppins font-semibold bg-accent">
              <TableRow>
                <TableHead className="text-white">Username</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className={user.role === 'Head Librarian' ? 'text-primary' : ''}>{user.role}</TableCell>
                  <TableCell>{user.dateCreated}</TableCell>
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
        

        {showCreateUserModal && (
          <>
          <div className="fixed inset-0 bg-black opacity-10 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <CreateUserModal onClose={() => {setShowCreateUserModal(false)}} />
          </div>
          </>
        )}

      </div>
		</div>
	);
};

export default ManageUsers;
