
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Eye, Trash2, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { useState } from "react";
import { UserData } from "./types";

interface UserTableProps {
  users: UserData[];
  loading: boolean;
  handleDeleteUser: (user: UserData) => void;
  isDeleting: boolean;
  userType: "client" | "chauffeur" | "admin";
}

export const UserTable = ({ 
  users,
  loading,
  handleDeleteUser,
  isDeleting,
  userType
}: UserTableProps) => {
  const [sortField, setSortField] = useState<keyof UserData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '??';
  };

  const formatUserDisplay = (user: UserData) => {
    const nameParts = [];
    if (user.last_name) nameParts.push(user.last_name.toUpperCase());
    if (user.first_name) nameParts.push(user.first_name);
    if (user.company_name) nameParts.push(user.company_name);
    
    return nameParts.length > 0 ? nameParts.join('-') : (user.email?.split('@')[0] || `${userType} sans nom`);
  };

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof UserData) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowDownAZ className="h-4 w-4 ml-1" /> : <ArrowUpAZ className="h-4 w-4 ml-1" />;
  };

  const displayName = userType === "client" ? "client" : (userType === "chauffeur" ? "chauffeur" : "administrateur");

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField] as string || '';
    const bValue = b[sortField] as string || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

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
            <TableHead className="cursor-pointer" onClick={() => handleSort('first_name')}>
              <div className="flex items-center">
                Nom {getSortIcon('first_name')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              <div className="flex items-center">
                Email {getSortIcon('email')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('company_name')}>
              <div className="flex items-center">
                Société {getSortIcon('company_name')}
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.first_name} />
                    <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                  </Avatar>
                  <span>{formatUserDisplay(user)}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.company_name || '-'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="p-2 h-8 w-8"
                    onClick={() => window.location.href = `/dashboard/admin/profile/${user.id}`}
                    title="Consulter"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="p-2 h-8 w-8"
                    onClick={() => handleDeleteUser(user)}
                    disabled={isDeleting}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
