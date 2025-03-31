
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserData } from "./types";
import { fetchUsersWithProfiles } from "./services/userService";
import { useDeleteUserDialog } from "./hooks/useDeleteUserDialog";
import { UseClientManagementReturn } from "./types/clientManagementTypes";

export const useClientManagement = (): UseClientManagementReturn => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [drivers, setDrivers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle user deletion after the user is removed
  const handleUserDeleted = (userId: string, userType: string | undefined) => {
    if (userType === 'client' || !userType) {
      setClients(prev => prev.filter(client => client.id !== userId));
    } else if (userType === 'chauffeur') {
      setDrivers(prev => prev.filter(driver => driver.id !== userId));
    }
  };

  // Use the delete dialog hook
  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  } = useDeleteUserDialog(handleUserDeleted);

  // Fetch users from all available sources
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { clients: clientsList, drivers: driversList } = await fetchUsersWithProfiles();
      setClients(clientsList);
      setDrivers(driversList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    clients,
    drivers,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  };
};
