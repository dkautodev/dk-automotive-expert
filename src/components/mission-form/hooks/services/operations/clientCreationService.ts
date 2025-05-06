
import { supabase } from "@/integrations/supabase/client";
import { NewClientData, ClientData } from "../../types/clientTypes";
import { toast } from "sonner";
import { safeTable, safeArrayData, safeFirstItem } from "@/utils/supabase-helper";

/**
 * Service for creating and managing clients
 */
export const clientCreationService = {
  /**
   * Create a new client in the database
   * @param clientData The data for the new client
   * @returns The created client data or null if creation failed
   */
  createClient: async (clientData: NewClientData): Promise<ClientData | null> => {
    try {
      console.log("Creating new client with data:", clientData);
      
      // Validate required fields
      if (!clientData.email) {
        throw new Error("Email is required");
      }
      
      // Check if the client already exists with this email
      const existingUserResponse = await safeTable("unified_users")
        .select("*")
        .eq("email", clientData.email)
        .eq("role", "client");

      const existingUsers = safeArrayData(existingUserResponse, []);
      const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;
      
      if (existingUser) {
        console.log("Client already exists:", existingUser);
        
        // Return the existing client
        return {
          id: existingUser.id,
          name: `${existingUser.first_name || ''} ${existingUser.last_name || ''}`.trim() || existingUser.email,
          email: existingUser.email,
          phone: existingUser.phone || undefined,
          company: existingUser.company_name || undefined,
          first_name: existingUser.first_name || undefined,
          last_name: existingUser.last_name || undefined
        };
      }
      
      // Get the current user (to set as the creator)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required to create a client");
      }
      
      // Create the new client
      const insertResult = await safeTable("unified_users")
        .insert({
          email: clientData.email,
          role: "client",
          first_name: clientData.first_name || '',
          last_name: clientData.last_name || '',
          company_name: clientData.company || '',
          phone: clientData.phone || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
        
      const newUsers = safeArrayData(insertResult, []);
      const newUser = newUsers.length > 0 ? newUsers[0] : null;
      
      if (!newUser) {
        throw new Error("Failed to create client");
      }

      console.log("New client created:", newUser);
      toast.success("Client créé avec succès");
      
      return {
        id: newUser.id,
        name: `${newUser.first_name || ''} ${newUser.last_name || ''}`.trim() || newUser.email,
        email: newUser.email,
        phone: newUser.phone || undefined,
        company: newUser.company_name || undefined,
        first_name: newUser.first_name || undefined,
        last_name: newUser.last_name || undefined
      };
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(`Erreur lors de la création du client: ${error.message}`);
      return null;
    }
  },
  
  /**
   * Add a client to the system and return their ID
   */
  addClient: async (clientData: NewClientData): Promise<string | null> => {
    try {
      const client = await clientCreationService.createClient(clientData);
      return client ? client.id : null;
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    }
  }
};
