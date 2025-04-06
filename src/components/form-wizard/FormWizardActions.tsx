
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface FormWizardActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinalSubmit: () => void;
  isSubmitting: boolean;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  loadingLabel?: string;
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
  showTerms?: boolean;
}

const FormWizardActions = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onFinalSubmit,
  isSubmitting,
  previousLabel = "Précédent",
  nextLabel = "Suivant",
  submitLabel = "Soumettre",
  loadingLabel = "Traitement en cours...",
  termsAccepted = false,
  onTermsChange,
  showTerms = true
}: FormWizardActionsProps) => {
  return (
    <div className="space-y-4 w-full">
      {currentStep === totalSteps - 1 && showTerms && (
        <div className="flex items-start space-x-2 my-4">
          <Checkbox 
            id="terms" 
            checked={termsAccepted} 
            onCheckedChange={(checked) => onTermsChange?.(checked === true)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
            En cliquant sur "Créer la mission", vous reconnaissez avoir lu et accepté les{" "}
            <Link to="/cgv" target="_blank" className="text-blue-500 hover:underline">
              Conditions Générales de Vente
            </Link>
          </label>
        </div>
      )}
      
      <div className="flex justify-between w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> {previousLabel}
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
                {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
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
                disabled={isSubmitting || (showTerms && !termsAccepted)}
                className="bg-dk-navy hover:bg-dk-blue"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Finaliser et soumettre le formulaire</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default FormWizardActions;
