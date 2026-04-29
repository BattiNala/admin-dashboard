// pages/dashboard/DepartmentDashboard.jsx
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import IssuesSection from "@/components/dashboard/IssuesSection";

export default function DepartmentDashboardPage({ user, onLogout }) {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-6 space-y-8">
        {/* <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -left-10 -bottom-12 h-36 w-36 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Operations dashboard
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">
              Department Issues
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl">
              Track volume, verification backlog, and recent activity across
              reported issues.
            </p>
          </div>
        </div> */}

        <IssuesSection />
      </div>
    </MainLayout>
  );
}
