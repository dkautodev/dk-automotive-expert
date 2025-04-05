
import React from "react";

interface EmptyMissionsStateProps {
  showAllMissions?: boolean;
  message?: string;
}

export const EmptyMissionsState: React.FC<EmptyMissionsStateProps> = ({ showAllMissions, message }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        {message || (showAllMissions ? "Aucune mission trouvée dans la base de données" : "Aucune mission en cours")}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {showAllMissions ? "Créez votre première mission en utilisant le bouton en haut de la page" : ""}
      </p>
    </div>
  );
};
