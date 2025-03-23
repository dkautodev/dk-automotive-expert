
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { MapError } from '../hooks/useGoogleMapsLoader';
import GoogleMapsHelper from './GoogleMapsHelper';

interface MapErrorDisplayProps {
  error: Error | null;
  projectId: string;
  parseGoogleMapsError: (error: Error) => MapError;
  manualAddress: string;
  setManualAddress: (address: string) => void;
  onManualAddressSubmit: () => void;
  detailedError?: string | null;
}

const MapErrorDisplay = ({ 
  error, 
  projectId, 
  parseGoogleMapsError,
  manualAddress,
  setManualAddress,
  onManualAddressSubmit,
  detailedError
}: MapErrorDisplayProps) => {
  if (!error) return null;
  
  const { message, solution, errorType, errorCode } = parseGoogleMapsError(error);
  
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
      case 'maps-js':
        url = `https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=${projectId}`;
        break;
      case 'credentials':
      default:
        url = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <GoogleMapsHelper projectId={projectId} errorCode={errorCode} />
      
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
            
            {(errorType === 'places' || errorCode === 'ApiTargetBlockedMapError') && (
              <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
                <span className="font-medium">Activation de l'API Places requise: </span>
                <p>Vous devez activer l'API Places et Maps JavaScript dans la console Google Cloud.</p>
                <p className="mt-1 text-xs font-bold">Code d'erreur: {errorCode || 'API Places non activée'}</p>
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
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => openGoogleCloudConsole('oauth')}
                  >
                    Configurer les origines autorisées
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => openGoogleCloudConsole('maps-js')}
                  >
                    Activer Maps JavaScript API
                  </Button>
                </>
              )}
            </div>
          </AlertDescription>
        </div>
      </Alert>
      
      {detailedError && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-medium">Détails techniques de l'erreur</AlertTitle>
          <AlertDescription>
            <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32 text-xs font-mono">
              {detailedError}
            </div>
            <p className="text-xs mt-2">
              Utilisez ces informations lors de la configuration dans la Google Cloud Console.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
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
