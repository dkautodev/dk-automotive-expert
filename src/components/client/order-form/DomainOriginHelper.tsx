
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DomainOriginHelperProps {
  projectId: string;
  error?: string | null;
}

export const DomainOriginHelper = ({ projectId, error }: DomainOriginHelperProps) => {
  const [currentDomain, setCurrentDomain] = useState<string>("");
  
  useEffect(() => {
    setCurrentDomain(window.location.origin);
  }, []);
  
  const openGoogleCloudConsole = (target: 'oauth' | 'api' = 'oauth') => {
    let url = '';
    
    if (target === 'oauth') {
      url = `https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`;
    } else if (target === 'api') {
      url = `https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=${projectId}`;
    }
    
    window.open(url, "_blank");
  };
  
  const isApiError = error?.includes('ApiNotActivatedMapError') || error?.includes("API") || false;
  
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <div className="ml-2">
        <AlertTitle className="font-medium text-blue-700">Configuration Google Maps</AlertTitle>
        <AlertDescription className="text-sm text-blue-600">
          {isApiError ? (
            <>
              <p className="font-medium">L'API Places n'est pas activée pour votre projet Google Cloud.</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-blue-100 border-blue-300 hover:bg-blue-200" 
                  onClick={() => openGoogleCloudConsole('api')}
                >
                  Activer l'API Places
                </Button>
              </div>
              <p className="mt-3 text-xs">Une fois l'API activée, ajoutez également ce domaine aux origines JavaScript autorisées:</p>
            </>
          ) : (
            <p>Si vous rencontrez des problèmes avec Google Maps, assurez-vous d'ajouter ce domaine à vos origines JavaScript autorisées:</p>
          )}
          
          <div className="mt-2 text-xs bg-blue-100 p-2 rounded-md">
            <code className="bg-white px-1 py-0.5 rounded">{currentDomain}</code>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-blue-100 border-blue-300 hover:bg-blue-200" 
              onClick={() => openGoogleCloudConsole('oauth')}
            >
              Configurer les origines autorisées
            </Button>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};
