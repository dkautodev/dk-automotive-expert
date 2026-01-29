export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_page_contents: {
        Row: {
          block_key: string
          block_type: string
          content_json: Json | null
          content_value: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          page_slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          block_key: string
          block_type: string
          content_json?: Json | null
          content_value?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          page_slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          block_key?: string
          block_type?: string
          content_json?: Json | null
          content_value?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          page_slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      cgu_content: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          section_content: string | null
          section_key: string
          section_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key: string
          section_title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key?: string
          section_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      cgv_content: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          section_content: string | null
          section_key: string
          section_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key: string
          section_title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key?: string
          section_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      cookie_management: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          section_content: string | null
          section_key: string
          section_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key: string
          section_title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key?: string
          section_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      legal_mentions: {
        Row: {
          created_at: string
          display_order: number
          field_key: string
          field_label: string
          field_value: string | null
          id: string
          is_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          field_key: string
          field_label: string
          field_value?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          field_key?: string
          field_label?: string
          field_value?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          client_company: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          delivery_address: string
          delivery_city: string | null
          delivery_contact_name: string | null
          delivery_contact_phone: string | null
          delivery_date: string | null
          delivery_postal_code: string | null
          delivery_time: string | null
          delivery_time_end: string | null
          distance_km: number | null
          id: string
          is_processed: boolean
          license_plate: string | null
          notes: string | null
          payment_intent_id: string | null
          payment_status: string | null
          pickup_address: string
          pickup_city: string | null
          pickup_contact_name: string | null
          pickup_contact_phone: string | null
          pickup_date: string | null
          pickup_postal_code: string | null
          pickup_time: string | null
          pickup_time_end: string | null
          price_ht: number | null
          price_ttc: number | null
          status: string
          updated_at: string
          updated_by: string | null
          vehicle_brand: string | null
          vehicle_fuel: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_vin: string | null
          vehicle_year: string | null
        }
        Insert: {
          client_company?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          delivery_address: string
          delivery_city?: string | null
          delivery_contact_name?: string | null
          delivery_contact_phone?: string | null
          delivery_date?: string | null
          delivery_postal_code?: string | null
          delivery_time?: string | null
          delivery_time_end?: string | null
          distance_km?: number | null
          id?: string
          is_processed?: boolean
          license_plate?: string | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          pickup_address: string
          pickup_city?: string | null
          pickup_contact_name?: string | null
          pickup_contact_phone?: string | null
          pickup_date?: string | null
          pickup_postal_code?: string | null
          pickup_time?: string | null
          pickup_time_end?: string | null
          price_ht?: number | null
          price_ttc?: number | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          vehicle_brand?: string | null
          vehicle_fuel?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
        }
        Update: {
          client_company?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          delivery_address?: string
          delivery_city?: string | null
          delivery_contact_name?: string | null
          delivery_contact_phone?: string | null
          delivery_date?: string | null
          delivery_postal_code?: string | null
          delivery_time?: string | null
          delivery_time_end?: string | null
          distance_km?: number | null
          id?: string
          is_processed?: boolean
          license_plate?: string | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          pickup_address?: string
          pickup_city?: string | null
          pickup_contact_name?: string | null
          pickup_contact_phone?: string | null
          pickup_date?: string | null
          pickup_postal_code?: string | null
          pickup_time?: string | null
          pickup_time_end?: string | null
          price_ht?: number | null
          price_ttc?: number | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          vehicle_brand?: string | null
          vehicle_fuel?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          block_key: string
          block_type: string
          content_json: Json | null
          content_value: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          page_slug: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          block_key: string
          block_type: string
          content_json?: Json | null
          content_value?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          page_slug: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          block_key?: string
          block_type?: string
          content_json?: Json | null
          content_value?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          page_slug?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      pricing_grids_public: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number | null
          max_distance: number | null
          min_distance: number | null
          price_ht: number | null
          price_ttc: number | null
          type_tarif: string | null
          updated_at: string | null
          updated_by: string | null
          vehicle_category: string | null
          vehicle_id: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number | null
          max_distance?: number | null
          min_distance?: number | null
          price_ht?: number | null
          price_ttc?: number | null
          type_tarif?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vehicle_category?: string | null
          vehicle_id?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number | null
          max_distance?: number | null
          min_distance?: number | null
          price_ht?: number | null
          price_ttc?: number | null
          type_tarif?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vehicle_category?: string | null
          vehicle_id?: number | null
        }
        Relationships: []
      }
      privacy_policy: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          section_content: string | null
          section_key: string
          section_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key: string
          section_title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_content?: string | null
          section_key?: string
          section_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      professional_space_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          setting_key: string
          setting_label: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key: string
          setting_label: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_label?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          platform: string
          platform_label: string
          updated_at: string
          updated_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          platform: string
          platform_label: string
          updated_at?: string
          updated_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          platform_label?: string
          updated_at?: string
          updated_by?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
