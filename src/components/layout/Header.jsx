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
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              {user?.role === "superadmin"
                ? "Batti Nala Municipal Portal"
                : `${user?.department_name?.charAt(0).toUpperCase() + user?.department_name?.slice(1) || "Department"} Dashboard`}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mt-1 sm:block hidden">
              {user?.role === "superadmin"
                ? "Central Governance Hub"
                : `${user?.department_name || "Regional"} Department Authority`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-sm font-black text-gray-900 leading-tight">
              {user?.name || user?.username || "Admin User"}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
              {user?.role === "superadmin"
                ? "Super Admin"
                : "Dept Administrator"}
            </div>
            {user?.role === "department_admin" && user?.department_name && (
              <div
                className="text-xs text-gray-400 max-w-48 truncate"
                title={user.department_name}
              >
                {user.department_name}
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 border border-gray-100 uppercase text-xs shadow-sm shadow-blue-50/50">
            {(user?.name || user?.username || "A").charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
