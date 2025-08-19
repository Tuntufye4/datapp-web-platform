import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition-all duration-200 ${
    isActive
      ? "bg-blue-600 text-white font-semibold shadow"
      : "text-gray-200 hover:bg-gray-700 hover:text-white"
  }`;

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 flex flex-col shadow-lg">
      {/* Logo & User Info */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-wide">Datapp</div>
        <div className="text-xs text-gray-400 mt-1 truncate">
          Signed in as {user?.username} ({user?.user_type})
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-8">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/table" className={linkClass}>Table</NavLink>
        <NavLink to="/report" className={linkClass}>Report</NavLink>
        <NavLink to="/map" className={linkClass}>Map</NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full bg-white-600 hover:bg-white-700 text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
