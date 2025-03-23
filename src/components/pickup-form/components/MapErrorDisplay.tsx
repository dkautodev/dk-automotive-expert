
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { MapError } from '../hooks/useGoogleMapsLoader';

interface MapErrorDisplayProps {
  error: Error | null;
  projectId: string;
  parseGoogleMapsError: (error: Error) => MapError;
  manualAddress: string;
  setManualAddress: (address: string) => void;
  onManualAddressSubmit: () => void;
}

const MapErrorDisplay = ({ 
  error, 
  projectId, 
  parseGoogleMapsError,
  manualAddress,
  setManualAddress,
  onManualAddressSubmit
}: MapErrorDisplayProps) => {
  if (!error) return null;
  
  const { message, solution, errorType } = parseGoogleMapsError(error);
  
  const openGoogleCloudConsole = (page: string) => {
    let url = `https://console.cloud.google.com/apis`;
    
    switch (page) {
      case 'oauth':
        url = `https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`;
        break;
      case 'api':
        url = `https://console.cloud.google.com/apis/library?project=${projectId}`;
        break;
      case 'places':
        url = `https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=${projectId}`;
        break;
      case 'credentials':
      default:
        url = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div className="ml-2">
          <AlertTitle className="font-medium">Google Maps non disponible</AlertTitle>
          <AlertDescription>
            {message}
            <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
              <span className="font-medium">Solution: </span>
              {solution}
            </div>
            
            {errorType === 'places' && (
              <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
                <span className="font-medium">Activation de l'API Places requise: </span>
                <p>Vous devez activer l'API Places dans la console Google Cloud.</p>
              </div>
            )}
            
            <div className="mt-3 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => openGoogleCloudConsole(errorType)}
              >
                {errorType === 'oauth' 
                  ? "Configurer les origines autorisées" 
                  : errorType === 'places'
                    ? "Activer l'API Places"
                    : errorType === 'api'
                      ? "Activer les APIs requises"
                      : "Vérifier la clé API"}
              </Button>
              
              {errorType === 'places' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={() => openGoogleCloudConsole('oauth')}
                >
                  Configurer les origines autorisées
                </Button>
              )}
            </div>
          </AlertDescription>
        </div>
      </Alert>
      
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Saisie manuelle de l'adresse</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Saisissez l'adresse complète..."
              className="w-full"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-gray-400">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Saisissez une adresse complète incluant le numéro, la rue, le code postal et la ville.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full"
            onClick={onManualAddressSubmit}
          >
            Utiliser cette adresse
          </button>
        </div>
      </div>
      
      <div className="h-[200px] bg-red-50 flex items-center justify-center rounded-lg text-red-500 border border-red-200">
        <div className="text-center p-4 max-w-lg">
          <p className="font-medium mb-2">Service de cartographie indisponible</p>
          <p className="text-sm">ID du projet: {projectId}</p>
          <p className="text-sm mt-2">
            Vérifiez que les APIs nécessaires sont bien activées dans la 
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm ml-1 text-blue-500"
              onClick={() => openGoogleCloudConsole('places')}
            >
              Console Google Cloud
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapErrorDisplay;
