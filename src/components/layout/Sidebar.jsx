import {
  AlertTriangle,
  Users,
  BarChart,
  LogOut,
  Shield,
  Building2,
  UserCog,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  const isSuperAdmin = user?.role === "superadmin";
  const location = useLocation();

  const navItems = isSuperAdmin
    ? [
        // { to: "/superadmin/roles", label: "Roles", Icon: Shield },
        {
          to: "/superadmin/departments",
          label: "Departments",
          Icon: Building2,
        },
        { to: "/superadmin/users", label: "Dept. Admins", Icon: UserCog },
        { to: "/superadmin/employees", label: "Employees", Icon: Users },
      ]
    : [
        { to: "/", label: "Dashboard", Icon: AlertTriangle },
        { to: "/dashboard/teams", label: "Teams", Icon: Building2 },
        { to: "/dashboard/staff", label: "Department Staff", Icon: UserCog },
        {
          to: "/response-analytics",
          label: "Reports overview",
          Icon: BarChart,
        },
      ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col">
      <div className="p-6 grow">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/batti-nala.png"
              alt="BattiNala Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
            BattiNala
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map(({ to, label, Icon }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User + Logout at the bottom */}
      <div className="p-6 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium uppercase">
              {(user?.name || user?.username || "A").charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.username || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === "superadmin" ? "Super Admin" : null}
              </p>
              {user?.role === "department_admin" && user?.department_name && (
                <p
                  className="text-xs text-gray-400 truncate max-w-44"
                  title={user.department_name}
                >
                  {user.department_name}
                </p>
              )}
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
