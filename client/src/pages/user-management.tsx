import { useState } from "react";
import DashboardHeader from "@/components/admin-header";
import AdminSidebar from "@/components/new-admin-sidebar";
import UserManagementTable from "@/components/user-management-table";
import AddUserModal from "@/components/add-user-modal";

export default function UserManagementPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar activeSection="users" onNavigate={() => {}} />
      <div className="ml-64 flex flex-col">
        <DashboardHeader
          user={{ 
            id: 0, 
            name: 'Admin User', 
            role: 'admin', 
            department: { id: 0, name: '', shortName: '', createdAt: "", updatedAt: "" }, 
            uniqueId: '0000', 
            status: 'active', 
            createdAt: "", 
            updatedAt: "" 
          }}
          title="User Management"
          subtitle="Manage staff information."
          borderColor="border-university-admin"
          bgColor="bg-university-admin"
        />
        <UserManagementTable onAddUser={() => setIsAddUserModalOpen(true)} />
      </div>
      
      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)}
        editingUser={null}
      />
    </div>
  );
}
