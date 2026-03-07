// src/components/layout/MainLayout.jsx
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({ children, user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, shown when open */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:shrink-0`}
      >
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Overlay when sidebar open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header
          user={user}
          onLogout={onLogout}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} // ← pass toggle
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
