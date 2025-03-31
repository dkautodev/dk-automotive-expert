
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { UserData } from "./types";

interface DriverTabProps {
  drivers: UserData[];
  loading: boolean;
  handleDeleteUser: (user: UserData) => void;
  isDeleting: boolean;
}

export const DriverTab = ({
  drivers,
  loading,
  handleDeleteUser,
  isDeleting
}: DriverTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des chauffeurs</CardTitle>
        <CardDescription>Gérer les comptes chauffeurs</CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={drivers} 
          loading={loading} 
          handleDeleteUser={handleDeleteUser}
          isDeleting={isDeleting}
          userType="chauffeur"
        />
      </CardContent>
    </Card>
  );
};
