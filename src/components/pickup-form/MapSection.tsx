
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGoogleMapsLoader } from './hooks/useGoogleMapsLoader';
import MapErrorDisplay from './components/MapErrorDisplay';
import GoogleMapDisplay from './components/GoogleMapDisplay';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  const [manualAddress, setManualAddress] = useState<string>("");
  const { isLoaded, loadError, projectId, parseGoogleMapsError, detailedError } = useGoogleMapsLoader();

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

  // Show loading state
  if (!isLoaded && !loadError) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        Chargement de la carte...
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <MapErrorDisplay
        error={loadError}
        projectId={projectId}
        parseGoogleMapsError={parseGoogleMapsError}
        manualAddress={manualAddress}
        setManualAddress={setManualAddress}
        onManualAddressSubmit={handleManualAddressSubmit}
        detailedError={detailedError}
      />
    );
  }

  // Show map
  return <GoogleMapDisplay onAddressSelect={onAddressSelect} />;
};

export default MapSection;
