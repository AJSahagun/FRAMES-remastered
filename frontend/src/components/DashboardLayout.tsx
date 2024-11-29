import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from './SideNavigation';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex">
      <SideNavigation />
      <main className="ml-64 xl:ml-80 w-3/4 xl:w-4/5 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;