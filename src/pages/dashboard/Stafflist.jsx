// pages/dashboard/StaffList.jsx
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useListStaff, useChangeTeam } from "@/hooks/employee/useEmployee";
import { useListTeams } from "@/hooks/team/useTeam";

// Extracted Components
import StaffHeader from "@/components/staff/StaffHeader";
import StaffFilters from "@/components/staff/StaffFilters";
import StaffTable from "@/components/staff/StaffTable";
import ChangeTeamModal from "@/components/staff/ChangeTeamModal";

export default function StaffList({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newTeamId, setNewTeamId] = useState("");

  const { data: staffList = [], isLoading, isError } = useListStaff();
  const {
    data: teams = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
  } = useListTeams();
  const { mutate: changeTeam, isPending: changingTeam } = useChangeTeam();

  // Logic: Handle saving the team change
  const handleSaveTeam = () => {
    if (!newTeamId || !selectedEmployee) {
      toast.error("Please provide a new team ID before saving.");
      return;
    }

    changeTeam(
      {
        employee_id: selectedEmployee.employee_id,
        new_team_id: parseInt(newTeamId, 10),
      },
      {
        onSuccess: () => {
          toast.success(
            `Successfully moved ${selectedEmployee.name} to new team.`,
          );
          setSelectedEmployee(null);
          setNewTeamId("");
        },
        onError: (err) => {
          toast.error(err.message || "Could not update team placement.");
        },
      },
    );
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setNewTeamId("");
  };

  // Logic: Filtering derived from search
  const filteredStaff = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return staffList;

    return staffList.filter(
      (staff) =>
        staff.name?.toLowerCase().includes(term) ||
        staff.email?.toLowerCase().includes(term) ||
        (staff.team_name || "").toLowerCase().includes(term),
    );
  }, [staffList, searchTerm]);

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Simplified Header */}
        <StaffHeader />

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100/50 overflow-hidden ring-1 ring-black/5">
          {/* Sub-Components handle the internals */}
          <StaffFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <StaffTable
            data={filteredStaff}
            isLoading={isLoading}
            isError={isError}
            onRowAction={setSelectedEmployee}
          />
        </div>

        {/* Modal extracted to reduce indent depth */}
        <ChangeTeamModal
          selectedEmployee={selectedEmployee}
          newTeamId={newTeamId}
          setNewTeamId={setNewTeamId}
          teams={teams}
          isLoadingTeams={isLoadingTeams}
          isTeamsError={isTeamsError}
          onClose={handleCloseModal}
          onSave={handleSaveTeam}
          isSubmitting={changingTeam}
        />
      </div>
    </MainLayout>
  );
}
