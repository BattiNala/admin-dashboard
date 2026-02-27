// src/components/layout/MainLayout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /> {/* Sidebar still has user/logout at bottom */}
      <div className="flex-1 flex flex-col">
        <Header /> {/* No props needed now */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
