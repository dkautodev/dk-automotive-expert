
import { Database } from "@/integrations/supabase/types";

export type QuoteRow = {
  id: string;
  pickup_address: string;
  delivery_address: string;
  vehicles: any[];
  total_price_ht: number;
  status: 'pending' | 'accepted' | 'rejected';
  date_created: string;
};

export type Tables = Database['public']['Tables'];
