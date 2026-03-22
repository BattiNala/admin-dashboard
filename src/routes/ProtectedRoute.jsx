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
  if (user.role !== "superadmin") return <Navigate to="/" replace />;
  return children;
};

export const RequireDeptAdmin = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "department_admin") {
    // If they are superadmin, send them to superadmin dashboard, else login
    return user.role === "superadmin" ? <Navigate to="/superadmin" replace /> : <Navigate to="/login" replace />;
  }
  return children;
};
