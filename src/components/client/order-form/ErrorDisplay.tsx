
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
  solution?: string | null;
  projectId?: string;
}

export const ErrorDisplay = ({ error, solution, projectId }: ErrorDisplayProps) => {
  if (!error) return null;
  
  const isRefererError = error.includes("domaine") || error.includes("Referer") || error.includes("RefererNotAllowedMapError");
  const isApiError = error.includes("API") || error.includes("ApiNotActivatedMapError");
  
  const openGoogleCloudConsole = () => {
    const baseUrl = "https://console.cloud.google.com";
    let url = baseUrl;
    
    if (projectId) {
      if (isRefererError) {
        // Ouvrir la page des origines JavaScript autorisées
        url = `${baseUrl}/apis/credentials/oauthclient?project=${projectId}`;
      } else if (isApiError) {
        // Ouvrir la page pour activer l'API
        url = `${baseUrl}/apis/library/maps-backend.googleapis.com?project=${projectId}`;
      } else {
        // Page par défaut des credentials
        url = `${baseUrl}/apis/credentials?project=${projectId}`;
      }
    } else {
      url = `${baseUrl}/apis/credentials`;
    }
    
    window.open(url, "_blank");
  };
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <div className="ml-2">
        <AlertTitle className="font-medium">Erreur</AlertTitle>
        <AlertDescription className="text-sm">
          {error}
          {solution && (
            <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
              <span className="font-medium">Solution: </span>
              {solution}
            </div>
          )}
          
          {(isRefererError || isApiError || projectId) && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={openGoogleCloudConsole}
              >
                {isRefererError 
                  ? "Configurer les origines autorisées" 
                  : isApiError 
                    ? "Activer les APIs Google Maps" 
                    : "Ouvrir Google Cloud Console"}
              </Button>
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
};
