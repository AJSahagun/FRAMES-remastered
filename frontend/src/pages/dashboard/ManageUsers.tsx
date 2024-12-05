import { useState, useEffect } from 'react';
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FaTimes } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
Pagination, 
PaginationContent, 
PaginationItem, 
PaginationLink, 
PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import CreateUserModal from '@/components/createUserModal';
import EditUserModal from '@/components/editUserModal';
import DeleteConfirmationModal from '@/components/deleteUserModal';
import { AccountService } from '@/services/accounts.service';
import { AccountsResponse, parseDateTime } from '@/types/accounts.type';

const ManageUsers: React.FC = () => {
  const [accountsData, setAccountsData] = useState<AccountsResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = accountsData.slice(indexOfFirstRow, indexOfLastRow);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AccountsResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const totalPages = Math.ceil(accountsData.length / rowsPerPage);
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; 
    setCurrentPage(pageNumber);
  };

  const handleCreateUser = () => {
    setShowCreateUserModal(true);
  };

  const handleCreateUserSubmit = async (newUser: AccountsResponse) => {
    try {
      await AccountService.createAccount(newUser);
      const response = await AccountService.getAccounts();
      setAccountsData(response);
      setShowCreateUserModal(false);
      toast.success("User created successfully!", { position: "top-center" });
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  };

  const handleEditUserSubmit = async (updatedUser: AccountsResponse) => {
    try {
      await AccountService.updateAccount(updatedUser.username, updatedUser);
      const response = await AccountService.getAccounts();
      setAccountsData(response);
      setShowEditUserModal(false); // Close the edit modal after successful update
      toast.success("User updated successfully!", { position: "top-center" });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user", { position: "top-center" });
    }
  }; 

  const handleDeleteSubmit = async () => {
    console.log("Deleting user: ", selectedUser);
    if (selectedUser) {
      try {
        await AccountService.deleteAccount(selectedUser.username); 
        const response = await AccountService.getAccounts(); 
        setAccountsData(response);
        setShowDeleteModal(false);
        toast.success("User deleted successfully!", { position: "top-center" });
      } catch (error) {
        toast.error("Failed to delete user.", { position: "top-center" });
        console.error("Error deleting user:", error);
      }
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AccountService.getAccounts();
        setAccountsData(response);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchData();
  }, []);

  const handleActionClick = (user: AccountsResponse) => {
    setSelectedUser(user);
    setShowActionModal(true);
  };

  return (
    <div className="max-h-dvh p-6">
      <div className="flex justify-between items-center">
        <h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">Manage Users</h1>
        <div className="relative drop-shadow-md mr-6">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search..."
            className="font-noto_sans pl-8 w-[200px] py-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-poppins font-semibold text-xl">All Users</CardTitle>
            <button 
              className="font-poppins font-medium text-sm bg-white border-2 border-accent rounded-sm p-2 drop-shadow-md hover:bg-accent hover:text-white transition-all duration-100 active:opacity-60"
              onClick={handleCreateUser}
            >
              + Create User
            </button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="font-poppins font-semibold bg-accent">
                <TableRow>
                  <TableHead className="text-white">Username</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Date Created</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className = "pl-7">{user.date_created ? format(parseDateTime(user.date_created), "yyyy-MM-dd") : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex justify-start ml-5">
                      <button onClick={() => handleActionClick(user)}>
                        <MoreHorizontal />
                      </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

             {/* Pagination */}
             <div className="flex justify-between items-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-disabled={currentPage <= 1}
                      tabIndex={currentPage <= 1 ? -1 : undefined}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
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
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
        </div>

      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onSubmit={handleCreateUserSubmit}
        />
      )}

      {showEditUserModal && selectedUser && (
        <EditUserModal
          onClose={() => setShowEditUserModal(false)}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteSubmit}
          user={selectedUser}
        />
      )}

      {showActionModal && selectedUser && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowActionModal(false)} 
        >
          <div
            className="bg-white w-1/5 rounded-lg p-4 space-y-4"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between">
              <h2 className = "font-poppins font-medium ml-1 mt-1">Manage User Accounts</h2>
              <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition duration-200"
                onClick={() => setShowActionModal(false)}
              >
                <FaTimes size={15} />
              </button>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                className="w-1/2 font-poppins font-light tracking-wider text-sm text-white bg-accent border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80"
                onClick={() => {
                  setShowEditUserModal(true);
                  setShowActionModal(false);
                }}
              >
                Edit
              </button>
              <button
                className="w-1/2 bg-btnBg font-poppins font-light tracking-wider text-sm text-white border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80"
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowActionModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
