// src/components/layout/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            NEA - Kathmandu Branch
          </h1>
          <p className="text-sm text-gray-500">
            Department Administration Portal
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Last updated 2 min ago • February 27, 2026
        </div>
      </div>
    </header>
  );
}
