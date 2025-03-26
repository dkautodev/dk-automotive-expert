
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow, MissionRow } from "@/types/database";
import { Check, Receipt } from "lucide-react";
import CreateMissionDialog from "@/components/mission-form/CreateMissionDialog";
import DashboardCards from "./DashboardCards";
import CompletedMissionsTable from "./CompletedMissionsTable";
import PendingInvoicesTable from "./PendingInvoicesTable";

const AdminHome = () => {
  const [pendingQuotesCount, setPendingQuotesCount] = useState(0);
  const [ongoingMissionsCount, setOngoingMissionsCount] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<MissionRow[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<QuoteRow[]>([]);

  const fetchDashboardData = async () => {
    // Fetch pending quotes count
    const { count: pendingCount } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // Fetch ongoing missions count
    const { count: ongoingCount } = await supabase
      .from('missions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['en_attente', 'confirme', 'prise_en_charge']);
    
    // Fetch completed missions with quote details
    const { data: completedData } = await supabase
      .from('missions')
      .select(`
        *,
        quote:quotes(pickup_address, delivery_address)
      `)
      .eq('status', 'termine')
      .order('updated_at', { ascending: false })
      .limit(5);
    
    // Fetch quotes with status 'accepted' for pending invoices
    const { data: invoicesData } = await supabase
      .from('quotes')
      .select('*')
      .eq('status', 'accepted')
      .order('date_created', { ascending: false })
      .limit(5);
    
    setPendingQuotesCount(pendingCount || 0);
    setOngoingMissionsCount(ongoingCount || 0);
    
    // Convert the response to match our MissionRow type
    if (completedData) {
      const typedMissions = completedData.map(mission => ({
        ...mission,
        status: mission.status as MissionRow['status'], // Cast status to the expected type
      })) as MissionRow[];
      setCompletedMissions(typedMissions);
    }
    
    setPendingInvoices(invoicesData as QuoteRow[] || []);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
        <CreateMissionDialog onMissionCreated={fetchDashboardData} />
      </div>
      
      <DashboardCards 
        pendingQuotesCount={pendingQuotesCount} 
        ongoingMissionsCount={ongoingMissionsCount} 
      />

      <Tabs defaultValue="completed-missions" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="completed-missions" className="flex items-center">
            <Check size={16} className="mr-2" />
            Missions terminées
          </TabsTrigger>
          <TabsTrigger value="pending-invoices" className="flex items-center">
            <Receipt size={16} className="mr-2" />
            Factures en attente
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed-missions">
          <CompletedMissionsTable missions={completedMissions} />
        </TabsContent>
        
        <TabsContent value="pending-invoices">
          <PendingInvoicesTable invoices={pendingInvoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
