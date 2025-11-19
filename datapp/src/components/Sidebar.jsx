import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition-all duration-200 ${
    isActive
      ? "text-white font-semibold"
      : "text-gray-300 hover:text-white"
  }`;
     
export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // submenu state
  const [openTable, setOpenTable] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 flex flex-col shadow-lg">
      
      {/* Logo & User Info */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-wide mb-2">Datapp</div>
        <div className="flex items-center text-gray-400 text-sm">
          <UserIcon className="w-5 h-5 mr-1" />
          {user?.username}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-6">

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        {/* Table Menu */}
        <div>
          <button
            onClick={() => setOpenTable(!openTable)}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:text-white rounded-lg"
          >
            <span>Cases List</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openTable ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          <div
            className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all ${
              openTable ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink to="/table_list/demographics_list" className={linkClass}>Demographics</NavLink>
            <NavLink to="/table_list/clinical_list" className={linkClass}>Clinical Details</NavLink>
            <NavLink to="/table_list/env_risk_factors" className={linkClass}>Env risk factors</NavLink>
          </div>
        </div>
          
        {/* Report Menu */}
        <div>
          <button
            onClick={() => setOpenReport(!openReport)}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:text-white rounded-lg"
          >
            <span>Report</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openReport ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          <div
            className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all ${
              openReport ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink to="/reports/demographics_report" className={linkClass}>Demographics</NavLink>
            <NavLink to="/reports/clinical_report" className={linkClass}>Clinical Report</NavLink>
          </div>
        </div>

        <NavLink to="/map" className={linkClass}>
          Map
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
