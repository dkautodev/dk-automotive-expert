
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapsHelperProps {
  projectId: string;
  errorCode?: string;
}

const GoogleMapsHelper = ({ projectId, errorCode }: GoogleMapsHelperProps) => {
  const currentDomain = window.location.origin;
  
  const openGoogleCloudConsole = (target: 'places' | 'maps' | 'oauth' | 'credentials') => {
    let url = '';
    
    switch (target) {
      case 'places':
        url = `https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=${projectId}`;
        break;
      case 'maps':
        url = `https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=${projectId}`;
        break;
      case 'oauth':
        url = `https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`;
        break;
      case 'credentials':
        url = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;
        break;
    }
    
    window.open(url, '_blank');
  };
  
  const isApiError = errorCode?.includes('ApiTargetBlockedMapError') || 
                     errorCode?.includes('ApiNotActivatedMapError');
  
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <div className="ml-2">
        <AlertTitle className="font-medium text-blue-700">Guide de configuration Google Maps</AlertTitle>
        <AlertDescription>
          <p className="text-sm text-blue-600 mb-2">Pour que Google Maps fonctionne correctement, suivez ces étapes:</p>
          
          <ol className="list-decimal pl-5 text-sm text-blue-600 space-y-2">
            <li>
              <span className="font-medium">Activer les API nécessaires:</span>
              <div className="mt-1 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-white" 
                  onClick={() => openGoogleCloudConsole('places')}
                >
                  1. Activer Places API
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-white" 
                  onClick={() => openGoogleCloudConsole('maps')}
                >
                  2. Activer Maps JavaScript API
                </Button>
              </div>
            </li>
            
            <li className="mt-2">
              <span className="font-medium">Configurer les restrictions de l'API:</span>
              <div className="mt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-white" 
                  onClick={() => openGoogleCloudConsole('credentials')}
                >
                  Vérifier les restrictions de la clé API
                </Button>
              </div>
            </li>
            
            <li className="mt-2">
              <span className="font-medium">Ajouter ce domaine aux origines autorisées:</span>
              <div className="mt-1 bg-white p-2 rounded border border-blue-200 text-xs font-mono">
                {currentDomain}
              </div>
              <div className="mt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-white" 
                  onClick={() => openGoogleCloudConsole('oauth')}
                >
                  Configurer les origines autorisées
                </Button>
              </div>
            </li>
          </ol>
          
          {isApiError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              <p className="font-medium">Erreur détectée: {errorCode}</p>
              <p>L'API Places n'est pas activée ou est bloquée pour votre projet.</p>
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default GoogleMapsHelper;
