
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "./types";

export const useClientManagement = () => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [drivers, setDrivers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsersWithProfiles = async () => {
    try {
      setLoading(true);

      // Essayer d'abord avec l'Edge Function
      try {
        const { data: usersData, error: usersError } = await supabase.functions.invoke('get_users_with_profiles');

        if (!usersError && usersData && usersData.length > 0) {
          console.log("Utilisateurs récupérés via Edge Function:", usersData);
          
          // Filtrer par type d'utilisateur
          const clientsList = usersData.filter(user => user.user_type === 'client');
          const driversList = usersData.filter(user => user.user_type === 'chauffeur');
          
          setClients(clientsList);
          setDrivers(driversList);
          return;
        } else {
          console.warn("Pas de données de l'Edge Function ou erreur:", usersError);
        }
      } catch (edgeFnError) {
        console.warn("Erreur lors de l'appel à l'Edge Function:", edgeFnError);
      }

      // Fallback : Récupérer les utilisateurs via l'API Auth (nécessite des privilèges admin)
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authData && authData.users) {
          console.log("Utilisateurs récupérés via Auth API:", authData.users);
          
          // Récupérer les profils utilisateurs séparément
          const { data: profilesData, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*');
            
          if (profilesError) {
            console.warn("Erreur lors de la récupération des profils:", profilesError);
          }
          
          // Transformer et combiner les données
          const allUsers = authData.users.map(user => {
            const profile = profilesData?.find(p => p.user_id === user.id);
            
            return {
              id: user.id,
              email: user.email || '',
              user_type: user.user_metadata?.role || user.user_metadata?.user_type || 'client',
              first_name: profile?.first_name || user.user_metadata?.first_name || user.user_metadata?.firstName || '',
              last_name: profile?.last_name || user.user_metadata?.last_name || user.user_metadata?.lastName || '',
              company_name: profile?.company_name || user.user_metadata?.company || '',
              phone: profile?.phone || user.user_metadata?.phone || '',
              created_at: user.created_at
            };
          });
          
          // Filtrer par type d'utilisateur (basé sur les métadonnées)
          const clientsList = allUsers.filter(user => 
            user.user_type === 'client' || !user.user_type
          );
          
          const driversList = allUsers.filter(user => 
            user.user_type === 'chauffeur'
          );
          
          setClients(clientsList);
          setDrivers(driversList);
          return;
        } else {
          console.warn("Pas de données de l'Auth API ou erreur:", authError);
        }
      } catch (authApiError) {
        console.warn("Erreur lors de l'appel à l'Auth API:", authApiError);
      }
      
      // Dernier recours : Essayer de récupérer les profils utilisateurs directement
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          user_type, 
          user_profiles:user_profiles(
            first_name,
            last_name,
            company_name,
            phone
          )
        `);

      if (error) {
        console.warn("Erreur lors de la récupération des utilisateurs:", error);
        
        // Essayer une dernière fois avec juste les profils
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*');
          
        if (profilesError) {
          throw profilesError;
        }
        
        if (profiles && profiles.length > 0) {
          const transformedUsers = profiles.map(profile => ({
            id: profile.user_id || profile.id,
            email: '',
            // Define default user_type since it doesn't exist in user_profiles
            user_type: 'client',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            company_name: profile.company_name || '',
            phone: profile.phone || ''
          }));
          
          const clientsList = transformedUsers.filter(user => user.user_type === 'client');
          const driversList = transformedUsers.filter(user => user.user_type === 'chauffeur');
          
          setClients(clientsList);
          setDrivers(driversList);
          return;
        }
        
        throw error;
      }

      // Transform the data into the format we need
      const transformedUsers = data.map(user => ({
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        first_name: user.user_profiles?.[0]?.first_name || '',
        last_name: user.user_profiles?.[0]?.last_name || '',
        company_name: user.user_profiles?.[0]?.company_name,
        phone: user.user_profiles?.[0]?.phone,
        created_at: null // You may want to fetch and add this
      }));

      // Filter users by type
      const clientsList = transformedUsers.filter(user => user.user_type === 'client');
      const driversList = transformedUsers.filter(user => user.user_type === 'chauffeur');
      
      setClients(clientsList);
      setDrivers(driversList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Try to use the edge function first
      try {
        const { data, error } = await supabase.functions.invoke('admin_delete_user', {
          body: { userId: userToDelete.id }
        });
        
        if (!error) {
          toast.success("Utilisateur supprimé avec succès");
          
          // Remove user from local state
          if (userToDelete.user_type === 'client' || !userToDelete.user_type) {
            setClients(prev => prev.filter(client => client.id !== userToDelete.id));
          } else if (userToDelete.user_type === 'chauffeur') {
            setDrivers(prev => prev.filter(driver => driver.id !== userToDelete.id));
          }
          
          setDeleteDialogOpen(false);
          return;
        } else {
          console.warn("Erreur avec l'edge function:", error);
        }
      } catch (edgeFnError) {
        console.warn("Erreur lors de l'appel à l'edge function:", edgeFnError);
      }
      
      // Fallback: Try to delete user directly
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (error) {
        throw error;
      }

      toast.success("Utilisateur supprimé avec succès");
      
      // Remove user from local state
      if (userToDelete.user_type === 'client' || !userToDelete.user_type) {
        setClients(prev => prev.filter(client => client.id !== userToDelete.id));
      } else if (userToDelete.user_type === 'chauffeur') {
        setDrivers(prev => prev.filter(driver => driver.id !== userToDelete.id));
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsersWithProfiles();
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
