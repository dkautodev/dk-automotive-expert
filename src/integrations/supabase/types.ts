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
      contacts: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          document_url?: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          invoice_number: string
          issued_date: string | null
          mission_id: string
          paid: boolean | null
          price_ht: number
          price_ttc: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          invoice_number: string
          issued_date?: string | null
          mission_id: string
          paid?: boolean | null
          price_ht: number
          price_ttc: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          invoice_number?: string
          issued_date?: string | null
          mission_id?: string
          paid?: boolean | null
          price_ht?: number
          price_ttc?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          mission_id: string | null
          storage_provider: string | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mission_id?: string | null
          storage_provider?: string | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mission_id?: string | null
          storage_provider?: string | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_attachments_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_documents: {
        Row: {
          document_url: string
          id: string
          mission_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          document_url: string
          id?: string
          mission_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          document_url?: string
          id?: string
          mission_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          additional_info: string | null
          admin_id: string | null
          city: string | null
          client_id: string
          country: string | null
          created_at: string | null
          delivery_contact: Json | null
          delivery_date: string | null
          delivery_time: string | null
          distance: string | null
          driver_id: string | null
          id: string
          mission_number: string | null
          mission_type: string
          pickup_contact: Json | null
          pickup_date: string | null
          pickup_time: string | null
          postal_code: string | null
          price_ht: number | null
          price_ttc: number | null
          quote_id: string | null
          quote_number: string | null
          status: string
          street_number: string | null
          updated_at: string | null
          vehicle_info: Json | null
          vehicles: Json | null
        }
        Insert: {
          additional_info?: string | null
          admin_id?: string | null
          city?: string | null
          client_id: string
          country?: string | null
          created_at?: string | null
          delivery_contact?: Json | null
          delivery_date?: string | null
          delivery_time?: string | null
          distance?: string | null
          driver_id?: string | null
          id?: string
          mission_number?: string | null
          mission_type?: string
          pickup_contact?: Json | null
          pickup_date?: string | null
          pickup_time?: string | null
          postal_code?: string | null
          price_ht?: number | null
          price_ttc?: number | null
          quote_id?: string | null
          quote_number?: string | null
          status?: string
          street_number?: string | null
          updated_at?: string | null
          vehicle_info?: Json | null
          vehicles?: Json | null
        }
        Update: {
          additional_info?: string | null
          admin_id?: string | null
          city?: string | null
          client_id?: string
          country?: string | null
          created_at?: string | null
          delivery_contact?: Json | null
          delivery_date?: string | null
          delivery_time?: string | null
          distance?: string | null
          driver_id?: string | null
          id?: string
          mission_number?: string | null
          mission_type?: string
          pickup_contact?: Json | null
          pickup_date?: string | null
          pickup_time?: string | null
          postal_code?: string | null
          price_ht?: number | null
          price_ttc?: number | null
          quote_id?: string | null
          quote_number?: string | null
          status?: string
          street_number?: string | null
          updated_at?: string | null
          vehicle_info?: Json | null
          vehicles?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          mission_id: string | null
          read: boolean | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          mission_id?: string | null
          read?: boolean | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          mission_id?: string | null
          read?: boolean | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      price_grids: {
        Row: {
          created_at: string | null
          distance_range_id: string
          distance_range_label: string
          id: string
          is_per_km: boolean | null
          price_ht: number
          updated_at: string | null
          vehicle_type_id: string
          vehicle_type_name: string
        }
        Insert: {
          created_at?: string | null
          distance_range_id: string
          distance_range_label: string
          id?: string
          is_per_km?: boolean | null
          price_ht: number
          updated_at?: string | null
          vehicle_type_id: string
          vehicle_type_name: string
        }
        Update: {
          created_at?: string | null
          distance_range_id?: string
          distance_range_label?: string
          id?: string
          is_per_km?: boolean | null
          price_ht?: number
          updated_at?: string | null
          vehicle_type_id?: string
          vehicle_type_name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          billing_address: string | null
          client_code: string | null
          company_name: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_picture: string | null
          siret_number: string | null
          user_id: string | null
          vat_number: string | null
        }
        Insert: {
          billing_address?: string | null
          client_code?: string | null
          company_name?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profile_picture?: string | null
          siret_number?: string | null
          user_id?: string | null
          vat_number?: string | null
        }
        Update: {
          billing_address?: string | null
          client_code?: string | null
          company_name?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_picture?: string | null
          siret_number?: string | null
          user_id?: string | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          password: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          password: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          password?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_vigilance_certificate_enum: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_price_from_distance: {
        Args: { p_vehicle_type_id: string; p_distance: number }
        Returns: {
          price_ht: number
          is_per_km: boolean
        }[]
      }
      create_mission: {
        Args: { mission_data: Json; mission_type_value: string }
        Returns: {
          additional_info: string | null
          admin_id: string | null
          city: string | null
          client_id: string
          country: string | null
          created_at: string | null
          delivery_contact: Json | null
          delivery_date: string | null
          delivery_time: string | null
          distance: string | null
          driver_id: string | null
          id: string
          mission_number: string | null
          mission_type: string
          pickup_contact: Json | null
          pickup_date: string | null
          pickup_time: string | null
          postal_code: string | null
          price_ht: number | null
          price_ttc: number | null
          quote_id: string | null
          quote_number: string | null
          status: string
          street_number: string | null
          updated_at: string | null
          vehicle_info: Json | null
          vehicles: Json | null
        }[]
      }
      generate_mission_number: {
        Args: { mission_type_param: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      register_user: {
        Args: {
          email: string
          password: string
          user_type: string
          profile: Json
        }
        Returns: string
      }
    }
    Enums: {
      document_type:
        | "kbis"
        | "driving_license"
        | "id_card"
        | "vigilance_certificate"
      mission_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_type: "client" | "admin" | "chauffeur"
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
    Enums: {
      document_type: [
        "kbis",
        "driving_license",
        "id_card",
        "vigilance_certificate",
      ],
      mission_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_type: ["client", "admin", "chauffeur"],
    },
  },
} as const
