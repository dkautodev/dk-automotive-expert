
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  nameStepSchema, 
  contactStepSchema, 
  billingStepSchema, 
  passwordStepSchema,
  NameStepType,
  ContactStepType,
  BillingStepType,
  PasswordStepType,
  CompleteSignUpType
} from "./schemas/signUpStepSchema";
import FormWizard from "../form-wizard/FormWizard";
import FormWizardStep from "../form-wizard/FormWizardStep";
import { useFormWizard, FormStep } from "../form-wizard/useFormWizard";
import { useMultiStepSignUp } from "./hooks/useMultiStepSignUp";
import NameStep from "./signup-steps/NameStep";
import ContactStep from "./signup-steps/ContactStep";
import BillingStep from "./signup-steps/BillingStep";
import PasswordStep from "./signup-steps/PasswordStep";

const steps: FormStep[] = [
  { id: 'name', title: 'Identité', description: 'Vos informations personnelles' },
  { id: 'contact', title: 'Coordonnées', description: 'Comment vous contacter' },
  { id: 'billing', title: 'Facturation', description: 'Informations de facturation' },
  { id: 'password', title: 'Sécurité', description: 'Sécurisation de votre compte' },
];

const MultiStepSignUpForm = () => {
  const nameForm = useForm<NameStepType>({
    resolver: zodResolver(nameStepSchema),
    defaultValues: {
      lastName: "",
      firstName: ""
    }
  });

  const contactForm = useForm<ContactStepType>({
    resolver: zodResolver(contactStepSchema),
    defaultValues: {
      phone: "",
      email: ""
    }
  });

  const billingForm = useForm<BillingStepType>({
    resolver: zodResolver(billingStepSchema),
    defaultValues: {
      company: "",
      street: "",
      postalCode: "",
      city: "",
      country: "France",
      siret: "",
      vatNumber: ""
    }
  });

  const passwordForm = useForm<PasswordStepType>({
    resolver: zodResolver(passwordStepSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const forms = [nameForm, contactForm, billingForm, passwordForm];
  const { handleSubmit } = useMultiStepSignUp();
  
  const getFinalFormData = (): CompleteSignUpType => {
    return {
      ...nameForm.getValues(),
      ...contactForm.getValues(),
      ...billingForm.getValues(),
      ...passwordForm.getValues()
    };
  };

  const { 
    currentStep,
    isSubmitting,
    next,
    previous,
    finalSubmit,
    totalSteps
  } = useFormWizard<CompleteSignUpType>({
    steps,
    forms,
    onFinalSubmit: handleSubmit,
    finalSubmitData: getFinalFormData,
    stepCompletedMessage: (stepTitle) => `Étape ${stepTitle} complétée`,
    errorMessage: "Une erreur est survenue lors de l'inscription",
    successMessage: "Votre inscription a été prise en compte",
  });

  const renderStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <FormWizardStep form={nameForm}>
            <NameStep control={nameForm.control} />
          </FormWizardStep>
        );
      case 1:
        return (
          <FormWizardStep form={contactForm}>
            <ContactStep control={contactForm.control} />
          </FormWizardStep>
        );
      case 2:
        return (
          <FormWizardStep form={billingForm}>
            <BillingStep control={billingForm.control} />
          </FormWizardStep>
        );
      case 3:
        return (
          <FormWizardStep form={passwordForm}>
            <PasswordStep control={passwordForm.control} />
          </FormWizardStep>
        );
      default:
        return null;
    }
  };

  return (
    <FormWizard
      title="Inscription Professionnel"
      description="Créez votre compte professionnel pour commander vos convoyages"
      steps={steps}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isSubmitting={isSubmitting}
      renderStep={renderStep}
      onPrevious={previous}
      onNext={next}
      onFinalSubmit={finalSubmit}
    />
  );
};

export default MultiStepSignUpForm;
