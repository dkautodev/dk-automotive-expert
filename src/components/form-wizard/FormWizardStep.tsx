
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

interface FormWizardStepProps {
  form: UseFormReturn<any>;
  children: ReactNode;
}

const FormWizardStep = ({ form, children }: FormWizardStepProps) => {
  return (
    <Form {...form}>
      <form className="space-y-4">
        {children}
      </form>
    </Form>
  );
};

export default FormWizardStep;
