import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/auth.service';
import { toast } from 'react-toastify';
import Sidebar from './../../components/Sidebar';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out successfully');
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar/>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {user?.username || 'User'}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Quick Stats
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-bold text-blue-600">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-bold text-green-600">56</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Requests</span>
                <span className="font-bold text-yellow-600">12</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Recent Activity
            </h2>
            <div className="divide-y divide-gray-200">
              {[
                { 
                  action: 'User Registration', 
                  user: 'John Doe', 
                  time: '2 hours ago' 
                },
                { 
                  action: 'Profile Update', 
                  user: 'Jane Smith', 
                  time: '4 hours ago' 
                },
                { 
                  action: 'Access Granted', 
                  user: 'Mike Johnson', 
                  time: '6 hours ago' 
                }
              ].map((activity, index) => (
                <div 
                  key={index} 
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-800 font-medium">
                      {activity.action}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              title: 'Manage Users', 
              description: 'Add, edit, or remove users',
              bgColor: 'bg-blue-100',
              textColor: 'text-blue-800'
            },
            { 
              title: 'Reports', 
              description: 'Generate and view reports',
              bgColor: 'bg-green-100',
              textColor: 'text-green-800'
            },
            { 
              title: 'Settings', 
              description: 'Configure system settings',
              bgColor: 'bg-yellow-100',
              textColor: 'text-yellow-800'
            },
            { 
              title: 'Support', 
              description: 'Help and documentation',
              bgColor: 'bg-purple-100',
              textColor: 'text-purple-800'
            }
          ].map((action, index) => (
            <div 
              key={index} 
              className={`${action.bgColor} ${action.textColor} p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <h3 className="text-lg font-semibold mb-2">
                {action.title}
              </h3>
              <p className="text-sm">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 Techtonic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;