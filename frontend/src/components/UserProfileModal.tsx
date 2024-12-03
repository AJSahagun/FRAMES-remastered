import React from 'react';
import { useAuthStore } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '@/components/SettingsModal';

interface UserProfileModalProps {
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [settingsModal, setSettingsModal] = React.useState(false);

  const handleSettings = () => {
    setSettingsModal(true);

  }


  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!user) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <div className="flex items-start space-x-4">
          <img 
            src="logos/user-logo.jpg" 
            alt={user.username} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="font-bold text-lg text-tc">{user.username}</div>
            <div className="text-gray-500 capitalize">{user.role}</div>
          </div>
          <div className="flex items-end justify-end">
            <button className="w-1/5 hover:opacity-75">
              <img src="/close-icon.svg" 
              alt="close-icon.svg" 
              className=" "
              onClick={onClose} />
            </button>

          </div>
          
        </div>
        <div className="space-y-2 flex flex-col w-full items-center justify-center">
        {user.role === 'admin' && (
          <button className="w-2/5 bg-stone-200 hover:bg-stone-400 hover:text-black active:opacity-70 font-poppins text-tc rounded-lg py-2 transition-colors duration-300"
          onClick={handleSettings}
          >
            Settings
          </button>
        )}
          <button 
            onClick={handleLogout} 
            className="w-2/5 border-2 border-tc hover:bg-tc hover:text-background active:opacity-70 font-poppins text-tc rounded-lg py-2 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {settingsModal && (
          <SettingsModal onClose={() => setSettingsModal(false)}/>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;