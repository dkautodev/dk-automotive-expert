
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { QuoteRow, MissionRow } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Receipt } from "lucide-react";

const AdminHome = () => {
  const [pendingQuotesCount, setPendingQuotesCount] = useState(0);
  const [ongoingMissionsCount, setOngoingMissionsCount] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<MissionRow[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<QuoteRow[]>([]);

  useEffect(() => {
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
        .eq('status', 'in_progress');
      
      // Fetch completed missions with quote details
      const { data: completedData } = await supabase
        .from('missions')
        .select(`
          *,
          quote:quotes(pickup_address, delivery_address)
        `)
        .eq('status', 'completed')
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

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Administrateur</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Devis en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingQuotesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missions en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ongoingMissionsCount}</p>
          </CardContent>
        </Card>
      </div>

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
          <Card>
            <CardHeader>
              <CardTitle>Missions terminées récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Mission</TableHead>
                    <TableHead>Adresse départ</TableHead>
                    <TableHead>Adresse livraison</TableHead>
                    <TableHead>Date de fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedMissions.length > 0 ? (
                    completedMissions.map((mission) => (
                      <TableRow key={mission.id}>
                        <TableCell className="font-medium">{mission.id.substring(0, 8)}</TableCell>
                        <TableCell>{mission.quote?.pickup_address || "N/A"}</TableCell>
                        <TableCell>{mission.quote?.delivery_address || "N/A"}</TableCell>
                        <TableCell>{mission.updated_at ? formatDate(mission.updated_at) : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">Aucune mission terminée</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-invoices">
          <Card>
            <CardHeader>
              <CardTitle>Factures en attente de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Devis</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Arrivée</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvoices.length > 0 ? (
                    pendingInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.quote_number}</TableCell>
                        <TableCell>{invoice.pickup_address.split(',')[0]}</TableCell>
                        <TableCell>{invoice.delivery_address.split(',')[0]}</TableCell>
                        <TableCell>{invoice.total_price_ttc} €</TableCell>
                        <TableCell>{formatDate(invoice.date_created || "")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Aucune facture en attente</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
