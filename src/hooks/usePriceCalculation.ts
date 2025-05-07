
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, getDistanceRangeId } from '@/utils/priceCalculations';
import { toast } from 'sonner';

export const usePriceCalculation = () => {
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Calcule le prix en fonction du type de véhicule et de la distance
   * Version utilisant la table pricing_grids_public
   */
  const calculatePrice = async (vehicleType: string, distance: number) => {
    try {
      setIsCalculating(true);
      console.log(`Calculer le prix pour ${vehicleType} sur ${distance} km`);
      
      // Déterminer la tranche de distance
      const rangeId = getDistanceRangeId(distance);
      console.log(`Tranche de distance identifiée: ${rangeId}`);
      
      // Récupération du prix depuis Supabase
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('price_ht, type_tarif')
        .eq('vehicle_category', vehicleType)
        .is('min_distance', null) // Pour les tarifs fixes
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        
        // Prix par défaut si erreur
        const defaultPricePerKm = 1.0;
        const finalPriceHT = defaultPricePerKm * distance + 20; // 20€ de forfait de base
        const finalPriceTTC = finalPriceHT * 1.2;
        
        console.log(`Prix par défaut calculé: ${finalPriceHT}€ HT, ${finalPriceTTC}€ TTC`);
        
        setPriceHT(formatPrice(finalPriceHT));
        setPriceTTC(formatPrice(finalPriceTTC));
        
        return {
          priceHT: formatPrice(finalPriceHT),
          priceTTC: formatPrice(finalPriceTTC),
          isPerKm: true
        };
      }
      
      if (!data) {
        console.warn(`Aucun prix trouvé pour ${vehicleType}, utilisation du prix par défaut`);
        
        // Prix par défaut
        const defaultPricePerKm = 1.0;
        const finalPriceHT = defaultPricePerKm * distance + 20; // 20€ de forfait de base
        const finalPriceTTC = finalPriceHT * 1.2;
        
        console.log(`Prix par défaut calculé: ${finalPriceHT}€ HT, ${finalPriceTTC}€ TTC`);
        
        setPriceHT(formatPrice(finalPriceHT));
        setPriceTTC(formatPrice(finalPriceTTC));
        
        return {
          priceHT: formatPrice(finalPriceHT),
          priceTTC: formatPrice(finalPriceTTC),
          isPerKm: true
        };
      }
      
      // Calcul du prix final
      let finalPriceHT: number;
      const isPerKm = data.type_tarif === 'au_km';
      
      if (isPerKm) {
        finalPriceHT = data.price_ht * distance;
        console.log(`Calcul par km: ${data.price_ht} € x ${distance} km = ${finalPriceHT} €`);
      } else {
        finalPriceHT = data.price_ht;
        console.log(`Prix forfaitaire: ${finalPriceHT} €`);
      }
      
      // Ajoute un forfait de base pour les courtes distances si prix au km
      if (isPerKm && distance < 100) {
        finalPriceHT += 20;
        console.log(`Ajout d'un forfait de base de 20€, prix total: ${finalPriceHT} €`);
      }
      
      // Calcul du prix TTC
      const finalPriceTTC = finalPriceHT * 1.2;
      
      console.log(`Prix calculé: ${finalPriceHT}€ HT, ${finalPriceTTC}€ TTC`);
      
      setPriceHT(formatPrice(finalPriceHT));
      setPriceTTC(formatPrice(finalPriceTTC));
      
      return {
        priceHT: formatPrice(finalPriceHT),
        priceTTC: formatPrice(finalPriceTTC),
        isPerKm
      };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      toast.error('Erreur lors du calcul du prix. Un prix par défaut sera utilisé.');
      
      // Prix par défaut en cas d'erreur
      const defaultPrice = distance * 1.2 + 20;
      
      setPriceHT(formatPrice(defaultPrice));
      setPriceTTC(formatPrice(defaultPrice * 1.2));
      
      return {
        priceHT: formatPrice(defaultPrice),
        priceTTC: formatPrice(defaultPrice * 1.2),
        isPerKm: true
      };
    } finally {
      setIsCalculating(false);
    }
  };
  
  return { 
    calculatePrice,
    isCalculating,
    priceHT,
    priceTTC
  };
};
