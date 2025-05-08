
import { getDistanceRangeId } from '@/utils/priceCalculations';

/**
 * Mapping of frontend vehicle type IDs to the database vehicle_category values
 */
export const vehicleTypeToCategory = {
  'citadine': 'citadine',
  'berline': 'berline', 
  'suv': '4x4_suv',
  'utilitaire-3-5': 'utilitaire_3_5m3',
  'utilitaire-6-12': 'utilitaire_6_12m3',
  'utilitaire-12-15': 'utilitaire_12_15m3',
  'utilitaire-15-20': 'utilitaire_15_20m3',
  'utilitaire-20-plus': 'utilitaire_plus_20m3'
};

/**
 * Table de prix réels pour chaque catégorie de véhicule et tranche de distance
 */
const priceTable = {
  // Prix forfaitaires pour distances ≤ 100km
  fixedPrices: {
    'citadine': {
      '1-10': 79, 
      '11-20': 85, 
      '21-30': 90, 
      '31-40': 95, 
      '41-50': 100, 
      '51-60': 105, 
      '61-70': 112, 
      '71-80': 117, 
      '81-90': 122, 
      '91-100': 127
    },
    'berline': {
      '1-10': 95, 
      '11-20': 102, 
      '21-30': 108, 
      '31-40': 114, 
      '41-50': 120, 
      '51-60': 126, 
      '61-70': 134, 
      '71-80': 140, 
      '81-90': 146, 
      '91-100': 152
    },
    '4x4_suv': {
      '1-10': 103, 
      '11-20': 111, 
      '21-30': 117, 
      '31-40': 124, 
      '41-50': 130, 
      '51-60': 137, 
      '61-70': 146, 
      '71-80': 152, 
      '81-90': 159, 
      '91-100': 165
    },
    'utilitaire_3_5m3': {
      '1-10': 107, 
      '11-20': 115, 
      '21-30': 122, 
      '31-40': 128, 
      '41-50': 135, 
      '51-60': 142, 
      '61-70': 151, 
      '71-80': 158, 
      '81-90': 165, 
      '91-100': 171
    },
    'utilitaire_6_12m3': {
      '1-10': 111, 
      '11-20': 119, 
      '21-30': 126, 
      '31-40': 133, 
      '41-50': 140, 
      '51-60': 147, 
      '61-70': 157, 
      '71-80': 164, 
      '81-90': 171, 
      '91-100': 178
    },
    'utilitaire_12_15m3': {
      '1-10': 119, 
      '11-20': 128, 
      '21-30': 135, 
      '31-40': 143, 
      '41-50': 150, 
      '51-60': 158, 
      '61-70': 168, 
      '71-80': 176, 
      '81-90': 183, 
      '91-100': 191
    },
    'utilitaire_15_20m3': {
      '1-10': 134, 
      '11-20': 145, 
      '21-30': 153, 
      '31-40': 162, 
      '41-50': 170, 
      '51-60': 179, 
      '61-70': 190, 
      '71-80': 199, 
      '81-90': 207, 
      '91-100': 216
    },
    'utilitaire_plus_20m3': {
      '1-10': 150, 
      '11-20': 162, 
      '21-30': 171, 
      '31-40': 181, 
      '41-50': 190, 
      '51-60': 200, 
      '61-70': 213, 
      '71-80': 223, 
      '81-90': 232, 
      '91-100': 241
    }
  },
  // Prix au km pour distances > 100km (€/km)
  perKmPrices: {
    'citadine': {
      '101-200': 1.28, 
      '201-300': 1.14, 
      '301-400': 1.09, 
      '401-500': 1.02, 
      '501-600': 0.98, 
      '601-700': 0.94, 
      '701+': 0.92
    },
    'berline': {
      '101-200': 1.54, 
      '201-300': 1.37, 
      '301-400': 1.31, 
      '401-500': 1.22, 
      '501-600': 1.18, 
      '601-700': 1.13, 
      '701+': 1.10
    },
    '4x4_suv': {
      '101-200': 1.66, 
      '201-300': 1.48, 
      '301-400': 1.42, 
      '401-500': 1.33, 
      '501-600': 1.27, 
      '601-700': 1.22, 
      '701+': 1.20
    },
    'utilitaire_3_5m3': {
      '101-200': 1.73, 
      '201-300': 1.54, 
      '301-400': 1.47, 
      '401-500': 1.38, 
      '501-600': 1.32, 
      '601-700': 1.27, 
      '701+': 1.24
    },
    'utilitaire_6_12m3': {
      '101-200': 1.79, 
      '201-300': 1.60, 
      '301-400': 1.53, 
      '401-500': 1.43, 
      '501-600': 1.37, 
      '601-700': 1.32, 
      '701+': 1.29
    },
    'utilitaire_12_15m3': {
      '101-200': 1.92, 
      '201-300': 1.71, 
      '301-400': 1.64, 
      '401-500': 1.53, 
      '501-600': 1.47, 
      '601-700': 1.41, 
      '701+': 1.38
    },
    'utilitaire_15_20m3': {
      '101-200': 2.18, 
      '201-300': 1.94, 
      '301-400': 1.85, 
      '401-500': 1.73, 
      '501-600': 1.67, 
      '601-700': 1.60, 
      '701+': 1.56
    },
    'utilitaire_plus_20m3': {
      '101-200': 2.43, 
      '201-300': 2.17, 
      '301-400': 2.07, 
      '401-500': 1.94, 
      '501-600': 1.86, 
      '601-700': 1.79, 
      '701+': 1.75
    }
  }
};

/**
 * Récupère le prix pour un type de véhicule et une distance donnée
 * depuis la grille tarifaire locale
 */
export const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
  try {
    // Convert frontend ID to database category
    const vehicleCategory = vehicleTypeToCategory[vehicleTypeId as keyof typeof vehicleTypeToCategory] || vehicleTypeId;
    
    // Determine distance range
    const rangeId = getDistanceRangeId(distance);
    console.log(`Getting price for vehicle category: ${vehicleCategory}, distance: ${distance}km (range: ${rangeId})`);
    
    // Simulate a database call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return price based on vehicle type and distance
    return calculatePriceFromVehicleAndRange(vehicleCategory, rangeId, distance);
  } catch (error) {
    console.error('Error in pricing service:', error);
    // Return default price in case of error
    return {
      priceHT: distance * 1.5,
      isPerKm: true
    };
  }
};

/**
 * Calcule le prix en fonction du type de véhicule et de la tranche de distance
 */
const calculatePriceFromVehicleAndRange = (vehicleCategory: string, rangeId: string, distance: number) => {
  let finalPriceHT = 0;
  let isPerKm = false;
  
  // Vérifier si c'est une tranche avec prix forfaitaire (≤ 100km)
  if (parseInt(rangeId.split('-')[0]) <= 100) {
    const priceRanges = priceTable.fixedPrices[vehicleCategory as keyof typeof priceTable.fixedPrices];
    if (priceRanges && priceRanges[rangeId as keyof typeof priceRanges]) {
      finalPriceHT = priceRanges[rangeId as keyof typeof priceRanges] / 1.2; // Diviser par 1.2 pour obtenir le prix HT (nos prix sont TTC dans la table)
      isPerKm = false;
      console.log(`Prix forfaitaire trouvé: ${finalPriceHT} € HT (tranche ${rangeId})`);
    }
  } 
  // Sinon c'est une tranche avec prix au km (> 100km)
  else {
    const priceRanges = priceTable.perKmPrices[vehicleCategory as keyof typeof priceTable.perKmPrices];
    if (priceRanges && priceRanges[rangeId as keyof typeof priceRanges]) {
      const pricePerKm = priceRanges[rangeId as keyof typeof priceRanges] / 1.2; // Diviser par 1.2 pour obtenir le prix HT (nos prix sont TTC dans la table)
      finalPriceHT = pricePerKm;
      isPerKm = true;
      console.log(`Prix au km trouvé: ${finalPriceHT} € HT par km (tranche ${rangeId})`);
    }
  }
  
  // Si aucun prix trouvé, utiliser un prix par défaut
  if (finalPriceHT === 0) {
    console.warn(`Aucun prix trouvé pour ${vehicleCategory} dans la tranche ${rangeId}`);
    finalPriceHT = 1.25; // Prix par défaut au km
    isPerKm = true;
  }
  
  console.log(`Prix final: ${finalPriceHT} € HT, isPerKm: ${isPerKm}`);
  
  return {
    priceHT: finalPriceHT,
    isPerKm
  };
};

/**
 * Functions needed by admin components (not used in public flows)
 * but must be available for the application to compile
 */
export const fetchPriceGrids = async () => [];
export const initializeDefaultPriceGrids = async () => [];
export const updatePriceInDB = async () => {};
