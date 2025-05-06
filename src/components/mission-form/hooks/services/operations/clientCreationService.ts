
import { NewClientData } from "../../types/clientTypes";
import { supabase } from '@/services/mockSupabaseClient';
import { ClientData } from "../../types/clientTypes";

// Mock helper function to replace supabase-helper
const processSupabaseResult = <T>(data: T[] | null, error: any) => {
  if (error) {
    console.error("Supabase error:", error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export const createClient = async (clientData: NewClientData): Promise<{ client: ClientData | null, error: string | null }> => {
  try {
    console.log("Mock: Creating client", clientData);
    
    // Create a mock client with the provided data
    const mockClient: ClientData = {
      id: `c${Math.floor(Math.random() * 1000)}`,
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      email: clientData.email,
      phone: clientData.phone || "",
      company_name: clientData.company_name,
      created_at: new Date().toISOString(),
      client_code: `CL${Math.floor(Math.random() * 1000)}`
    };
    
    return { client: mockClient, error: null };
  } catch (error: any) {
    console.error("Error creating client:", error);
    return { client: null, error: error.message };
  }
};

export const updateClient = async (clientId: string, clientData: Partial<NewClientData>): Promise<{ success: boolean, error: string | null }> => {
  try {
    console.log("Mock: Updating client", { clientId, clientData });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating client:", error);
    return { success: false, error: error.message };
  }
};
