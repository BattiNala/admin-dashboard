// pages/dashboard/DepartmentDashboard.jsx
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import IssuesSection from "@/components/dashboard/IssuesSection";

export default function DepartmentDashboardPage({ user, onLogout }) {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6">
        <IssuesSection />
      </div>
    </MainLayout>
  );
}
