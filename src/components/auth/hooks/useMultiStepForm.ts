
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompleteSignUpType } from "../schemas/signUpStepSchema";
import { useMultiStepSignUp } from './useMultiStepSignUp';

interface UseMultiStepFormProps {
  steps: Array<{ id: string; title: string }>;
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
      setCurrentStep(prev => prev + 1);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finalSubmit = async () => {
    const isValid = await forms[currentStep].trigger();
    if (!isValid) return;

    const completeData = finalSubmitData();
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
