
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuthContext } from "@/context/AuthContext";
import { MissionDetailsDialog } from "@/components/client/MissionDetailsDialog";

const PendingQuotes = () => {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(null);
  const { user } = useAuthContext();

  // Fonction pour extraire le code postal et la ville
  const extractPostalCodeAndCity = (address: string) => {
    if (!address) return "Non spécifié";
    
    // Recherche du code postal (5 chiffres en France)
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    
    if (!postalCodeMatch) return address.substring(0, 25) + "...";
    
    // Index du code postal
    const postalCodeIndex = address.indexOf(postalCodeMatch[0]);
    
    // Extrait une partie de l'adresse à partir du code postal
    const relevantPart = address.substring(postalCodeIndex);
    
    // Divise en mots pour trouver la ville après le code postal
    const parts = relevantPart.split(' ');
    
    if (parts.length > 1) {
      // Code postal + prochain mot (généralement la ville)
      return `${postalCodeMatch[0]} ${parts.slice(1, 3).join(' ')}`;
    }
    
    // Retourne uniquement le code postal si la ville ne peut pas être extraite
    return postalCodeMatch[0];
  };

  const fetchMissions = async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'en_attente')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMissions(data as MissionRow[]);
    } else {
      console.error("Error fetching missions:", error);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [user]);

  const handleCancelMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setIsDialogOpen(true);
  };

  const confirmCancelMission = async () => {
    if (!selectedMissionId) return;
    
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: 'annule' })
        .eq('id', selectedMissionId);
        
      if (error) throw error;
      
      toast.success("La mission a été annulée avec succès");
      fetchMissions(); // Refresh missions after cancellation
    } catch (error) {
      console.error("Error cancelling mission:", error);
      toast.error("Erreur lors de l'annulation de la mission");
    } finally {
      setIsDialogOpen(false);
      setSelectedMissionId(null);
    }
  };

  const handleViewDetails = (mission: MissionRow) => {
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
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
                <TableCell>{extractPostalCodeAndCity(mission.pickup_address)}</TableCell>
                <TableCell>{extractPostalCodeAndCity(mission.delivery_address)}</TableCell>
                <TableCell className="text-right">{mission.price_ttc}€</TableCell>
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleCancelMission(mission.id)}
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

      {/* Dialog for cancel confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation d'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette mission ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelMission} className="bg-red-500 hover:bg-red-600">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for mission details */}
      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
};

export default PendingQuotes;
