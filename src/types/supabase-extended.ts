
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
      
      // Add our contacts table
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
      
      // Add our mission_attachments table
      mission_attachments: {
        Row: {
          id: string;
          mission_id: string | null;
          file_name: string;
          file_path: string;
          file_type: string | null;
          file_size: number | null;
          uploaded_by: string;
          created_at: string;
          updated_at: string;
          storage_provider: string | null;
        };
        Insert: {
          id?: string;
          mission_id?: string | null;
          file_name: string;
          file_path: string;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
          storage_provider?: string | null;
        };
        Update: {
          id?: string;
          mission_id?: string | null;
          file_name?: string;
          file_path?: string;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by?: string;
          created_at?: string;
          updated_at?: string;
          storage_provider?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "mission_attachments_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "missions";
            referencedColumns: ["id"];
          }
        ];
      };
      
      // Add our notifications table
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          mission_id: string | null;
          read: boolean | null;
          created_at: string | null;
          updated_at: string | null;
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
      
      // Add our invoices table
      invoices: {
        Row: {
          id: string;
          mission_id: string;
          client_id: string;
          invoice_number: string;
          price_ht: number;
          price_ttc: number;
          created_at: string | null;
          paid: boolean | null;
          issued_date: string | null;
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
