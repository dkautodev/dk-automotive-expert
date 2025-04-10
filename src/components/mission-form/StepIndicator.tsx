
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 4 }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center ${
              stepNumber === currentStep
                ? "bg-primary text-white"
                : stepNumber < currentStep
                ? "bg-primary/20 text-primary"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < totalSteps && (
            <div
              className={`h-1 w-6 ${
                stepNumber < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
