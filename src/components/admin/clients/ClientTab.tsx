
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { UserData } from "./types";

interface ClientTabProps {
  clients: UserData[];
  loading: boolean;
  handleDeleteUser: (user: UserData) => void;
  isDeleting: boolean;
}

export const ClientTab = ({
  clients,
  loading,
  handleDeleteUser,
  isDeleting
}: ClientTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des clients</CardTitle>
        <CardDescription>Gérer les comptes clients</CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={clients} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
          userType="client"
        />
      </CardContent>
    </Card>
  );
};
