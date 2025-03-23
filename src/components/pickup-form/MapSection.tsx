
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Emplacement</h3>
      </div>
      
      <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
        <p className="text-gray-500 text-center">
          La fonctionnalité de carte a été désactivée.
          <br />
          Veuillez saisir l'adresse manuellement.
        </p>
      </div>
    </Card>
  );
};

export default MapSection;
