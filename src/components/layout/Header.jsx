import React from "react";
import { Menu } from "lucide-react";

export default function Header({ user, onMenuClick }) {
  const roleLabel =
    user?.role === "superadmin"
      ? "Super Admin"
      : user?.role === "department_admin"
        ? "Department Admin"
        : null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              Batti Nala
            </h1>
            <p className="text-sm text-gray-500 truncate">
              Municipal Issue Reporting System
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          {user && roleLabel && (
            <div className="text-sm text-gray-900 font-medium">
              {user?.name || user?.username || "Admin"}
            </div>
          )}
          {user && roleLabel && (
            <div className="text-xs text-gray-500">{roleLabel}</div>
          )}
          {user?.role === "department_admin" && user?.department_name && (
            <div
              className="text-xs text-gray-400 max-w-[12rem] truncate ml-auto"
              title={user.department_name}
            >
              {user.department_name}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </header>
  );
}
