import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Loginpage"
import DepartmentDashboardPage from "./pages/DepartmentDashboardPage";
import TeamStaffPage from "./pages/TeamStaffPage";
import ResponseAnalyticsPage from "./pages/ResponseAnalyticsPage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage setUser={setUser} />
              )
            }
          />
          {/* Protected routes */}
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
