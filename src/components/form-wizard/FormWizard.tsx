
import { PropsWithChildren, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import FormWizardStepper from "./FormWizardStepper";
import FormWizardActions from "./FormWizardActions";
import { FormStep } from "./useFormWizard";

interface FormWizardProps {
  title?: string;
  description?: string;
  steps: FormStep[];
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  renderStep: (stepIndex: number) => ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  onFinalSubmit: () => void;
}

const FormWizard = ({
  title, 
  description,
  steps,
  currentStep,
  totalSteps,
  isSubmitting,
  renderStep,
  onPrevious,
  onNext,
  onFinalSubmit
}: FormWizardProps) => {
  return (
    <TooltipProvider>
      <Card className="border-none shadow-none">
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        
        <FormWizardStepper steps={steps} currentStep={currentStep} />
        
        <CardContent>
          {renderStep(currentStep)}
        </CardContent>
        
        <CardFooter>
          <FormWizardActions
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={onPrevious}
            onNext={onNext}
            onFinalSubmit={onFinalSubmit}
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default FormWizard;
