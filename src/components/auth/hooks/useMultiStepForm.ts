
import { UseFormReturn } from 'react-hook-form';
import { CompleteSignUpType } from "../schemas/signUpStepSchema";
import { useMultiStepSignUp } from './useMultiStepSignUp';
import { useFormWizard } from '@/components/form-wizard/useFormWizard';
import { FormStep } from '@/components/form-wizard/useFormWizard';

interface UseMultiStepFormProps {
  steps: FormStep[];
  forms: UseFormReturn<any>[];
  finalSubmitData: () => CompleteSignUpType;
}

export const useMultiStepForm = ({ steps, forms, finalSubmitData }: UseMultiStepFormProps) => {
  const { handleSubmit, isLoading } = useMultiStepSignUp();
  
  const formWizard = useFormWizard<CompleteSignUpType>({
    steps,
    forms,
    onFinalSubmit: handleSubmit,
    finalSubmitData,
    stepCompletedMessage: (stepTitle) => `Étape ${stepTitle} complétée`,
    errorMessage: "Une erreur est survenue lors de l'inscription",
    successMessage: "Votre inscription a été prise en compte",
  });

  return {
    ...formWizard,
    isLoading: isLoading || formWizard.isSubmitting
  };
};
