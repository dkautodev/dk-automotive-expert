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
          client_id: string
          created_at: string | null
          driver_id: string | null
          id: string
          quote_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          driver_id?: string | null
          id?: string
          quote_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          driver_id?: string | null
          id?: string
          quote_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          date_created: string | null
          delivery_address: string
          delivery_contact: Json | null
          delivery_date: string | null
          delivery_time: string | null
          distance: string
          id: string
          pickup_address: string
          pickup_contact: Json | null
          pickup_date: string | null
          pickup_time: string | null
          quote_number: string
          status: string
          total_price_ht: number
          total_price_ttc: number
          user_id: string | null
          vehicles: Json
        }
        Insert: {
          date_created?: string | null
          delivery_address: string
          delivery_contact?: Json | null
          delivery_date?: string | null
          delivery_time?: string | null
          distance: string
          id?: string
          pickup_address: string
          pickup_contact?: Json | null
          pickup_date?: string | null
          pickup_time?: string | null
          quote_number: string
          status?: string
          total_price_ht: number
          total_price_ttc: number
          user_id?: string | null
          vehicles: Json
        }
        Update: {
          date_created?: string | null
          delivery_address?: string
          delivery_contact?: Json | null
          delivery_date?: string | null
          delivery_time?: string | null
          distance?: string
          id?: string
          pickup_address?: string
          pickup_contact?: Json | null
          pickup_date?: string | null
          pickup_time?: string | null
          quote_number?: string
          status?: string
          total_price_ht?: number
          total_price_ttc?: number
          user_id?: string | null
          vehicles?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          billing_address: string | null
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
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      document_type: "kbis" | "driving_license" | "id_card"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
