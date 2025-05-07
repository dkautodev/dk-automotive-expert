
/**
 * Mock Supabase client pour remplacer les dépendances à Supabase
 * Utilisé uniquement pour les fonctionnalités publiques du site
 */

import { getPriceForVehicleAndDistance } from './pricing/localPricingGridsService';

// Définition des types de base pour le client mocké
interface MockSupabaseAuthResponse {
  data: {
    user: any | null;
    session: any | null;
  } | null;
  error: Error | null;
}

// Client mocké pour les fonctionnalités d'authentification
const mockAuth = {
  signUp: async (): Promise<MockSupabaseAuthResponse> => {
    console.log("Mock: SignUp appelé");
    return { data: { user: null, session: null }, error: null };
  },
  signIn: async (): Promise<MockSupabaseAuthResponse> => {
    console.log("Mock: SignIn appelé");
    return { data: { user: null, session: null }, error: null };
  },
  signOut: async (): Promise<{ error: Error | null }> => {
    console.log("Mock: SignOut appelé");
    return { error: null };
  },
  resetPasswordForEmail: async (): Promise<{ error: Error | null }> => {
    console.log("Mock: resetPasswordForEmail appelé");
    return { error: null };
  },
  updateUser: async (): Promise<MockSupabaseAuthResponse> => {
    console.log("Mock: updateUser appelé");
    return { data: { user: null, session: null }, error: null };
  }
};

// Tables mockées avec des données
const mockTables = {
  'pricing_grids_public': {
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          single: async () => {
            if (column === 'vehicle_type_id' && column2 === 'distance_range_id') {
              // Utiliser le service local pour obtenir les données
              const result = await getPriceForVehicleAndDistance(value, 100); // Distance fictive
              return { 
                data: {
                  price_ht: result.priceHT, 
                  is_per_km: result.isPerKm 
                }, 
                error: null 
              };
            }
            return { data: null, error: null };
          }
        })
      })
    })
  }
};

// Client Supabase mocké
export const supabase = {
  auth: mockAuth,
  storage: {
    from: (bucket: string) => ({
      list: async () => ({ data: [], error: null }),
      download: async () => ({ data: new Blob(), error: null }),
      upload: async () => ({ data: { path: '' }, error: null })
    })
  },
  from: (table: string) => {
    // Si la table existe dans notre mock
    if (table in mockTables) {
      return mockTables[table as keyof typeof mockTables];
    }
    
    // Sinon, retourner le comportement générique
    return {
      select: () => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          order: () => ({
            limit: () => ({
              then: async () => ({ data: [], error: null })
            })
          })
        }),
        eq: (column: string, value: any) => ({
          eq: (column2: string, value2: any) => ({
            single: async () => ({ data: null, error: null })
          })
        })
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      upsert: async () => ({ data: null, error: null })
    };
  },
  rpc: (func: string, params: any) => ({
    single: async () => ({ data: null, error: null })
  }),
  functions: {
    invoke: async (name: string, options?: { body?: any }) => ({ data: null, error: null })
  }
};

// Version étendue avec des fonctionnalités supplémentaires pour le mock
export const extendedSupabase = {
  ...supabase,
  // Ajoutez ici des fonctionnalités spécifiques au besoin
};

export default supabase;
