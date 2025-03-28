
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from "sonner";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
}

interface UseFormWizardProps<T> {
  steps: FormStep[];
  forms: UseFormReturn<any>[];
  onFinalSubmit: (data: T) => Promise<void> | void;
  finalSubmitData: () => T;
  successMessage?: string;
  errorMessage?: string;
  stepCompletedMessage?: (stepTitle: string) => string;
  stepErrorMessage?: string;
}

export const useFormWizard = <T>({
  steps,
  forms,
  onFinalSubmit,
  finalSubmitData,
  successMessage = "Formulaire soumis avec succès",
  errorMessage = "Erreur lors de la soumission du formulaire",
  stepCompletedMessage = (stepTitle) => `Étape ${stepTitle} complétée`,
  stepErrorMessage = "Veuillez corriger les erreurs avant de continuer"
}: UseFormWizardProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentForm = forms[currentStep];

  const next = async () => {
    const isValid = await currentForm.trigger();
    if (isValid && currentStep < steps.length - 1) {
      toast.success(stepCompletedMessage(steps[currentStep].title));
      setCurrentStep(prev => prev + 1);
    } else if (!isValid) {
      toast.error(stepErrorMessage);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const finalSubmit = async () => {
    const isValid = await forms[currentStep].trigger();
    if (!isValid) {
      toast.error(stepErrorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const completeData = finalSubmitData();
      await onFinalSubmit(completeData);
      toast.success(successMessage);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    currentForm,
    isSubmitting,
    next,
    previous,
    goToStep,
    finalSubmit,
    totalSteps: steps.length,
  };
};
