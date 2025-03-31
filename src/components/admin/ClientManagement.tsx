
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientTab } from "./clients/ClientTab";
import { DriverTab } from "./clients/DriverTab";
import { DeleteUserDialog } from "./clients/DeleteUserDialog";
import { useClientManagement } from "./clients/useClientManagement";

const ClientManagement = () => {
  const {
    clients,
    drivers,
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
