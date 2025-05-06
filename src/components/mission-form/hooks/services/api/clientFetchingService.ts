
import { ClientData, NewClientData } from "../../types/clientTypes";
import { supabase } from '@/services/mockSupabaseClient';

// Mock helper function to replace supabase-helper
const processSupabaseResult = <T>(data: T[] | null, error: any) => {
  if (error) {
    console.error("Supabase error:", error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export const fetchClientsFromApi = async (): Promise<{ clients: ClientData[], error: string | null }> => {
  try {
    console.log("Mock: Fetching clients from API");
    
    // Return mock data
    const mockClients: ClientData[] = [
      {
        id: "c1",
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@example.com",
        phone: "+33123456789",
        company_name: "Dupont SAS",
        created_at: new Date().toISOString(),
        client_code: "CL001"
      },
      {
        id: "c2",
        first_name: "Marie",
        last_name: "Martin",
        email: "marie.martin@example.com",
        phone: "+33987654321",
        company_name: "Martin Enterprise",
        created_at: new Date().toISOString(),
        client_code: "CL002"
      }
    ];
    
    return { clients: mockClients, error: null };
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return { clients: [], error: error.message };
  }
};
