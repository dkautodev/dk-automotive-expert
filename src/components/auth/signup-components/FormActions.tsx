
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FormActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinalSubmit: () => void;
  isLoading: boolean;
}

const FormActions = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onFinalSubmit,
  isLoading
}: FormActionsProps) => {
  return (
    <div className="flex justify-between">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Retourner à l'étape précédente</p>
        </TooltipContent>
      </Tooltip>
      
      {currentStep < totalSteps - 1 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              onClick={onNext}
              className="bg-dk-navy hover:bg-dk-blue"
            >
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Passer à l'étape suivante</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              onClick={onFinalSubmit}
              disabled={isLoading}
              className="bg-dk-navy hover:bg-dk-blue"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Finaliser l'inscription et créer votre compte</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default FormActions;
