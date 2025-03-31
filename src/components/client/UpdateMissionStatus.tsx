
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { confirmMission } from "@/utils/missionUtils";
import { Loader } from "@/components/ui/loader";

export const UpdateMissionStatus = () => {
  const [loading, setLoading] = useState(false);
  const missionNumber = "LIV-DK-00000100";
  
  const handleConfirmMission = async () => {
    setLoading(true);
    await confirmMission(missionNumber);
    setLoading(false);
    
    // Refresh the page to show updated data
    window.location.reload();
  };
  
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Mission en attente</h2>
      <p className="mb-4">
        La mission <strong>{missionNumber}</strong> est actuellement en attente.
        Voulez-vous la confirmer pour qu'elle apparaisse dans la section "Convoyages en cours" ?
      </p>
      <Button 
        onClick={handleConfirmMission}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4" />
            Confirmation en cours...
          </>
        ) : (
          "Confirmer cette mission"
        )}
      </Button>
    </div>
  );
};
