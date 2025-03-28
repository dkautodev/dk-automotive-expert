
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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
import { useMultiStepSignUp } from "./hooks/useMultiStepSignUp";
import NameStep from "./signup-steps/NameStep";
import ContactStep from "./signup-steps/ContactStep";
import BillingStep from "./signup-steps/BillingStep";
import PasswordStep from "./signup-steps/PasswordStep";

const steps = [
  { id: 'name', title: 'Identité' },
  { id: 'contact', title: 'Coordonnées' },
  { id: 'billing', title: 'Facturation' },
  { id: 'password', title: 'Sécurité' },
];

const MultiStepSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit: onSubmitForm, isLoading } = useMultiStepSignUp();
  
  // Formulaires pour chaque étape
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
      country: "France"
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
  const currentForm = forms[currentStep];

  const next = async () => {
    const isValid = await currentForm.trigger();
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finalSubmit = async () => {
    const isValid = await passwordForm.trigger();
    if (!isValid) return;

    // Collecter toutes les données des formulaires
    const completeData: CompleteSignUpType = {
      ...nameForm.getValues(),
      ...contactForm.getValues(),
      ...billingForm.getValues(),
      ...passwordForm.getValues()
    };

    // Validation finale de toutes les données
    try {
      completeSignUpSchema.parse(completeData);
      onSubmitForm(completeData);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Inscription Professionnel</CardTitle>
        <CardDescription>
          Créez votre compte professionnel pour commander vos convoyages
        </CardDescription>
      </CardHeader>
      
      <div className="px-6 mb-4">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep 
                    ? 'bg-green-100 text-green-600' 
                    : index === currentStep 
                      ? 'bg-dk-navy text-white' 
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-dk-navy rounded-full transition-all" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <CardContent>
        <Form {...currentForm}>
          <form className="space-y-4">
            {currentStep === 0 && <NameStep control={nameForm.control} />}
            {currentStep === 1 && <ContactStep control={contactForm.control} />}
            {currentStep === 2 && <BillingStep control={billingForm.control} />}
            {currentStep === 3 && <PasswordStep control={passwordForm.control} />}
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={previous}
          disabled={currentStep === 0 || isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button 
            type="button" 
            onClick={next}
            className="bg-dk-navy hover:bg-dk-blue"
          >
            Suivant <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={finalSubmit}
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
        )}
      </CardFooter>
    </Card>
  );
};

export default MultiStepSignUpForm;
