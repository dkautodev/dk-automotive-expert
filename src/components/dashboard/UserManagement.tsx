
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserProfile } from "@/hooks/auth/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Service mock pour les utilisateurs
const mockUserService = {
  getUsers: async (): Promise<UserProfile[]> => {
    await simulateDelay();
    
    // Données mockes d'utilisateurs
    return [
      {
        id: "user-1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        phone: "+33123456789",
        company: "Admin Inc",
        avatarUrl: null,
        role: "admin"
      },
      {
        id: "user-2",
        firstName: "Client",
        lastName: "User",
        email: "client@example.com",
        phone: "+33987654321",
        company: "Client Corp",
        avatarUrl: null,
        role: "client"
      },
      {
        id: "user-3",
        firstName: "Driver",
        lastName: "User",
        email: "driver@example.com",
        phone: "+33555555555",
        company: "Driver LLC",
        avatarUrl: null,
        role: "driver"
      }
    ];
  }
};

const UserManagement = () => {
  const { role } = useAuthContext();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Only admin can access this page
  if (role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await mockUserService.getUsers();
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
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
                  <TableHead>Rôle</TableHead>
                  <TableHead>Société</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || ''} />
                        <AvatarFallback>
                          {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.firstName} {user.lastName}</span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? 'Administrateur' : 
                       user.role === 'driver' ? 'Chauffeur' : 'Client'}
                    </TableCell>
                    <TableCell>{user.company || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
