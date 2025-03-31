
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MissionRow } from '@/types/database';

interface DashboardCounts {
  pendingQuotes: number;
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
}

// Use the MissionRow type from database.ts instead of defining a separate Mission interface
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

      // Inclure à la fois 'confirme' et 'confirmé' et 'prise_en_charge' comme statuts pour les missions en cours
      const ongoingShipments = (missions as MissionRow[] || []).filter(m => 
        m.status === 'confirme' || m.status === 'confirmé' || m.status === 'prise_en_charge').length;
        
      const completedShipments = (missions as MissionRow[] || []).filter(m => 
        m.status === 'termine').length;
        
      const pendingInvoices = (missions as MissionRow[] || []).filter(m => 
        m.status === 'livre').length;

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
