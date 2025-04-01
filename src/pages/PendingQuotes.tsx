
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, Eye, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";
import { extractPostalCodeAndCity } from "@/utils/addressUtils";
import { generateMissionPDF } from "@/utils/missionPdfGenerator";
import { useMissionCancellation } from "@/hooks/useMissionCancellation";
import { CancelMissionDialog } from "@/components/missions/CancelMissionDialog";

const PendingQuotes = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const { user } = useAuthContext();
  
  const { 
    isCancelDialogOpen, 
    isLoading, 
    handleCancelMission, 
    confirmCancelMission, 
    setIsCancelDialogOpen 
  } = useMissionCancellation({ 
    onSuccess: fetchMissions 
  });

  function fetchMissions() {
    if (!user?.id) return;
    
    supabase
      .from('missions')
      .select('*')
      .eq('status', 'en_attente')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching missions:", error);
        } else {
          setMissions(data as MissionRow[]);
        }
      });
  }

  useEffect(() => {
    if (user?.id) {
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

  const formatPickupDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
  };

  const formatDeliveryDate = (dateString: string | null) => {
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
        <h1 className="text-3xl font-bold">Devis en attente</h1>
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
              <TableHead className="text-right">Prix TTC</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.mission_number || "Non attribué"}</TableCell>
                <TableCell>{getVehicleInfo(mission)}</TableCell>
                <TableCell>{formatPickupDate(mission.pickup_date)}</TableCell>
                <TableCell>{formatDeliveryDate(mission.delivery_date)}</TableCell>
                <TableCell title={mission.pickup_address}>{extractPostalCodeAndCity(mission.pickup_address)}</TableCell>
                <TableCell title={mission.delivery_address}>{extractPostalCodeAndCity(mission.delivery_address)}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleCancelMission(mission.id)}
                      disabled={isLoading}
                      title="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {missions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  Aucun devis en attente
                </TableCell>
              </TableRow>
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

      {/* Dialog for cancel confirmation */}
      <CancelMissionDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancelMission}
        isLoading={isLoading}
        missionNumber={selectedMission?.mission_number}
      />
    </div>
  );
};

export default PendingQuotes;
