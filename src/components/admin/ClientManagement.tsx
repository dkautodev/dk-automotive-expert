
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  user_type?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  created_at?: string;
}

const ClientManagement = () => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [drivers, setDrivers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { session } = useAuthContext();

  useEffect(() => {
    fetchUsersWithProfiles();
  }, []);

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

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '??';
  };

  return (
    <Tabs defaultValue="clients" className="space-y-4">
      <TabsList>
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
      </TabsList>

      <TabsContent value="clients" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
            <CardDescription>Gérer les comptes clients</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <Loader className="w-6 h-6" />
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p>Aucun client trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={`https://avatar.vercel.sh/${client.email}.png`} alt={client.first_name} />
                              <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                            </Avatar>
                            <span>{client.first_name && client.last_name ? 
                              `${client.first_name} ${client.last_name}` : 
                              (client.email?.split('@')[0] || 'Client sans nom')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.user_type || 'client'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(client)}
                            disabled={isDeleting}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="drivers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Liste des chauffeurs</CardTitle>
            <CardDescription>Gérer les comptes chauffeurs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <Loader className="w-6 h-6" />
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p>Aucun chauffeur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={`https://avatar.vercel.sh/${driver.email}.png`} alt={driver.first_name} />
                              <AvatarFallback>{getInitials(driver.first_name, driver.last_name)}</AvatarFallback>
                            </Avatar>
                            <span>{driver.first_name && driver.last_name ? 
                              `${driver.first_name} ${driver.last_name}` : 
                              (driver.email?.split('@')[0] || 'Chauffeur sans nom')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.user_type || 'chauffeur'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(driver)}
                            disabled={isDeleting}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer un utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" onClick={confirmDeleteUser} disabled={isDeleting}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default ClientManagement;
