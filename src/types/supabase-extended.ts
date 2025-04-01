
import { Database } from "@/integrations/supabase/types";

// Extend the Database type with our new tables
export interface ExtendedDatabase extends Database {
  public: {
    Tables: {
      // Include all existing tables from Database type
      documents: Database['public']['Tables']['documents'];
      users: Database['public']['Tables']['users'];
      mission_documents: Database['public']['Tables']['mission_documents'];
      missions: Database['public']['Tables']['missions'];
      price_grids: Database['public']['Tables']['price_grids'];
      user_profiles: Database['public']['Tables']['user_profiles'];
      
      // Add our contacts table with the correct schema matching the database
      contacts: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          type: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          type: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          type?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      
      // Add our new tables with the correct types that match the generated types
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          mission_id: string | null;  // Changed to match Database structure (non-optional but nullable)
          read: boolean | null;       // Changed to match Database structure
          created_at: string | null;  // Changed to match Database structure
          updated_at: string | null;  // Changed to match Database structure
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          mission_id?: string | null;
          read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          type?: string;
          mission_id?: string | null;
          read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "missions";
            referencedColumns: ["id"];
          }
        ];
      };
      
      invoices: {
        Row: {
          id: string;
          mission_id: string;
          client_id: string;
          invoice_number: string;
          price_ht: number;
          price_ttc: number;
          created_at: string | null;  // Changed to match Database structure
          paid: boolean | null;       // Changed to match Database structure
          issued_date: string | null; // Changed to match Database structure
        };
        Insert: {
          id?: string;
          mission_id: string;
          client_id: string;
          invoice_number: string;
          price_ht: number;
          price_ttc: number;
          created_at?: string | null;
          paid?: boolean | null;
          issued_date?: string | null;
        };
        Update: {
          id?: string;
          mission_id?: string;
          client_id?: string;
          invoice_number?: string;
          price_ht?: number;
          price_ttc?: number;
          created_at?: string | null;
          paid?: boolean | null;
          issued_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "missions";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  };
}

// Create an extended supabase client type
export type ExtendedSupabaseClient = ReturnType<typeof createExtendedClient>;

// Helper function to create a properly typed client
import { createClient } from '@supabase/supabase-js';
export const createExtendedClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
  return createClient<ExtendedDatabase>(supabaseUrl, supabaseKey);
};

// Type-safe way to handle Supabase responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type DbResultErr = { error: Error };
