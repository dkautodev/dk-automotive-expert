export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string
          siret: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address: string
          city: string
          country?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code: string
          siret?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string
          siret?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          first_name: string
          id: number
          is_primary: boolean | null
          last_name: string
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: number
          is_primary?: boolean | null
          last_name: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: number
          is_primary?: boolean | null
          last_name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          mission_id: string | null
          number: string | null
          storage_path: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          mission_id?: string | null
          number?: string | null
          storage_path?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          mission_id?: string | null
          number?: string | null
          storage_path?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      google_maps_settings: {
        Row: {
          api_key: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          api_key: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          api_key?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          chauffeur_id: string | null
          client_id: string | null
          contact_a_id: number | null
          contact_b_id: number | null
          created_at: string | null
          created_by: string | null
          date_delivery: string | null
          date_pickup: string | null
          date_requested: string | null
          delivery_address: string
          delivery_city: string
          delivery_country: string
          delivery_postal_code: string
          distance_km: number | null
          id: string
          notes: string | null
          pickup_address: string
          pickup_city: string
          pickup_country: string
          pickup_postal_code: string
          price_ht: number | null
          price_ttc: number | null
          status: string
          time_delivery: string | null
          time_pickup: string | null
          time_requested: string | null
          updated_at: string | null
          vehicle_id: number | null
        }
        Insert: {
          chauffeur_id?: string | null
          client_id?: string | null
          contact_a_id?: number | null
          contact_b_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_delivery?: string | null
          date_pickup?: string | null
          date_requested?: string | null
          delivery_address: string
          delivery_city: string
          delivery_country?: string
          delivery_postal_code: string
          distance_km?: number | null
          id: string
          notes?: string | null
          pickup_address: string
          pickup_city: string
          pickup_country?: string
          pickup_postal_code: string
          price_ht?: number | null
          price_ttc?: number | null
          status?: string
          time_delivery?: string | null
          time_pickup?: string | null
          time_requested?: string | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Update: {
          chauffeur_id?: string | null
          client_id?: string | null
          contact_a_id?: number | null
          contact_b_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_delivery?: string | null
          date_pickup?: string | null
          date_requested?: string | null
          delivery_address?: string
          delivery_city?: string
          delivery_country?: string
          delivery_postal_code?: string
          distance_km?: number | null
          id?: string
          notes?: string | null
          pickup_address?: string
          pickup_city?: string
          pickup_country?: string
          pickup_postal_code?: string
          price_ht?: number | null
          price_ttc?: number | null
          status?: string
          time_delivery?: string | null
          time_pickup?: string | null
          time_requested?: string | null
          updated_at?: string | null
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_chauffeur_id_fkey"
            columns: ["chauffeur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_contact_a_id_fkey"
            columns: ["contact_a_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_contact_b_id_fkey"
            columns: ["contact_b_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: number
          mission_id: string | null
          new_status: string
          old_status: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          mission_id?: string | null
          new_status: string
          old_status?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          mission_id?: string | null
          new_status?: string
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_status_history_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_grids: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          id: number
          max_km: number | null
          min_km: number
          price_ht: number
          price_ttc: number
          type_tarif: string
          updated_at: string | null
          vehicle_category: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          max_km?: number | null
          min_km: number
          price_ht: number
          price_ttc: number
          type_tarif: string
          updated_at?: string | null
          vehicle_category: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          max_km?: number | null
          min_km?: number
          price_ht?: number
          price_ttc?: number
          type_tarif?: string
          updated_at?: string | null
          vehicle_category?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vat_settings: {
        Row: {
          created_at: string | null
          effective_date: string
          id: number
          modified_by: string | null
          rate: number
        }
        Insert: {
          created_at?: string | null
          effective_date: string
          id?: number
          modified_by?: string | null
          rate: number
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          id?: number
          modified_by?: string | null
          rate?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          category: string
          color: string | null
          created_at: string | null
          created_by: string | null
          id: number
          model: string
          registration_number: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          brand: string
          category: string
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          model: string
          registration_number: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          category?: string
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          model?: string
          registration_number?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
