import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccountService } from "@/services/accounts.service";
import { AccountsResponse } from "@/types/accounts.type";

interface DeleteUserModalProps {
  user: AccountsResponse;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  onClose,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await AccountService.deleteAccount(user.username);
      onConfirm();
      toast.success("User deleted successfully!", { position: "top-center" });
      onClose(); 
    } catch (error) {
      toast.error("Failed to delete user.", { position: "top-center" });
      setIsLoading(false);
      console.error("Error deleting user:", error); 
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <ToastContainer /> 
      <div className="bg-white rounded-lg p-6 px-8 space-y-2 flex flex-col drop-shadow-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex space-x-0">
          <div className="flex items-center justify-start w-64">
            <h1 className="text-2xl text-black-600">Delete User</h1>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete the user{" "}
            <strong>{user.username}</strong>? This action cannot be undone.
          </p>
          <div className="w-full flex items-center justify-center space-x-4">
            <button
              onClick={onClose} 
              className="w-1/3 font-poppins font-light tracking-wider text-sm text-white bg-accent border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="w-1/3 bg-btnBg font-poppins font-light tracking-wider text-sm text-white border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mt-1"></div>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
