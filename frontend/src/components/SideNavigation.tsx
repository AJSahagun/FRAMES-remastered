import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../services/auth.service.ts';
import { useNavigationStore } from '../pages/dashboard/stores/navigationStore.ts';
import UserProfileModal from './UserProfileModal.tsx';
import { NavItem } from '../types/navigation.types.ts';
import { FiLogOut } from "react-icons/fi";

const NAV_ITEMS: NavItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    path: '/dashboard' 
  },
  { 
    id: 'visitor-history', 
    label: 'Visitor History', 
    path: '/dashboard/visitor-history' 
  },
  { 
    id: 'access-in', 
    label: 'Access Check-in', 
    path: '/access/in' 
  },
  { 
    id: 'access-out', 
    label: 'Access Check-out', 
    path: '/access/out' 
  },
];

const SideNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentPath, setCurrentPath } = useNavigationStore();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleNavItemClick = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };

  return (
    <>
    <div 
      className="fixed left-0 top-0 h-full w-1/5 xl:w-1/6 bg-gradient-to-bl from-tc to-80% to-btnHover text-white flex flex-col drop-shadow-2xl"
    >
      {/* Top Logo/Icon Section */}
      <div className="flex justify-center items-center py-6">
        <div className="xl:w-64 flex items-center justify-center">
          {/* Company Logo or Icon */}
          <img src="\logos\frames-white-logo.png" alt="Frames White Logo" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow pl-6 xl:pl-8 space-y-1 text-white font-noto_sans text-base xl:text-lg">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavItemClick(item.path)}
            className={`
              w-full flex items-center space-x-3 py-2 pl-6 xl:pl-8 rounded-l-full transition-colors duration-200
              ${currentPath === item.path 
                ? 'bg-tc font-normal' 
                : 'hover:bg-red-700/50 font-light'}
            `}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      {user && (
        <div 
          className="p-4 border-t border-red-700 flex items-center space-x-3 cursor-pointer hover:bg-btnBg"
          onClick={() => setIsUserModalOpen(true)}
        >
          <img 
            src="logos/user-logo.jpg"
            alt={user.username} 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">{user.username}</div>
            <div className="text-sm text-red-200">{user.role}</div>
          </div>
          <FiLogOut className='relative right-0'/>
        </div>
      )}
    </div>

      {/* User Profile Modal */}
      {isUserModalOpen && (
        <UserProfileModal 
          onClose={() => setIsUserModalOpen(false)}
        />
      )}
    </>
  );
};

export default SideNavigation;