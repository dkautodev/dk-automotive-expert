
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { UserData } from "./types";

interface AdminTabProps {
  admins: UserData[];
  loading: boolean;
  handleDeleteUser: (user: UserData) => void;
  isDeleting: boolean;
}

export const AdminTab = ({
  admins,
  loading,
  handleDeleteUser,
  isDeleting
}: AdminTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des administrateurs</CardTitle>
        <CardDescription>Gérer les comptes administrateurs</CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={admins} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
          userType="admin"
        />
      </CardContent>
    </Card>
  );
};
