import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import {
  Building2,
  Users,
  ArrowRight,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { useListDepartments } from "@/hooks/superadmin/useDepartment";

const SuperAdminDashboardPage = ({ user, onLogout }) => {
  const { data: departments = [], isLoading, isError } = useListDepartments();

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header & Purpose Statement */}
        <div className="mb-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white shadow-lg shadow-blue-900/20">
          <h1 className="text-3xl font-bold mb-3">
            Superadmin Dashboard
          </h1>
          <p className="text-blue-100 max-w-3xl leading-relaxed text-lg">
            Welcome, <strong>{user?.name || user?.username || "Admin"}</strong>. 
            Your sole administrative purpose is to construct the Batti Nala infrastructure by 
            <strong className="text-white"> creating departments</strong> and <strong className="text-white">assigning department administrators</strong>.
          </p>
          
          {/* <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link 
              to="/superadmin/departments" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <PlusCircle size={20} />
              Create Department
            </Link>
            <Link 
              to="/superadmin/users" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800/50 border border-blue-700/50 text-white font-medium rounded-xl hover:bg-blue-700/50 transition-colors"
            >
              <Users size={20} />
              Create Department Admin
            </Link>
          </div> */}
        </div>

        {/* Active Departments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="text-blue-600" size={24} />
              Active Departments ({departments.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center shadow-sm">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading active departments...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-8 flex items-center gap-3 text-red-800">
              <AlertCircle size={24} className="shrink-0" />
              <p>Unable to load departments. Please try refreshing the page.</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Get started by creating your first municipal infrastructure department.
              </p>
              <Link 
                to="/superadmin/departments" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                Go to Departments <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {departments.map((dept) => (
                <div 
                  key={dept.department_id} 
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Building2 size={24} />
                    </div>
                    {dept.created_at && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        {new Date(dept.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {dept.department_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      #
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      ID: {dept.department_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </MainLayout>
  );
};

export default SuperAdminDashboardPage;
