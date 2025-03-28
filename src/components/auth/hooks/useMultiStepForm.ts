
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompleteSignUpType } from "../schemas/signUpStepSchema";
import { useMultiStepSignUp } from './useMultiStepSignUp';
import { toast } from "sonner";

interface UseMultiStepFormProps {
  steps: Array<{ id: string; title: string; description?: string }>;
  forms: UseFormReturn<any>[];
  finalSubmitData: () => CompleteSignUpType;
}

export const useMultiStepForm = ({ steps, forms, finalSubmitData }: UseMultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit: onSubmitForm, isLoading } = useMultiStepSignUp();
  
  const currentForm = forms[currentStep];

  const next = async () => {
    const isValid = await currentForm.trigger();
    if (isValid && currentStep < steps.length - 1) {
      toast.success(`Étape ${steps[currentStep].title} complétée`);
      setCurrentStep(prev => prev + 1);
    } else if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finalSubmit = async () => {
    const isValid = await forms[currentStep].trigger();
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de soumettre le formulaire");
      return;
    }

    const completeData = finalSubmitData();
    toast.info("Traitement de votre inscription...");
    onSubmitForm(completeData);
  };

  return {
    currentStep,
    currentForm,
    isLoading,
    next,
    previous,
    finalSubmit,
    totalSteps: steps.length,
  };
};
