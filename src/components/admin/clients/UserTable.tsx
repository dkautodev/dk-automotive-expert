
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { UserData } from "./types";

interface UserTableProps {
  users: UserData[];
  loading: boolean;
  handleDeleteUser: (user: UserData) => void;
  isDeleting: boolean;
  userType: "client" | "chauffeur";
}

export const UserTable = ({ 
  users,
  loading,
  handleDeleteUser,
  isDeleting,
  userType
}: UserTableProps) => {
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '??';
  };

  const displayName = userType === "client" ? "client" : "chauffeur";

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader className="w-6 h-6" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground flex flex-col items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>Aucun {displayName} trouvé</p>
      </div>
    );
  }

  return (
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.first_name} />
                    <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                  </Avatar>
                  <span>{user.first_name && user.last_name ? 
                    `${user.first_name} ${user.last_name}` : 
                    (user.email?.split('@')[0] || `${displayName} sans nom`)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.user_type || displayName}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user)}
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
  );
};
