
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updatePricingGridsFromTables } from '@/utils/priceCalculator';
import { Loader } from 'lucide-react';

const UpdatePriceGridsButton = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePriceGrids = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const result = await updatePricingGridsFromTables();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        console.error('Error details:', result.error);
      }
    } catch (error) {
      console.error('Error updating price grids:', error);
      toast.error('Erreur lors de la mise à jour des grilles tarifaires');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdatePriceGrids}
      disabled={isUpdating}
      variant="outline"
      className="gap-2"
    >
      {isUpdating ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Mise à jour en cours...
        </>
      ) : (
        'Mettre à jour les grilles à partir des tableaux'
      )}
    </Button>
  );
};

export default UpdatePriceGridsButton;
