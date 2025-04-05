
import { Database } from "@/integrations/supabase/types";

export type MissionRow = {
  id: string;
  client_id: string;
  driver_id: string | null;
  admin_id: string | null; // Added admin_id
  quote_id: string | null;
  mission_type: "livraison" | "restitution";
  status: MissionStatus;
  mission_number: string | null;
  quote_number: string | null;
  pickup_address: string;
  delivery_address: string;
  distance: string;
  price_ht: number | null;
  price_ttc: number | null;
  vehicle_info: any | null;
  pickup_date: string | null;
  pickup_time: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  pickup_contact: any | null;
  delivery_contact: any | null;
  created_at: string;
  updated_at: string | null;
  vehicles: any | null;
  additional_info?: string | null;
  clientProfile?: UserProfileRow | null;
  // Nouvelles propriétés d'adresse structurée
  street_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
};

export type UserProfileRow = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company_name?: string | null;
  phone?: string | null;
  profile_picture?: string | null;
  billing_address?: string | null;
  siret_number?: string | null;
  vat_number?: string | null;
  client_code?: string | null; // Assurer que le client_code est défini
};

// Updated MissionStatus to ensure both 'annule' and 'annulé' are valid values for cancellation
export type MissionStatus = "termine" | "prise_en_charge" | "en_attente" | "confirme" | "confirmé" | "livre" | "incident" | "annule" | "annulé";

export type DocumentType = "kbis" | "driving_license" | "id_card" | "vigilance_certificate";

export type NotificationType = "mission_status" | "document_update" | "invoice_generated" | "general";

export type NotificationRow = {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  mission_id?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
};

export type InvoiceRow = {
  id: string;
  mission_id: string;
  client_id: string;
  invoice_number: string;
  price_ht: number;
  price_ttc: number;
  created_at: string;
  paid: boolean;
  issued_date: string;
};

export type Tables = Database['public']['Tables'];
