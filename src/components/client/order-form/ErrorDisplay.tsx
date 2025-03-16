
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ErrorDisplayProps {
  error: string | null;
  solution?: string | null;
  projectId?: string;
}

export const ErrorDisplay = ({ error, solution, projectId }: ErrorDisplayProps) => {
  const [currentDomain, setCurrentDomain] = useState<string>("");
  
  useEffect(() => {
    // Capture le domaine actuel pour faciliter la configuration
    setCurrentDomain(window.location.origin);
  }, []);
  
  if (!error) return null;
  
  const isRefererError = error.includes("domaine") || error.includes("Referer") || error.includes("RefererNotAllowedMapError");
  const isApiError = error.includes("API") || error.includes("ApiNotActivatedMapError");
  
  const openGoogleCloudConsole = (type: string = 'credentials') => {
    const baseUrl = "https://console.cloud.google.com";
    let url = baseUrl;
    
    if (projectId) {
      if (type === 'oauth' || isRefererError) {
        // Ouvrir la page des origines JavaScript autorisées
        url = `${baseUrl}/apis/credentials/oauthclient?project=${projectId}`;
      } else if (type === 'places' || isApiError) {
        // Ouvrir la page pour activer l'API Places spécifiquement
        url = `${baseUrl}/apis/library/places-backend.googleapis.com?project=${projectId}`;
      } else if (type === 'maps') {
        // Ouvrir la page pour activer l'API Maps
        url = `${baseUrl}/apis/library/maps-backend.googleapis.com?project=${projectId}`;
      } else if (type === 'directions') {
        // Ouvrir la page pour activer l'API Directions
        url = `${baseUrl}/apis/library/directions-backend.googleapis.com?project=${projectId}`;
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
          
          {isApiError && (
            <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
              <span className="font-medium">Activez les API nécessaires: </span>
              <div className="mt-2 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs mr-2"
                  onClick={() => openGoogleCloudConsole('places')}
                >
                  Activer l'API Places
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs mr-2"
                  onClick={() => openGoogleCloudConsole('maps')}
                >
                  Activer l'API Maps
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => openGoogleCloudConsole('directions')}
                >
                  Activer l'API Directions
                </Button>
              </div>
            </div>
          )}
          
          {isRefererError && currentDomain && (
            <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
              <span className="font-medium">Domaine à ajouter: </span>
              <code className="bg-black/10 p-1 rounded">{currentDomain}</code>
              <p className="mt-1">Ajoutez ce domaine dans "Authorized JavaScript origins" dans la console Google Cloud.</p>
            </div>
          )}
          
          {(isRefererError || isApiError || projectId) && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => openGoogleCloudConsole(isRefererError ? 'oauth' : isApiError ? 'places' : 'credentials')}
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
