
import { Button } from "@/components/ui/button";
import { Check, RotateCw } from "lucide-react";

interface CalculateButtonProps {
  onClick: () => void;
  isCalculating: boolean;
  distance: number | null;
  disabled: boolean;
}

const CalculateButton = ({ onClick, isCalculating, distance, disabled }: CalculateButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || isCalculating}
      className="w-full"
    >
      {isCalculating ? (
        <>
          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          Calcul en cours...
        </>
      ) : distance ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Recalculer la distance et le prix
        </>
      ) : (
        "Calculer la distance et le prix"
      )}
    </Button>
  );
};

export default CalculateButton;
