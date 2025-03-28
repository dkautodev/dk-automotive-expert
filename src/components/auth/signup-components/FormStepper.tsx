
import { CheckCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
}

const stepDescriptions = {
  "name": "Informations personnelles",
  "contact": "Coordonnées de contact",
  "billing": "Informations de facturation",
  "password": "Sécurisation du compte"
};

const FormStepper = ({ steps, currentStep }: FormStepperProps) => {
  return (
    <div className="px-6 mb-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 cursor-pointer ${
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{stepDescriptions[step.id as keyof typeof stepDescriptions] || step.title}</p>
              </TooltipContent>
            </Tooltip>
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
  );
};

export default FormStepper;
