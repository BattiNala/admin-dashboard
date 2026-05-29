import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LoginCard from "@/pages/auth/LoginPage";
import AnonymousIssuePage from "@/pages/public/AnonymousIssuePage";
import SuperAdminDashboardPage from "@/pages/superadmin/SuperAdminDashboardPage";
import RolesPage from "@/pages/superadmin/RolesPage";
import DepartmentsPage from "@/pages/superadmin/DepartmentsPage";
import UsersPage from "@/pages/superadmin/UsersPage";
import EmployeesPage from "@/pages/superadmin/EmployeesPage";
import DepartmentDashboardPage from "@/pages/dashboard/DepartmentDashboardPage";
import TeamList from "@/pages/dashboard/Teamlist";
import StaffList from "@/pages/dashboard/Stafflist";
import AddStaffPage from "@/pages/dashboard/AddStaff";
import CreateTeamPage from "@/pages/dashboard/CreateTeam";
import ChangeEmployeeTeam from "@/pages/dashboard/ChangeEmployeeTeam";
import TeamStaffPage from "@/pages/team/TeamStaffPage";
import ResponseAnalyticsPage from "@/pages/analytics/ResponseAnalyticsPage";

import { clearAuth, loadAuth } from "@/utils/authStorage";
import {
  RequireAuth,
  RequireSuperAdmin,
  RequireDeptAdmin,
} from "@/routes/ProtectedRoute";

function App() {
  const [user, setUser] = useState(() => loadAuth());

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/report" element={<AnonymousIssuePage />} />

          {/* Public / Auth */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginCard setUser={setUser} />
              )
            }
          />

          {/* Root Switcher */}
          <Route
            path="/"
            element={
              user ? (
                <RequireAuth user={user}>
                  {user?.role === "superadmin" ? (
                    <Navigate to="/superadmin" replace />
                  ) : (
                    <DepartmentDashboardPage
                      user={user}
                      onLogout={handleLogout}
                    />
                  )}
                </RequireAuth>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Superadmin Protected Routes */}
          <Route
            path="/superadmin"
            element={
              <RequireSuperAdmin user={user}>
                <SuperAdminDashboardPage user={user} onLogout={handleLogout} />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/superadmin/roles"
            element={
              <RequireSuperAdmin user={user}>
                <RolesPage user={user} onLogout={handleLogout} />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/superadmin/departments"
            element={
              <RequireSuperAdmin user={user}>
                <DepartmentsPage user={user} onLogout={handleLogout} />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/superadmin/users"
            element={
              <RequireSuperAdmin user={user}>
                <UsersPage user={user} onLogout={handleLogout} />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/superadmin/employees"
            element={
              <RequireSuperAdmin user={user}>
                <EmployeesPage user={user} onLogout={handleLogout} />
              </RequireSuperAdmin>
            }
          />

          {/* Department Admin Protected Routes */}
          <Route
            path="/dashboard/teams"
            element={
              <RequireDeptAdmin user={user}>
                <TeamList user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />
          <Route
            path="/dashboard/staff"
            element={
              <RequireDeptAdmin user={user}>
                <StaffList user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />
          <Route
            path="/dashboard/add-staff"
            element={
              <RequireDeptAdmin user={user}>
                <AddStaffPage user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />
          <Route
            path="/dashboard/create-team"
            element={
              <RequireDeptAdmin user={user}>
                <CreateTeamPage user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />
          <Route
            path="/dashboard/change-team"
            element={
              <RequireDeptAdmin user={user}>
                <ChangeEmployeeTeam user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />

          <Route
            path="/team-staff"
            element={
              <RequireDeptAdmin user={user}>
                <TeamStaffPage user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />
          <Route
            path="/response-analytics"
            element={
              <RequireDeptAdmin user={user}>
                <ResponseAnalyticsPage user={user} onLogout={handleLogout} />
              </RequireDeptAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
