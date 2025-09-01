import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { UserIcon } from "@heroicons/react/24/solid"; // import Heroicons user icon

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition-all duration-200 ${
    isActive
      ? "text-white font-semibold"      
      : "text-gray-200 hover:text-white" 
  }`;

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
      <nav className="flex-1 p-4 space-y-8">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>  
        <NavLink to="/table" className={linkClass}>Table</NavLink>
        <NavLink to="/report" className={linkClass}>Report</NavLink>
        <NavLink to="/map" className={linkClass}>Map</NavLink>
        <NavLink to="#" className={linkClass}>Help</NavLink>
        <NavLink to="#" className={linkClass}>Settings</NavLink>
      </nav>

      {/* Logout Button */}
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
  