
import { useState } from 'react';
import { externalSupabase } from '@/lib/externalSupabase';
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

      // Fetch toutes les grilles actives pour cette catégorie
      const { data: pricingGrids, error } = await externalSupabase
        .from('pricing_grids')
        .select('*')
        .eq('vehicle_category', vehicleType)
        .eq('active', true);

      // Trouver la bonne tranche côté client avec conversion explicite en Number
      const pricingData = pricingGrids?.find(row => {
        const min = Number(row.min_distance) || 0;
        const max = Number(row.max_distance) || 999999;
        return distance >= min && distance <= max;
      });

      // Affichage debug
      console.log('[CALCUL PRIX] Résultat filtrage local:', pricingData, 'Erreur base:', error);

      // Si pas de grille trouvée => taux par km (fallback)
      if (error || !pricingData) {
        console.log('Aucune tranche tarifaire correspondante trouvée, utilisation du tarif au km');
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
      console.error('Erreur lors du calcul du prix avec la base externe:', error);
      
      // Fallback : utiliser le système de calcul local
      console.log('Fallback vers le calcul local');
      const baseRatePerKm = getBaseRatePerKm(vehicleType);
      const priceHT = distance * baseRatePerKm;
      const priceTTC = priceHT * 1.2;
      
      toast.error('Problème de connexion à la grille tarifaire, calcul avec tarifs de base');
      
      return {
        priceHT: priceHT.toFixed(2),
        priceTTC: priceTTC.toFixed(2),
        isPerKm: true
      };
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculatePrice,
    isCalculating
  };
};

// Tarifs de base fallback au km si la base externe n'est pas disponible
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
