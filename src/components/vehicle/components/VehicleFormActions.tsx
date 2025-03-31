
import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Trash2 } from "lucide-react";

interface VehicleFormActionsProps {
  onDelete: () => void;
  onQuoteRequest?: () => void;
}

export const VehicleFormActions = ({
  onDelete,
  onQuoteRequest
}: VehicleFormActionsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={onDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      {onQuoteRequest && (
        <div className="flex justify-end mt-6">
          <Button variant="default" className="gap-2" onClick={onQuoteRequest}>
            <Calculator className="h-4 w-4" />
            Votre devis
          </Button>
        </div>
      )}
    </div>
  );
};
