// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardView from "./views/DashboardView";
// import LoginView from './views/LoginView';   // ← uncomment when you create it

function App() {
  const [user, setUser] = useState({
    name: "Admin User",
    role: "admin",
    // You can later add: token, email, permissions, etc.
  });

  const handleLogout = () => {
    // In real app: clear localStorage / cookies / invalidate token
    setUser(null);
    alert("You have been logged out!");
    // Optional: window.location.href = '/login';  // force redirect
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public route - Login */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center mb-6">
                      Login
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                      (Login screen placeholder – coming soon)
                    </p>
                    {/* Temporary bypass for development */}
                    <button
                      onClick={() =>
                        setUser({ name: "Admin User", role: "admin" })
                      }
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Login as Admin (dev only)
                    </button>
                  </div>
                </div>
              )
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/"
            element={
              user?.role === "admin" ? (
                <DashboardView user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all - redirect unknown paths */}
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
