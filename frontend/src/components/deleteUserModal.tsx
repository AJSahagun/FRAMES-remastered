import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/services/auth.service";
import { AccountsResponse } from "@/types/accounts.type";
import { AccountService } from "@/services/accounts.service";

interface DeleteUserModalProps {
  user: AccountsResponse;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loggedInUser = useAuthStore((state) => state.user?.username);

  const handleDelete = async () => {
    if (user.username === loggedInUser) {
      toast.error("You cannot delete your own account.", { position: "top-center" });
      return;
    }

    setIsLoading(true);
    try {
      await AccountService.deleteAccount(user.username);
      toast.success("User deleted successfully!", { position: "top-center" });
      onConfirm();
      onClose();
    } catch (error) {
      console.error("Error while deleting user:", error);
      toast.error("You are currently offline. Failed to delete user.", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
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
