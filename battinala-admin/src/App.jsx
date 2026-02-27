// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page imports from pages/ folder
import DepartmentDashboardPage from "./pages/DepartmentDashboardPage";
import TeamStaffPage from "./pages/TeamStaffPage";
import ResponseAnalyticsPage from "./pages/ResponseAnalyticsPage";
// import LoginPage from "./pages/LoginPage";   // ← uncomment when you create real login page

function App() {
  const [user, setUser] = useState(null); // Start logged out (realistic)

  const handleLogout = () => {
    setUser(null);
    alert("You have been logged out!");
  };

  // Temporary dev login function
  const handleDevLogin = () => {
    setUser({ name: "Admin User", role: "admin" });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Login Page */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo + Title */}
                    <div className="flex flex-col items-center mb-8">
                      <img
                        src="/batti-nala.png"
                        alt="BattiNala"
                        className="w-16 h-16 object-contain mb-4"
                      />
                      <h1 className="text-3xl font-bold text-gray-900">
                        BattiNala Admin
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        Department Administration Portal
                      </p>
                    </div>

                    {/* Dev login button */}
                    <button
                      onClick={handleDevLogin}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-6"
                    >
                      Login as Admin (dev only)
                    </button>

                    {/* Real login form (uncomment when ready) */}
                    {/*
                    <form className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          placeholder="Enter username"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </button>
                    </form>
                    */}
                  </div>
                </div>
              )
            }
          />

          {/* Protected Dashboard */}
          <Route
            path="/"
            element={
              user?.role === "admin" ? (
                <DepartmentDashboardPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Team Staff Directory */}
          <Route
            path="/team-staff"
            element={
              user?.role === "admin" ? (
                <TeamStaffPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/response-analytics"
            element={
              user?.role === "admin" ? (
                <ResponseAnalyticsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
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
