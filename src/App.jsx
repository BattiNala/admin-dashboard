import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import LoginCard from "@/pages/auth/LoginPage";
import SuperAdminDashboardPage from "@/pages/superadmin/SuperAdminDashboardPage";
import DepartmentDashboardPage from "@/pages/dashboard/DepartmentDashboardPage";
import TeamStaffPage from "@/pages/team/TeamStaffPage";
import ResponseAnalyticsPage from "@/pages/analytics/ResponseAnalyticsPage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  const isSuperAdmin = user?.role === "superadmin";
  const isDepartmentAdmin = user?.role === "department_admin";
  const isAllowedRole = isSuperAdmin || isDepartmentAdmin;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Toaster richColors position="top-right" />
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                isAllowedRole ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginCard setUser={setUser} accessDenied />
                )
              ) : (
                <LoginCard setUser={setUser} />
              )
            }
          />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              isAllowedRole ? (
                isSuperAdmin ? (
                  <Navigate to="/superadmin" replace />
                ) : (
                  <DepartmentDashboardPage user={user} onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/superadmin"
            element={
              isSuperAdmin ? (
                <SuperAdminDashboardPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/team-staff"
            element={
              isAllowedRole ? (
                <TeamStaffPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/response-analytics"
            element={
              isAllowedRole ? (
                <ResponseAnalyticsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              user ? (
                isAllowedRole ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
