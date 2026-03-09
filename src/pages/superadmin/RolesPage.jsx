import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useCreateRole } from "@/hooks/role/useCreateRole";
import { useListRoles } from "@/hooks/role/useListRoles";

const RolesPage = ({ user, onLogout }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [formError, setFormError] = useState("");

  const { data, isLoading, isError, error, refetch } = useListRoles();
  const { mutate: createRole, isPending: isCreating } = useCreateRole();

  const roles = Array.isArray(data) ? data : data?.roles || data?.data || [];

  const handleOpenCreate = () => {
    setFormError("");
    setRoleName("");
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    if (isCreating) return;
    setIsCreateOpen(false);
    setFormError("");
    setRoleName("");
  };

  const handleCreateRole = (e) => {
    e.preventDefault();

    const cleanedRoleName = roleName.trim();
    if (!cleanedRoleName) {
      setFormError("Role name is required.");
      return;
    }

    createRole(
      { role_name: cleanedRoleName },
      {
        onSuccess: () => {
          toast.success("Role created successfully.");
          refetch();
          handleCloseCreate();
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to create role.");
        },
      }
    );
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage access roles for the platform.
            </p>
          </div>

          <Button type="button" className="shrink-0" onClick={handleOpenCreate}>
            <Plus size={16} />
            Create Role
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Roles List
            </h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-sm text-gray-500">Loading roles...</div>
          ) : isError ? (
            <div className="px-6 py-8 text-sm text-red-600">
              {error?.message || "Unable to load roles."}
            </div>
          ) : roles.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-500">
              No roles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-semibold px-6 py-3">
                      Role ID
                    </th>
                    <th className="text-left font-semibold px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roles.map((role, index) => (
                    <tr key={role?.role_id || role?.role_name || index}>
                      <td className="px-6 py-3 text-gray-600">
                        {typeof role?.role_id === "number"
                          ? role.role_id
                          : "—"}
                      </td>
                      <td className="px-6 py-3 text-gray-900">
                        {role?.role_name || "Unnamed Role"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Role</h2>
              <button
                type="button"
                onClick={handleCloseCreate}
                disabled={isCreating}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close create role form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="px-5 py-4">
              <label
                htmlFor="role_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                id="role_name"
                name="role_name"
                type="text"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  if (formError) setFormError("");
                }}
                disabled={isCreating}
                placeholder="Enter role name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              {formError && <p className="mt-2 text-xs text-red-600">{formError}</p>}

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreate}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default RolesPage;
