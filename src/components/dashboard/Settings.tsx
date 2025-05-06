
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Settings = () => {
  const { role } = useAuthContext();

  // Only admin can access this page
  if (role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres de l'application</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              La base de données a été restructurée pour améliorer les performances et la maintenance.
              Les anciennes tables ont été supprimées et une nouvelle structure simplifiée a été mise en place.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
