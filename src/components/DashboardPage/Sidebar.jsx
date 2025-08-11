import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, Mail, Link as LinkIcon, Settings, User
} from "lucide-react";

const Sidebar = ({ activePath }) => {
  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/dashboard/leads", label: "Leads", icon: <Users size={18} /> },
    { to: "/dashboard/appointments", label: "Appointments", icon: <Calendar size={18} /> },
    { to: "/dashboard/follow-ups", label: "Follow-ups", icon: <Mail size={18} /> },
    { to: "/dashboard/integrations", label: "Integrations", icon: <LinkIcon size={18} /> },
    { to: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white h-screen shadow-sm border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800" >
          LeadFlow
        </h1>
        <p className="text-sm text-gray-600 mt-1">Lead Management System</p>
      </div>

      <nav className="flex-1 p-4" aria-label="Main">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"} // exact active for the index
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    isActive ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                             : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Dr. Smith</p>
            <p className="text-xs text-gray-500">Dental Clinic</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
