
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardCounts {
  pendingQuotes: number;
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
}

// Update the Mission type to match actual database values
interface Mission {
  id: string;
  status: 'en_attente' | 'confirme' | 'confirmé' | 'prise_en_charge' | 'livre' | 'incident' | 'annule' | 'termine';
  client_id: string;
  driver_id: string | null;
  pickup_address: string;
  delivery_address: string;
}

export const useDashboardCounts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['dashboard-counts', userId],
    queryFn: async () => {
      if (!userId) return { 
        pendingQuotes: 0,
        ongoingShipments: 0,
        pendingInvoices: 0,
        completedShipments: 0
      };

      // Récupérer les missions en attente au lieu des devis
      const { data: pendingMissions, error: pendingError } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', userId)
        .eq('status', 'en_attente');

      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('client_id', userId);

      if (pendingError) {
        console.error('Error fetching pending missions:', pendingError);
      }

      if (missionsError) {
        console.error('Error fetching missions:', missionsError);
      }

      const ongoingShipments = (missions as Mission[] || []).filter(m => 
        m.status === 'prise_en_charge').length;
        
      const completedShipments = (missions as Mission[] || []).filter(m => 
        m.status === 'termine').length;
        
      const pendingInvoices = (missions as Mission[] || []).filter(m => 
        m.status === 'confirme' || m.status === 'confirmé').length;

      return {
        pendingQuotes: pendingMissions?.length || 0,
        ongoingShipments,
        pendingInvoices,
        completedShipments
      };
    },
    enabled: !!userId
  });
};
