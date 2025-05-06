import { Database } from "@/integrations/supabase/types";
import { createClient } from '@supabase/supabase-js';

// Extend the Database type with our new tables
export interface ExtendedDatabase {
  public: {
    Tables: {
      // Include all existing tables from Database type
      clients: Database['public']['Tables']['clients'];
      contacts: Database['public']['Tables']['contacts'];
      documents: Database['public']['Tables']['documents'];
      google_maps_settings: Database['public']['Tables']['google_maps_settings'];
      invoices: Database['public']['Tables']['invoices'];
      mission_attachments: Database['public']['Tables']['mission_attachments'];
      mission_documents: Database['public']['Tables']['mission_documents'];
      missions: Database['public']['Tables']['missions'];
      missions_status_history: Database['public']['Tables']['missions_status_history'];
      notifications: Database['public']['Tables']['notifications'];
      price_grids: Database['public']['Tables']['price_grids'];
      price_grids_history: Database['public']['Tables']['price_grids_history'];
      user_profiles: Database['public']['Tables']['user_profiles'];
      users: Database['public']['Tables']['users'];
      vat_settings: Database['public']['Tables']['vat_settings'];
      vehicles: Database['public']['Tables']['vehicles'];
      
      // Add our new unified tables with the correct schema
      unified_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          phone: string | null;
          profile_picture: string | null;
          client_code: string | null;
          siret_number: string | null;
          vat_number: string | null;
          billing_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          profile_picture?: string | null;
          client_code?: string | null;
          siret_number?: string | null;
          vat_number?: string | null;
          billing_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          profile_picture?: string | null;
          client_code?: string | null;
          siret_number?: string | null;
          vat_number?: string | null;
          billing_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      
      unified_missions: {
        Row: {
          id: string;
          client_id: string;
          driver_id: string | null;
          admin_id: string | null;
          status: string;
          mission_number: string;
          mission_type: string;
          pickup_address: string | null;
          delivery_address: string | null;
          distance: number | null;
          price_ht: number | null;
          price_ttc: number | null;
          vehicle_info: any | null;
          pickup_date: string | null;
          delivery_date: string | null;
          pickup_contact: any | null;
          delivery_contact: any | null;
          additional_info: string | null;
          street_number: string | null;
          postal_code: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          driver_id?: string | null;
          admin_id?: string | null;
          status?: string;
          mission_number?: string;
          mission_type?: string;
          pickup_address?: string | null;
          delivery_address?: string | null;
          distance?: number | null;
          price_ht?: number | null;
          price_ttc?: number | null;
          vehicle_info?: any | null;
          pickup_date?: string | null;
          delivery_date?: string | null;
          pickup_contact?: any | null;
          delivery_contact?: any | null;
          additional_info?: string | null;
          street_number?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          driver_id?: string | null;
          admin_id?: string | null;
          status?: string;
          mission_number?: string;
          mission_type?: string;
          pickup_address?: string | null;
          delivery_address?: string | null;
          distance?: number | null;
          price_ht?: number | null;
          price_ttc?: number | null;
          vehicle_info?: any | null;
          pickup_date?: string | null;
          delivery_date?: string | null;
          pickup_contact?: any | null;
          delivery_contact?: any | null;
          additional_info?: string | null;
          street_number?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unified_missions_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unified_missions_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unified_missions_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          }
        ];
      };

      unified_documents: {
        Row: {
          id: string;
          user_id: string | null;
          document_type: string;
          document_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          document_type: string;
          document_url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          document_type?: string;
          document_url?: string;
          uploaded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unified_documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          }
        ];
      };

      unified_mission_attachments: {
        Row: {
          id: string;
          mission_id: string | null;
          file_name: string;
          file_path: string;
          file_type: string | null;
          file_size: number | null;
          uploaded_by: string;
          storage_provider: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id?: string | null;
          file_name: string;
          file_path: string;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by: string;
          storage_provider?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mission_id?: string | null;
          file_name?: string;
          file_path?: string;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by?: string;
          storage_provider?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unified_mission_attachments_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "unified_missions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unified_mission_attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          }
        ];
      };

      unified_invoices: {
        Row: {
          id: string;
          mission_id: string;
          client_id: string;
          invoice_number: string;
          price_ht: number;
          price_ttc: number;
          paid: boolean;
          issued_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          client_id: string;
          invoice_number: string;
          price_ht: number;
          price_ttc: number;
          paid?: boolean;
          issued_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          mission_id?: string;
          client_id?: string;
          invoice_number?: string;
          price_ht?: number;
          price_ttc?: number;
          paid?: boolean;
          issued_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unified_invoices_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "unified_missions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unified_invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          }
        ];
      };

      unified_price_grids: {
        Row: {
          id: string;
          vehicle_type_id: string;
          vehicle_type_name: string;
          distance_range_id: string;
          distance_range_label: string;
          price_ht: number;
          is_per_km: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_type_id: string;
          vehicle_type_name: string;
          distance_range_id: string;
          distance_range_label: string;
          price_ht: number;
          is_per_km?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_type_id?: string;
          vehicle_type_name?: string;
          distance_range_id?: string;
          distance_range_label?: string;
          price_ht?: number;
          is_per_km?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      unified_contacts: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          type: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          company: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          type: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          company?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          type?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          company?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "unified_contacts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          }
        ];
      };

      unified_notifications: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string | null;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mission_id?: string | null;
          message: string;
          type: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mission_id?: string | null;
          message?: string;
          type?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unified_notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "unified_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unified_notifications_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "unified_missions";
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

// Import the existing supabase client from our client.ts file
import { supabase } from "@/integrations/supabase/client";

// Cast the existing supabase client to our extended type
// This is a workaround until we can regenerate the proper types
export const extendedSupabase = supabase as unknown as ReturnType<typeof createExtendedClient>;

// Helper function to create a properly typed client (not used directly, just for type inference)
function createExtendedClient() {
  const supabaseUrl = "https://example.com"; // Dummy values, just used for typing
  const supabaseKey = "dummy";
  return createClient<ExtendedDatabase>(supabaseUrl, supabaseKey);
}
