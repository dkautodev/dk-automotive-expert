
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
    
    // Définir les prix HT (les prix dans les tableaux sont TTC, donc on les divise par 1.2)
    const vehicles = [
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
      }
    ];

    // Mettre à jour les prix dans la base de données
    for (const vehicle of vehicles) {
      for (const price of vehicle.prices) {
        const { error } = await supabase
          .from('price_grids')
          .update({ 
            price_ht: parseFloat(price.priceHT),
            is_per_km: price.isPerKm
          })
          .eq('vehicle_type_id', vehicle.id)
          .eq('distance_range_id', price.rangeId);
        
        if (error) {
          console.error(`Erreur lors de la mise à jour du prix pour ${vehicle.id}, range ${price.rangeId}:`, error);
          throw error;
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
