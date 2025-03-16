
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Gestion des erreurs Google Maps
  if (loadError) {
    let errorMsg = "Erreur de chargement de Google Maps";
    
    if (loadError.message?.includes('ApiNotActivatedMapError')) {
      errorMsg = "L'API Google Maps Places n'est pas activée pour le projet 'vigilant-shell-453812-d7'. Activez-la dans la console Google Cloud.";
      console.error("Places API error:", loadError);
      
      // Afficher une seule fois le toast d'erreur
      if (!errorMessage) {
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "API Google Maps non activée",
          description: "Activez l'API Places dans la console Google Cloud pour le projet 'vigilant-shell-453812-d7'."
        });
      }
    } else if (loadError.message?.includes('InvalidKeyMapError')) {
      errorMsg = "La clé API Google Maps n'est pas valide ou n'est pas associée au projet 'vigilant-shell-453812-d7'.";
      
      if (!errorMessage) {
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive", 
          title: "Clé API invalide",
          description: "Vérifiez que votre clé API est correcte et associée au bon projet."
        });
      }
    } else if (loadError.message?.includes('RefererNotAllowedMapError')) {
      errorMsg = "Le domaine actuel n'est pas autorisé pour cette clé API. Vérifiez les restrictions de votre projet 'vigilant-shell-453812-d7'.";
      
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
        <Input
          type="text"
          placeholder="Rechercher une adresse..."
          className="w-full"
          disabled
        />
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMsg}
          </AlertDescription>
        </Alert>
        
        <div className="h-[300px] bg-red-50 flex items-center justify-center rounded-lg text-red-500 border border-red-200">
          <div className="text-center p-4">
            <p className="font-medium mb-2">{errorMsg}</p>
            <p className="text-sm">ID du projet: vigilant-shell-453812-d7</p>
            <p className="text-sm mt-2">Vérifiez que les APIs nécessaires sont bien activées dans la <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" className="underline">Console Google Cloud</a>.</p>
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
        />
      </div>
    </div>
  );
};

export default MapSection;
