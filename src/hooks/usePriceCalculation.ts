
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PriceCalculationResult {
  priceHT: string;
  priceTTC: string;
  isPerKm: boolean;
}

export const usePriceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePrice = async (
    distance: number,
    vehicleType: string
  ): Promise<PriceCalculationResult | null> => {
    setIsCalculating(true);
    
    try {
      // Récupérer la grille tarifaire correspondante
      const { data: pricingData, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .eq('vehicle_category', vehicleType)
        .eq('active', true)
        .lte('min_distance', distance)
        .gte('max_distance', distance)
        .maybeSingle();

      if (error || !pricingData) {
        console.log('Aucune grille tarifaire trouvée, utilisation du tarif au km');
        
        // Tarif de base au km si pas de grille trouvée
        const baseRatePerKm = getBaseRatePerKm(vehicleType);
        const priceHT = distance * baseRatePerKm;
        const priceTTC = priceHT * 1.2; // TVA 20%
        
        return {
          priceHT: priceHT.toFixed(2),
          priceTTC: priceTTC.toFixed(2),
          isPerKm: true
        };
      }

      return {
        priceHT: pricingData.price_ht.toFixed(2),
        priceTTC: pricingData.price_ttc.toFixed(2),
        isPerKm: pricingData.type_tarif === 'per_km'
      };
      
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      toast.error('Erreur lors du calcul du prix');
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculatePrice,
    isCalculating
  };
};

// Tarifs de base au km par type de véhicule
const getBaseRatePerKm = (vehicleType: string): number => {
  const rates: Record<string, number> = {
    'berline': 0.73,
    'break': 0.75,
    'suv': 0.78,
    'utilitaire': 0.80,
    'premium': 0.85
  };
  
  return rates[vehicleType] || 0.73;
};
