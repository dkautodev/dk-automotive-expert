
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

// Simple mock types for demonstration
type MockProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  avatar_url: string | null;
};

const ClientManagement = () => {
  const { role } = useAuthContext();
  const [clients] = useState<MockProfile[]>([]);
  const [drivers] = useState<MockProfile[]>([]);
  const [loading] = useState(false);

  // Only admin can access this page
  if (role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const renderUsersList = (users: MockProfile[], userType: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{userType === 'client' ? 'Clients' : 'Chauffeurs'}</CardTitle>
        <CardDescription>
          Cette fonctionnalité est en cours de développement
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  Base de données en cours de restructuration
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
