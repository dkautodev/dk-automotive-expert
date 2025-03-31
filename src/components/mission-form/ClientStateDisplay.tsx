
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ClientStateDisplayProps {
  isLoading: boolean;
  error: string | null;
  clientsCount: number;
}

const ClientStateDisplay = ({ isLoading, error, clientsCount }: ClientStateDisplayProps) => {
  if (isLoading) {
    return (
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Chargement des clients en cours...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des clients. Veuillez réessayer ou ajouter un nouveau client.
        </AlertDescription>
      </Alert>
    );
  }

  if (clientsCount === 0) {
    return (
      <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-700">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucun client n'a été trouvé dans la base de données. Veuillez en ajouter un en utilisant le bouton +.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ClientStateDisplay;
