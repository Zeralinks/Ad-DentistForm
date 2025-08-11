import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/DashboardPage/Sidebar";

const DashboardLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex font-montserrat h-screen overflow-y-hidden bg-gray-50">
      <Sidebar activePath={pathname} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
