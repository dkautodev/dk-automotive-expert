
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { extractPostalCodeAndCity } from "@/lib/utils";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { generateMissionPDF } from "@/utils/missionPdfGenerator";

const MissionHistory = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMissions(data as MissionRow[]);
    } else {
      console.error("Error fetching missions:", error);
      toast.error("Erreur lors de la récupération des missions");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const handleViewDetails = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleGeneratePDF = (mission: MissionRow) => {
    generateMissionPDF(mission);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  };

  const getVehicleInfo = (mission: MissionRow) => {
    const vehicleInfo = mission.vehicle_info as any || {};
    return vehicleInfo.brand && vehicleInfo.model 
      ? `${vehicleInfo.brand} ${vehicleInfo.model}`
      : "Non spécifié";
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Historique des missions</h1>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Date de prise en charge</TableHead>
              <TableHead>Date de livraison</TableHead>
              <TableHead>Adresse de départ</TableHead>
              <TableHead>Adresse d'arrivée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Prix TTC</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : missions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  Aucune mission trouvée
                </TableCell>
              </TableRow>
            ) : (
              missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium">{mission.mission_number || "Non attribué"}</TableCell>
                  <TableCell>{getVehicleInfo(mission)}</TableCell>
                  <TableCell>{formatDate(mission.pickup_date)}</TableCell>
                  <TableCell>{formatDate(mission.delivery_date)}</TableCell>
                  <TableCell title={mission.pickup_address}>{extractPostalCodeAndCity(mission.pickup_address)}</TableCell>
                  <TableCell title={mission.delivery_address}>{extractPostalCodeAndCity(mission.delivery_address)}</TableCell>
                  <TableCell><MissionStatusBadge status={mission.status} /></TableCell>
                  <TableCell className="text-right">{mission.price_ttc ? `${mission.price_ttc}€` : "Non spécifié"}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(mission)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleGeneratePDF(mission)}
                        title="Télécharger le PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog for mission details */}
      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
};

export default MissionHistory;
