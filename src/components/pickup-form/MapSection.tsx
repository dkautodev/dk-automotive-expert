
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string>("");
  const projectId = "vigilant-shell-453812-d7";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const handleManualAddressSubmit = () => {
    if (manualAddress && onAddressSelect) {
      onAddressSelect(manualAddress);
      toast({
        title: "Adresse saisie",
        description: "L'adresse a été enregistrée manuellement"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir une adresse complète"
      });
    }
  };

  // Fixed type casting for errorType parameter
  const openGoogleCloudConsole = (page: 'credentials' | 'api' | 'oauth' | 'places' = 'credentials') => {
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

  // Gestion des erreurs Google Maps
  if (loadError) {
    let errorMsg = "Erreur de chargement de Google Maps";
    let solutionMsg = "Vérifiez votre connexion internet et réessayez.";
    let errorType: 'credentials' | 'api' | 'oauth' | 'places' = 'credentials';
    
    if (loadError.message?.includes('ApiNotActivatedMapError')) {
      errorMsg = `L'API Google Maps Places n'est pas activée pour le projet '${projectId}'.`;
      solutionMsg = "Activez l'API Places et l'API JavaScript Maps dans la console Google Cloud.";
      errorType = 'places';
      
      if (!errorMessage) {
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "API Google Maps non activée",
          description: "Activez l'API Places dans la console Google Cloud."
        });
      }
    } else if (loadError.message?.includes('InvalidKeyMapError')) {
      errorMsg = `La clé API Google Maps n'est pas valide ou n'est pas associée au projet '${projectId}'.`;
      solutionMsg = "Vérifiez que votre clé API est correcte et associée au bon projet.";
      errorType = 'credentials';
      
      if (!errorMessage) {
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive", 
          title: "Clé API invalide",
          description: "Vérifiez que votre clé API est correcte et associée au bon projet."
        });
      }
    } else if (loadError.message?.includes('RefererNotAllowedMapError')) {
      errorMsg = `Le domaine actuel (${window.location.origin}) n'est pas autorisé pour cette clé API. Vérifiez les restrictions de votre projet '${projectId}'.`;
      solutionMsg = `Ajoutez "${window.location.origin}" aux origines JavaScript autorisées dans les paramètres OAuth.`;
      errorType = 'oauth';
      
      if (!errorMessage) {
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive", 
          title: "Domaine non autorisé",
          description: "Ajoutez ce domaine aux restrictions de votre projet Google Cloud."
        });
      }
    }
    
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <AlertTitle className="font-medium">Google Maps non disponible</AlertTitle>
            <AlertDescription>
              {errorMsg}
              <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
                <span className="font-medium">Solution: </span>
                {solutionMsg}
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
              onClick={handleManualAddressSubmit}
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
  }

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      try {
        const place = searchBox.getPlace();
        if (place.formatted_address && onAddressSelect) {
          onAddressSelect(place.formatted_address);
        }
        if (place.geometry?.location && map) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection du lieu:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les détails de l'adresse"
        });
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: 'fr' },
          fields: ['formatted_address', 'geometry'],
          types: ['address']
        }}
      >
        <Input
          type="text"
          placeholder="Rechercher une adresse..."
          className="w-full"
        />
      </Autocomplete>
      
      <div className="h-[300px] rounded-lg overflow-hidden">
        <GoogleMap
          zoom={5}
          center={{ lat: 46.603354, lng: 1.888334 }}
          mapContainerClassName="w-full h-full"
          onLoad={(map) => setMap(map)}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        />
      </div>
    </div>
  );
};

export default MapSection;
