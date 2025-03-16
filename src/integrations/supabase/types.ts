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
        Relationships: [
          {
            foreignKeyName: "mission_documents_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          chauffeur_id: string | null
          client_id: string | null
          created_at: string | null
          delivery_address: string
          distance: number
          fuel_type: string
          id: string
          license_plate: string
          pickup_address: string
          start_datetime: string
          status: Database["public"]["Enums"]["mission_status"]
          updated_at: string | null
          vehicle_brand: string
          vehicle_model: string
        }
        Insert: {
          chauffeur_id?: string | null
          client_id?: string | null
          created_at?: string | null
          delivery_address: string
          distance: number
          fuel_type: string
          id?: string
          license_plate: string
          pickup_address: string
          start_datetime: string
          status?: Database["public"]["Enums"]["mission_status"]
          updated_at?: string | null
          vehicle_brand: string
          vehicle_model: string
        }
        Update: {
          chauffeur_id?: string | null
          client_id?: string | null
          created_at?: string | null
          delivery_address?: string
          distance?: number
          fuel_type?: string
          id?: string
          license_plate?: string
          pickup_address?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["mission_status"]
          updated_at?: string | null
          vehicle_brand?: string
          vehicle_model?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_chauffeur_id_fkey"
            columns: ["chauffeur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_client_id_fkey"
            columns: ["client_id"]
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
      [_ in never]: never
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
