import React from "react";
import { Search } from "lucide-react";

export default function TeamFilters({ searchTerm, onSearchChange }) {
  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search teams by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
