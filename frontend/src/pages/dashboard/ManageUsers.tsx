import { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AccountsResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation modal
  const totalPages = Math.ceil(accountsData.length / rowsPerPage);
  
  const actionMenuRef = useRef<HTMLDivElement | null>(null); // Ref for detecting clicks outside the menu

  const handlePageChange = (pageNumber: number) => {
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

  const handleEditUser = (user: AccountsResponse) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
    setShowActionMenu(false); // Close the action menu when edit is chosen
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

  const handleDeleteUser = (user: AccountsResponse) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowActionMenu(false); // Close the action menu when delete is chosen
  };

  const handleDeleteSubmit = async () => {
    if (selectedUser) {
      try {
        await AccountService.deleteAccount(selectedUser.username);  // Delete account
        const response = await AccountService.getAccounts(); // Refresh the user list
        setAccountsData(response);
        setShowDeleteModal(false);  // Close the modal
        toast.success("User deleted successfully!", { position: "top-center" });
      } catch (error) {
        toast.error("Failed to delete user.", { position: "top-center" });
      }
    }
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                    <TableCell>{user.date_created ? format(parseDateTime(user.date_created), "yyyy-MM-dd") : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex justify-start ml-5">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowActionMenu((prev) => !prev);
                          }}
                        >
                          <MoreHorizontal />
                        </button>
                        {showActionMenu && selectedUser === user && (
                          <div className="mt-4 origin-top-right absolute max-w-[200px] w-[100px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <button
                                className="flex justify-start w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => handleEditUser(user)}
                              >
                                Edit
                              </button>

                              <button
                                className="flex justify-start w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => handleDeleteUser(user)} // Trigger delete modal
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
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

        {/* Create and Edit Modals */}
        {showCreateUserModal && (
          <CreateUserModal 
          onClose={() => setShowCreateUserModal(false)} 
          onSubmit={handleCreateUserSubmit} />
        )}

        {showEditUserModal && selectedUser && (
          <EditUserModal user={selectedUser} 
          onClose={() => setShowEditUserModal(false)} 
          onSubmit={handleEditUserSubmit} />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <DeleteConfirmationModal
            username={selectedUser.username}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteSubmit} 
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
