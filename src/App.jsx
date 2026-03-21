import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import LoginCard from "@/pages/auth/LoginPage";
import SuperAdminDashboardPage from "@/pages/superadmin/SuperAdminDashboardPage";
import RolesPage from "@/pages/superadmin/RolesPage";
import DepartmentsPage from "@/pages/superadmin/DepartmentsPage";
import UsersPage from "@/pages/superadmin/UsersPage";
import DepartmentDashboardPage from "@/pages/dashboard/DepartmentDashboardPage";
import TeamList from "@/pages/dashboard/Teamlist";
import StaffList from "@/pages/dashboard/Stafflist";
import AddStaffPage from "@/pages/dashboard/AddStaff";
import CreateTeamPage from "@/pages/dashboard/CreateTeam";
import ChangeEmployeeTeam from "@/pages/dashboard/ChangeEmployeeTeam";
import TeamStaffPage from "@/pages/team/TeamStaffPage";
import ResponseAnalyticsPage from "@/pages/analytics/ResponseAnalyticsPage";
import { clearAuth, loadAuth } from "@/utils/authStorage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = loadAuth();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
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
                  <DepartmentDashboardPage
                    user={user}
                    onLogout={handleLogout}
                  />
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
            path="/superadmin/roles"
            element={
              isSuperAdmin ? (
                <RolesPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/superadmin/departments"
            element={
              isSuperAdmin ? (
                <DepartmentsPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/superadmin/users"
            element={
              isSuperAdmin ? (
                <UsersPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/teams"
            element={
              isAllowedRole ? (
                <TeamList user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/staff"
            element={
              isAllowedRole ? (
                <StaffList user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/add-staff"
            element={
              isAllowedRole ? (
                <AddStaffPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/create-team"
            element={
              isAllowedRole ? (
                <CreateTeamPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/change-team"
            element={
              isAllowedRole ? (
                <ChangeEmployeeTeam user={user} onLogout={handleLogout} />
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
