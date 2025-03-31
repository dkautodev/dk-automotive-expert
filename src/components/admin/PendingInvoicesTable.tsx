
import { useEffect, useState } from "react";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MissionRow } from "@/types/database";
import { CircleDollarSign } from "lucide-react";

interface PendingInvoicesTableProps {
  refreshTrigger?: number;
}

const PendingInvoicesTable = ({ refreshTrigger = 0 }: PendingInvoicesTableProps) => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await extendedSupabase
        .from('missions')
        .select('*')
        .eq('status', 'livre')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data as MissionRow[]);
    } catch (error: any) {
      console.error('Error fetching pending invoice missions:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (mission: MissionRow) => {
    setGeneratingInvoice(mission.id);
    try {
      const invoiceNumber = `FACTURE-${mission.mission_number}`;
      
      const { error } = await extendedSupabase
        .from('invoices')
        .insert({
          mission_id: mission.id,
          client_id: mission.client_id,
          invoice_number: invoiceNumber,
          price_ht: mission.price_ht || 0,
          price_ttc: mission.price_ttc || 0
        });

      if (error) throw error;
      
      toast.success(`Facture ${invoiceNumber} générée avec succès`);
      fetchMissions();
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setGeneratingInvoice(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircleDollarSign className="mr-2 h-5 w-5" /> Factures à générer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader className="h-6 w-6" />
          </div>
        ) : missions.length > 0 ? (
          <div className="space-y-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <p className="font-semibold">{mission.mission_number}</p>
                  <p className="text-sm text-gray-600">
                    Livré le {mission.delivery_date ? format(new Date(mission.delivery_date), "Pp", { locale: fr }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{mission.price_ttc?.toFixed(2)}€ TTC</p>
                  <p className="text-xs text-muted-foreground">
                    {mission.price_ht?.toFixed(2)}€ HT
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateInvoice(mission)}
                  disabled={generatingInvoice === mission.id}
                >
                  {generatingInvoice === mission.id ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" /> Génération...
                    </>
                  ) : (
                    "Générer la facture"
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucune mission à facturer</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingInvoicesTable;
