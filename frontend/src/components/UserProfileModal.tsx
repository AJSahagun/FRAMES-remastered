import React from 'react';
import { useAuthStore } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
    const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!user) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <div className="flex items-center space-x-4">
          <img 
            src="logos/user-logo.jpg" 
            alt={user.username} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="font-bold text-lg text-tc">{user.username}</div>
            <div className="text-gray-500 capitalize">{user.role}</div>
          </div>
        </div>
        <div className="space-y-2">
          <button 
            onClick={handleLogout} 
            className="w-full font-poppins text-md text-background bg-btnBg rounded-lg py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
          >
            Logout
          </button>
          <button 
            onClick={onClose} 
            className="w-full border-2 bg-stone-200 hover:bg-tc hover:text-background font-poppins text-tc rounded-lg py-2 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;