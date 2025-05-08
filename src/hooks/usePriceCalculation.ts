
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateTTC, formatPrice } from '@/utils/priceCalculations';
import { toast } from 'sonner';

export const usePriceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculer le prix en fonction du type de véhicule et de la distance
  const calculatePrice = async (vehicleType: string, distance: number) => {
    setIsCalculating(true);
    try {
      console.log(`Calculer le prix pour véhicule ${vehicleType} et distance ${distance}km`);
      
      // Trouver la tranche de prix correspondante dans la table pricing_grids_public
      const { data: priceData, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .eq('vehicle_category', vehicleType)
        .lte('min_distance', distance)
        .gte('max_distance', distance)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        toast.error('Erreur lors de la récupération du prix');
        return null;
      }
      
      if (!priceData) {
        console.warn(`Aucun prix trouvé pour le véhicule ${vehicleType} à la distance ${distance}`);
        toast.error('Aucun tarif trouvé pour cette combinaison de véhicule et distance');
        return null;
      }
      
      console.log('Données de prix trouvées:', priceData);
      
      let finalPriceHT: number;
      
      // Déterminer si le prix est par km (type_tarif = "km") ou forfaitaire (type_tarif = "forfait")
      if (priceData.type_tarif === 'km') {
        finalPriceHT = priceData.price_ht * distance;
        console.log(`Prix au km: ${priceData.price_ht} € × ${distance} km = ${finalPriceHT} €`);
      } else {
        finalPriceHT = priceData.price_ht;
        console.log(`Prix forfaitaire: ${finalPriceHT} €`);
      }
      
      // Formater le prix HT avec 2 décimales
      const formattedPriceHT = formatPrice(finalPriceHT);
      
      // Calculer le prix TTC (TVA 20%)
      const priceTTC = calculateTTC(formattedPriceHT);
      
      console.log(`Prix calculé: HT=${formattedPriceHT}€, TTC=${priceTTC}€, type=${priceData.type_tarif}`);
      
      return {
        priceHT: formattedPriceHT,
        priceTTC: priceTTC,
        isPerKm: priceData.type_tarif === 'km'
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
