import { calculateTTC } from './priceCalculations';
import { getPriceForVehicleAndDistance } from '@/services/pricingGridsService';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    const selectedPrice = await getPriceForVehicleAndDistance(vehicleTypeId, distance);
    
    if (!selectedPrice) {
      return {
        priceHT: "0.00",
        priceTTC: "0.00",
        isPerKm: false,
        error: "Prix non trouvé"
      };
    }
    
    const priceHTString = selectedPrice.priceHT.toString();
    
    return {
      priceHT: priceHTString,
      priceTTC: calculateTTC(priceHTString),
      isPerKm: selectedPrice.isPerKm
    };
  } catch (error: any) {
    console.error('Erreur lors du calcul du prix:', error);
    return {
      priceHT: "0.00",
      priceTTC: "0.00",
      isPerKm: false,
      error: error.message
    };
  }
};

/**
 * Script pour mettre à jour les grilles tarifaires avec les valeurs des images
 */
export const updatePricingGridsFromTables = async () => {
  try {
    // Import dynamiquement pour éviter les dépendances circulaires
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Définir l'ordre correct des tranches kilométriques
    const distanceRanges = [
      { id: '1-10', label: '1 - 10', isPerKm: false },
      { id: '11-20', label: '11 - 20', isPerKm: false },
      { id: '21-30', label: '21 - 30', isPerKm: false },
      { id: '31-40', label: '31 - 40', isPerKm: false },
      { id: '41-50', label: '41 - 50', isPerKm: false },
      { id: '51-60', label: '51 - 60', isPerKm: false },
      { id: '61-70', label: '61 - 70', isPerKm: false },
      { id: '71-80', label: '71 - 80', isPerKm: false },
      { id: '81-90', label: '81 - 90', isPerKm: false },
      { id: '91-100', label: '91 - 100', isPerKm: false },
      { id: '101-200', label: '101 - 200', isPerKm: true },
      { id: '201-300', label: '201 - 300', isPerKm: true },
      { id: '301-400', label: '301 - 400', isPerKm: true },
      { id: '401-500', label: '401 - 500', isPerKm: true },
      { id: '501-600', label: '501 - 600', isPerKm: true },
      { id: '601-700', label: '601 - 700', isPerKm: true },
      { id: '701+', label: '+ de 701', isPerKm: true },
    ];
    
    // Définir les prix HT (les prix dans les tableaux sont TTC, donc on les divise par 1.2)
    const vehicles = [
      {
        id: 'citadine',
        name: 'Citadine',
        prices: [
          { rangeId: '1-10', priceHT: (79 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (85 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (90 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (95 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (100 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (105 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (112 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (117 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (122 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (127 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.28 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.14 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.09 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.02 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (0.98 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (0.94 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (0.92 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'berline',
        name: 'Berline',
        prices: [
          { rangeId: '1-10', priceHT: (79 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (85 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (90 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (95 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (100 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (105 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (112 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (117 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (122 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (127 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.28 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.14 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.09 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.02 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (0.98 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (0.94 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (0.92 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'suv',
        name: '4x4 (ou SUV)',
        prices: [
          { rangeId: '1-10', priceHT: (84 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (89 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (94 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (99 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (104 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (109 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (114 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (119 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (124 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (131 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.32 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.18 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.13 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.06 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (1.02 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (0.98 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (0.96 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'utilitaire-6-12',
        name: 'Utilitaire 6-12m3',
        prices: [
          { rangeId: '1-10', priceHT: (85 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (90 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (95 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (100 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (105 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (110 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (115 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (120 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (125 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (132 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.33 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.19 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.14 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.07 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (1.03 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (0.99 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (0.97 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'utilitaire-12-15',
        name: 'Utilitaire 12-15m3',
        prices: [
          { rangeId: '1-10', priceHT: (90 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (95 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (100 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (105 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (110 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (115 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (119 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (124 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (129 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (134 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.35 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.21 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.16 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.09 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (1.05 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (1.01 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (0.99 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'utilitaire-15-20',
        name: 'Utilitaire 15-20m3',
        prices: [
          { rangeId: '1-10', priceHT: (99 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (104 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (109 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (114 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (119 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (124 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (129 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (134 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (139 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (144 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.45 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.31 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.26 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.19 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (1.15 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (1.11 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (1.09 / 1.2).toFixed(2), isPerKm: true }
        ]
      },
      {
        id: 'utilitaire-20-plus',
        name: 'Utilitaire + de 20m3',
        prices: [
          { rangeId: '1-10', priceHT: (103 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '11-20', priceHT: (108 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '21-30', priceHT: (113 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '31-40', priceHT: (118 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '41-50', priceHT: (123 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '51-60', priceHT: (128 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '61-70', priceHT: (133 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '71-80', priceHT: (138 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '81-90', priceHT: (143 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '91-100', priceHT: (148 / 1.2).toFixed(2), isPerKm: false },
          { rangeId: '101-200', priceHT: (1.49 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '201-300', priceHT: (1.35 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '301-400', priceHT: (1.31 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '401-500', priceHT: (1.23 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '501-600', priceHT: (1.19 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '601-700', priceHT: (1.15 / 1.2).toFixed(2), isPerKm: true },
          { rangeId: '701+', priceHT: (1.13 / 1.2).toFixed(2), isPerKm: true }
        ]
      }
    ];

    // Mettre à jour les prix dans la base de données
    for (const vehicle of vehicles) {
      for (const price of vehicle.prices) {
        // Vérifier si l'entrée existe déjà
        const { data: existingPrice, error: checkError } = await supabase
          .from('price_grids')
          .select('*')
          .eq('vehicle_type_id', vehicle.id)
          .eq('distance_range_id', price.rangeId)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows found
          console.error(`Erreur lors de la vérification pour ${vehicle.id}, range ${price.rangeId}:`, checkError);
          continue;
        }

        // Trouver le label de la tranche dans l'array distanceRanges
        const range = distanceRanges.find(r => r.id === price.rangeId);
        if (!range) {
          console.error(`Tranche de distance ${price.rangeId} non trouvée dans les définitions`);
          continue;
        }
        
        if (existingPrice) {
          // Mettre à jour l'entrée existante
          const { error } = await supabase
            .from('price_grids')
            .update({ 
              price_ht: parseFloat(price.priceHT),
              is_per_km: price.isPerKm,
              vehicle_type_name: vehicle.name,
              distance_range_label: range.label
            })
            .eq('id', existingPrice.id);
          
          if (error) {
            console.error(`Erreur lors de la mise à jour pour ${vehicle.id}, range ${price.rangeId}:`, error);
          }
        } else {
          // Créer une nouvelle entrée
          const { error } = await supabase
            .from('price_grids')
            .insert({ 
              vehicle_type_id: vehicle.id,
              vehicle_type_name: vehicle.name,
              distance_range_id: price.rangeId,
              distance_range_label: range.label,
              price_ht: parseFloat(price.priceHT),
              is_per_km: price.isPerKm
            });
          
          if (error) {
            console.error(`Erreur lors de l'insertion pour ${vehicle.id}, range ${price.rangeId}:`, error);
          }
        }
      }
      console.log(`Grille tarifaire mise à jour pour ${vehicle.name}`);
    }
    
    return { success: true, message: 'Toutes les grilles tarifaires ont été mises à jour avec succès' };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des grilles tarifaires:', error);
    return { success: false, message: 'Erreur lors de la mise à jour des grilles tarifaires', error };
  }
};
