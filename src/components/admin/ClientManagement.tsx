
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientTab } from "./clients/ClientTab";
import { DriverTab } from "./clients/DriverTab";
import { AdminTab } from "./clients/AdminTab";
import { DeleteUserDialog } from "./clients/DeleteUserDialog";
import { useClientManagement } from "./clients/useClientManagement";

const ClientManagement = () => {
  const {
    clients,
    drivers,
    admins,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  } = useClientManagement();

  return (
    <Tabs defaultValue="clients" className="space-y-4">
      <TabsList>
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
        <TabsTrigger value="admins">Administrateurs</TabsTrigger>
      </TabsList>

      <TabsContent value="clients" className="space-y-4">
        <ClientTab 
          clients={clients} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
        />
      </TabsContent>

      <TabsContent value="drivers" className="space-y-4">
        <DriverTab 
          drivers={drivers} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
        />
      </TabsContent>

      <TabsContent value="admins" className="space-y-4">
        <AdminTab 
          admins={admins} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
        />
      </TabsContent>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        isDeleting={isDeleting}
      />
    </Tabs>
  );
};

export default ClientManagement;
