
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardCounts {
  ongoingShipments: number;
  pendingInvoices: number;
  completedShipments: number;
}

export const useDashboardCounts = () => {
  const fetchCounts = async (): Promise<DashboardCounts> => {
    // For now, we'll return dummy data until we implement the actual counts
    return {
      ongoingShipments: 0,
      pendingInvoices: 0,
      completedShipments: 0
    };
  };

  return useQuery({
    queryKey: ['dashboardCounts'],
    queryFn: fetchCounts
  });
};
