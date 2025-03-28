
import { CheckCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FormStep } from "./useFormWizard";

interface FormWizardStepperProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const FormWizardStepper = ({ 
  steps, 
  currentStep, 
  onStepClick 
}: FormWizardStepperProps) => {
  const handleStepClick = (index: number) => {
    if (onStepClick && index <= currentStep) {
      onStepClick(index);
    }
  };

  return (
    <div className="px-6 mb-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                    ${onStepClick && index <= currentStep ? 'cursor-pointer' : ''}
                    ${
                      index < currentStep 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentStep 
                          ? 'bg-dk-navy text-white' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  onClick={() => handleStepClick(index)}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{step.description || step.title}</p>
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

export default FormWizardStepper;
