
import { useState } from "react";
import { toast } from "sonner";
import { UserData } from "../types";
import { deleteUser } from "../services/userService";

export const useDeleteUserDialog = (
  onUserDeleted: (userId: string, userType: string | undefined) => void
) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      await deleteUser(userToDelete.id);
      toast.success("Utilisateur supprimé avec succès");
      
      // Notify parent component to update state
      onUserDeleted(userToDelete.id, userToDelete.user_type);
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  };
};
