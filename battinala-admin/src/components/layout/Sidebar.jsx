// src/components/layout/Sidebar.jsx
import { AlertTriangle, Users, BarChart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col">
      <div className="p-6 grow">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
            <img
              src="/batti-nala.png"
              alt="BattiNala Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-900">BattiNala</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium"
          >
            <AlertTriangle className="w-5 h-5 mr-3" />
            Department
          </Link>

          <Link
            to="/team-staff"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Users className="w-5 h-5 mr-3" />
            My Team Staff
          </Link>

          <Link
            to="/response-analytics"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <BarChart className="w-5 h-5 mr-3" />
            Response Analytics
          </Link>
        </nav>
      </div>

      {/* Admin User + Logout at the bottom */}
      <div className="p-6 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
