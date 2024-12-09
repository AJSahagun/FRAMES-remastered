import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideNavigation from "@/components/SideNavigation";
import { useDashboardStore } from "../stores/useDashboardStore";

const DashboardLayout: React.FC = () => {
  useEffect(() => {
    useDashboardStore.getState().fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      <SideNavigation />
      <main className="ml-64 xl:ml-80 w-3/4 xl:w-4/5">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
