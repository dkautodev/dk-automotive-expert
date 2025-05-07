
// Types de base pour le site public (sans connexion à Supabase)

// Type MissionRow complet avec tous les champs nécessaires
export interface MissionRow {
  id: string;
  client_id: string;
  driver_id: string | null;
  admin_id: string | null;
  mission_number: string | null;
  status: string;
  pickup_address: string;
  delivery_address: string;
  distance: string;
  price_ht: number | null;
  price_ttc: number | null;
  pickup_date: string | null;
  delivery_date: string | null;
  created_at: string;
  updated_at: string | null;
  
  // Champs supplémentaires pour les composants existants
  mission_type: string;
  pickup_contact: ContactInfo;
  delivery_contact: ContactInfo;
  vehicle_info: VehicleInfo;
  pickup_time?: string;
  delivery_time?: string;
  additional_info?: string;
}

// Information de contact
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

// Information sur le véhicule
export interface VehicleInfo {
  type: string;
  brand: string;
  model: string;
  year?: string;
  fuel?: string;
  licensePlate?: string;
}

// Types pour les documents (pour résoudre les erreurs de type dans DocumentManager)
export interface DocumentItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  document_type: string;
  document_url: string;
  created_at: string;
  uploaded_at: string;
  uploaded_by?: string;
  storage_provider?: string;
}

export type DocumentType = 
  'identity' | 
  'license' | 
  'insurance' | 
  'invoice' | 
  'contract' | 
  'quote' | 
  'damage_report' | 
  'vehicle_photo' | 
  'delivery_note';

// Type pour les notifications
export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  reference_id?: string;
  reference_type?: string;
  action_url?: string;
}
