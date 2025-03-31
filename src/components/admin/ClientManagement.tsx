
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
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

  useEffect(() => {
    fetchUsersWithProfiles();
  }, []);

  const fetchUsersWithProfiles = async () => {
    try {
      setLoading(true);
      
      // Using RPC function to get users with their profiles
      const { data, error } = await supabase.rpc(
        'get_users_with_profiles'
      );

      if (error) {
        throw error;
      }

      // Filter users by type
      const clientsList = data.filter(user => user.user_type === 'client');
      const driversList = data.filter(user => user.user_type === 'chauffeur');
      
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
      
      // Using RPC function to delete user
      const { error } = await supabase.rpc(
        'admin_delete_user',
        { user_id: userToDelete.id }
      );

      if (error) {
        throw error;
      }

      toast.success("Utilisateur supprimé avec succès");
      
      // Remove user from local state
      if (userToDelete.user_type === 'client') {
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
                              <AvatarFallback>{client.first_name?.charAt(0)}{client.last_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{client.first_name} {client.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.user_type}</TableCell>
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
                              <AvatarFallback>{driver.first_name?.charAt(0)}{driver.last_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{driver.first_name} {driver.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.user_type}</TableCell>
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
