
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import NameStep from "../signup-steps/NameStep";
import ContactStep from "../signup-steps/ContactStep";
import BillingStep from "../signup-steps/BillingStep";
import PasswordStep from "../signup-steps/PasswordStep";
import { 
  NameStepType,
  ContactStepType,
  BillingStepType,
  PasswordStepType
} from "../schemas/signUpStepSchema";

interface StepContentProps {
  currentStep: number;
  nameForm: UseFormReturn<NameStepType>;
  contactForm: UseFormReturn<ContactStepType>;
  billingForm: UseFormReturn<BillingStepType>;
  passwordForm: UseFormReturn<PasswordStepType>;
}

const StepContent = ({ 
  currentStep,
  nameForm,
  contactForm,
  billingForm,
  passwordForm
}: StepContentProps) => {
  return (
    <>
      {currentStep === 0 && (
        <Form {...nameForm}>
          <form className="space-y-4">
            <NameStep control={nameForm.control} />
          </form>
        </Form>
      )}
      
      {currentStep === 1 && (
        <Form {...contactForm}>
          <form className="space-y-4">
            <ContactStep control={contactForm.control} />
          </form>
        </Form>
      )}
      
      {currentStep === 2 && (
        <Form {...billingForm}>
          <form className="space-y-4">
            <BillingStep control={billingForm.control} />
          </form>
        </Form>
      )}
      
      {currentStep === 3 && (
        <Form {...passwordForm}>
          <form className="space-y-4">
            <PasswordStep control={passwordForm.control} />
          </form>
        </Form>
      )}
    </>
  );
};

export default StepContent;
