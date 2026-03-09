import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const DepartmentsPage = ({ user, onLogout }) => {
  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="px-6 py-8">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder view. Wire up department management here.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentsPage;
