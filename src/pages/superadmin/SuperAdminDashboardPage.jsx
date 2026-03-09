import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const SuperAdminDashboardPage = ({ user, onLogout }) => {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="px-6 py-8">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Superadmin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder view. Add widgets and controls for superadmin here.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuperAdminDashboardPage;
