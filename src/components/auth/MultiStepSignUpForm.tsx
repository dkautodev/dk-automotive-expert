
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  nameStepSchema, 
  contactStepSchema, 
  billingStepSchema, 
  passwordStepSchema,
  completeSignUpSchema,
  NameStepType,
  ContactStepType,
  BillingStepType,
  PasswordStepType,
  CompleteSignUpType
} from "./schemas/signUpStepSchema";
import { useMultiStepForm } from "./hooks/useMultiStepForm";
import FormStepper from "./signup-components/FormStepper";
import FormActions from "./signup-components/FormActions";
import StepContent from "./signup-components/StepContent";

const steps = [
  { id: 'name', title: 'Identité' },
  { id: 'contact', title: 'Coordonnées' },
  { id: 'billing', title: 'Facturation' },
  { id: 'password', title: 'Sécurité' },
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
    isLoading, 
    next, 
    previous, 
    finalSubmit,
    totalSteps
  } = useMultiStepForm({
    steps,
    forms,
    finalSubmitData: getFinalFormData
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Inscription Professionnel</CardTitle>
        <CardDescription>
          Créez votre compte professionnel pour commander vos convoyages
        </CardDescription>
      </CardHeader>
      
      <FormStepper steps={steps} currentStep={currentStep} />
      
      <CardContent>
        <StepContent
          currentStep={currentStep}
          nameForm={nameForm}
          contactForm={contactForm}
          billingForm={billingForm}
          passwordForm={passwordForm}
        />
      </CardContent>
      
      <CardFooter>
        <FormActions
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={previous}
          onNext={next}
          onFinalSubmit={finalSubmit}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default MultiStepSignUpForm;
