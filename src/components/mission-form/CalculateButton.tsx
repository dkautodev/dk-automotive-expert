
import { Button } from "@/components/ui/button";
import { CalculatorIcon } from "lucide-react";

interface CalculateButtonProps {
  onClick: () => void;
  isCalculating: boolean;
  distance: number | null;
  disabled: boolean;
}

const CalculateButton = ({ 
  onClick, 
  isCalculating, 
  distance, 
  disabled 
}: CalculateButtonProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Button
        type="button"
        className="w-full md:w-auto flex items-center gap-2"
        onClick={onClick}
        disabled={disabled || isCalculating}
      >
        <CalculatorIcon className="h-5 w-5" />
        {isCalculating ? "Calcul en cours..." : "Calculer la distance et le prix"}
      </Button>
      
      {distance === null && !isCalculating && (
        <p className="text-sm text-muted-foreground mt-2">
          Cliquez sur le bouton pour calculer la distance et le prix
        </p>
      )}
    </div>
  );
};

export default CalculateButton;
