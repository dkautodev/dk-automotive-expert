
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { ProfileRow } from "@/types/database";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const ClientManagement = () => {
  const { role } = useAuthContext();
  const [clients, setClients] = useState<ProfileRow[]>([]);
  const [drivers, setDrivers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Only admin can access this page
  if (role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await extendedSupabase
          .from('profiles')
          .select('*');
          
        if (error) throw error;
        
        const profileData = data as ProfileRow[];
        const clientProfiles = profileData.filter(p => p.role === 'client');
        const driverProfiles = profileData.filter(p => p.role === 'driver');
        
        setClients(clientProfiles);
        setDrivers(driverProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  const renderUsersList = (users: ProfileRow[], userType: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{userType === 'client' ? 'Clients' : 'Chauffeurs'}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader className="w-6 h-6" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Société</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>
                          {(user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.first_name} {user.last_name}</span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{user.company_name || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    Aucun {userType === 'client' ? 'client' : 'chauffeur'} trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4">
          {renderUsersList(clients, 'client')}
        </TabsContent>
        
        <TabsContent value="drivers" className="space-y-4">
          {renderUsersList(drivers, 'driver')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientManagement;
