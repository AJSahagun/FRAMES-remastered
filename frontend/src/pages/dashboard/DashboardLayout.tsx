import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <SideNavigation />
      <main className="flex-grow ml-64 xl:ml-80 p-6 overflow-y-auto">
        {/* Outlet will render child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;