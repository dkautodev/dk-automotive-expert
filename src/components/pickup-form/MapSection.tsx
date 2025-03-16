
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.formatted_address && onAddressSelect) {
        onAddressSelect(place.formatted_address);
      }
      if (place.geometry?.location && map) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-[300px] bg-red-50 flex items-center justify-center rounded-lg text-red-500">
        Erreur de chargement de Google Maps
      </div>
    );
  }

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
