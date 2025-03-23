
import React, { useState, useCallback } from 'react';
import { GoogleMap, Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GoogleMapDisplayProps {
  onAddressSelect?: (address: string) => void;
}

const GoogleMapDisplay = ({ onAddressSelect }: GoogleMapDisplayProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(null);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded");
    setSearchBox(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    console.log("Place changed event triggered");
    if (searchBox) {
      try {
        const place = searchBox.getPlace();
        console.log("Place selected:", place);
        
        if (!place.geometry) {
          console.warn("Place returned with no geometry");
          toast({
            variant: "destructive",
            title: "Adresse non trouvée",
            description: "Veuillez sélectionner une adresse dans la liste suggérée"
          });
          return;
        }
        
        if (place.formatted_address && onAddressSelect) {
          console.log("Setting address:", place.formatted_address);
          onAddressSelect(place.formatted_address);
          toast({
            title: "Adresse sélectionnée",
            description: place.formatted_address
          });
        }
        
        if (place.geometry?.location && map) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          
          // Supprimer le marqueur précédent s'il existe
          if (currentMarker) {
            currentMarker.setMap(null);
          }
          
          // Ajouter un nouveau marqueur
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.formatted_address,
            animation: google.maps.Animation.DROP
          });
          
          setCurrentMarker(marker);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection du lieu:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les détails de l'adresse"
        });
      }
    } else {
      console.warn("SearchBox not initialized");
    }
  }, [map, searchBox, currentMarker, onAddressSelect]);

  return (
    <div className="space-y-4">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: 'fr' },
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['address']
        }}
      >
        <Input
          type="text"
          placeholder="Rechercher une adresse..."
          className="w-full"
        />
      </Autocomplete>
      
      <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          zoom={5}
          center={{ lat: 46.603354, lng: 1.888334 }}
          mapContainerClassName="w-full h-full"
          onLoad={(map) => {
            console.log("Map loaded");
            setMap(map);
          }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        />
      </div>
      
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        <span>Sélectionnez une adresse dans le champ de recherche ou saisissez-la manuellement</span>
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
