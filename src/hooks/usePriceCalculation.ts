
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
      // Debug : affichage des arguments
      console.log('[CALCUL PRIX] Appel avec: distance', distance, ', vehicleType', vehicleType);

      // Fetch la meilleure grille tarifaire
      const { data: pricingData, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .eq('vehicle_category', vehicleType)
        .eq('active', true)
        .lte('min_distance', distance)
        .gte('max_distance', distance)
        .order('min_distance', { ascending: false })
        .maybeSingle();

      // Affichage debug
      console.log('[CALCUL PRIX] Résultat grille:', pricingData, error);

      // Si pas de grille trouvée => taux par km (fallback)
      if (error || !pricingData) {
        console.log('Aucune grille tarifaire trouvée, utilisation du tarif au km');
        const baseRatePerKm = getBaseRatePerKm(vehicleType);
        const priceHT = distance * baseRatePerKm;
        const priceTTC = priceHT * 1.2;
        return {
          priceHT: priceHT.toFixed(2),
          priceTTC: priceTTC.toFixed(2),
          isPerKm: true
        };
      }

      // Gérer le type de tarif selon la colonne 'type_tarif'
      const typeTarif = (pricingData.type_tarif || '').toLowerCase();
      let priceHT: number;
      let priceTTC: number;
      let isPerKm = false;

      if (typeTarif === 'per_km' || typeTarif === 'km') {
        // Multiplier la valeur de la table par la distance
        priceHT = (Number(pricingData.price_ht) || 0) * distance;
        priceTTC = (Number(pricingData.price_ttc) || 0) * distance;
        isPerKm = true;
        console.log('[CALCUL PRIX] Calcul type KM :', priceHT, priceTTC);
      } else {
        // 'forfait' ou autre -> utiliser directement la valeur de la grille
        priceHT = Number(pricingData.price_ht) || 0;
        priceTTC = Number(pricingData.price_ttc) || 0;
        isPerKm = false;
        console.log('[CALCUL PRIX] Calcul type FORFAIT :', priceHT, priceTTC);
      }

      return {
        priceHT: priceHT.toFixed(2),
        priceTTC: priceTTC.toFixed(2),
        isPerKm: isPerKm
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

// Tarifs de base fallback au km si aucune grille
const getBaseRatePerKm = (vehicleType: string): number => {
  const rates: Record<string, number> = {
    'citadine': 0.73,
    'berline': 0.75,
    'break': 0.75,
    'suv': 0.78,
    '4x4': 0.78,
    'utilitaire_3_5': 0.80,
    'utilitaire_6_12': 0.82,
    'utilitaire_12_15': 0.85,
    'utilitaire_15_20': 0.87,
    'utilitaire_20_plus': 0.89,
    'premium': 0.95
  };

  return rates[vehicleType] || 0.73;
};
