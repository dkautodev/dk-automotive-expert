
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DomainOriginHelperProps {
  projectId: string;
}

export const DomainOriginHelper = ({ projectId }: DomainOriginHelperProps) => {
  const [currentDomain, setCurrentDomain] = useState<string>("");
  
  useEffect(() => {
    setCurrentDomain(window.location.origin);
  }, []);
  
  const openGoogleCloudConsole = () => {
    const url = `https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`;
    window.open(url, "_blank");
  };
  
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <div className="ml-2">
        <AlertTitle className="font-medium text-blue-700">Configuration Google Maps</AlertTitle>
        <AlertDescription className="text-sm text-blue-600">
          <p>Si vous rencontrez des problèmes avec Google Maps, assurez-vous d'ajouter ce domaine à vos origines JavaScript autorisées:</p>
          <div className="mt-2 text-xs bg-blue-100 p-2 rounded-md">
            <code className="bg-white px-1 py-0.5 rounded">{currentDomain}</code>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-blue-100 border-blue-300 hover:bg-blue-200" 
              onClick={openGoogleCloudConsole}
            >
              Configurer les origines autorisées
            </Button>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};
