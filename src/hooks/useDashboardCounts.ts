
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardCounts {
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
}

export const useDashboardCounts = () => {
  const fetchCounts = async (): Promise<DashboardCounts> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        ongoingShipments: 0,
        pendingInvoices: 0,
        completedShipments: 0,
      };
    }

    const { count: pendingQuotesCount } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('user_id', user.id);

    return {
      ongoingShipments: 0,
      pendingInvoices: 0,
      completedShipments: pendingQuotesCount || 0,
    };
  };

  return useQuery({
    queryKey: ['dashboardCounts'],
    queryFn: fetchCounts
  });
};
