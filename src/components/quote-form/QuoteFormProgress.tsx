
import React from 'react';

interface QuoteFormProgressProps {
  currentStep: number;
}

const QuoteFormProgress = ({ currentStep }: QuoteFormProgressProps) => {
  const steps = [
    { number: 1, title: "Adresses & Véhicule" },
    { number: 2, title: "Détails du véhicule" },
    { number: 3, title: "Contact" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-[#1a237e] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <span className="mt-2 text-xs text-gray-600 text-center max-w-24">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-4 ${
                  currentStep > step.number ? 'bg-[#1a237e]' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QuoteFormProgress;
