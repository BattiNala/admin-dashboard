import React from "react";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const RequireSuperAdmin = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  const role = (user.role || "").toLowerCase().replace(/\s+/g, "_");
  if (role !== "superadmin") return <Navigate to="/" replace />;
  return children;
};

export const RequireDeptAdmin = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  const role = (user.role || "").toLowerCase().replace(/\s+/g, "_");
  if (role !== "department_admin") {
    // If they are superadmin, send them to superadmin dashboard, else login
    return role === "superadmin" ? (
      <Navigate to="/superadmin" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }
  return children;
};
