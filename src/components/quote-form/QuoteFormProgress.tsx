
import React from 'react';

interface QuoteFormProgressProps {
  currentStep: number;
}

const QuoteFormProgress = ({ currentStep }: QuoteFormProgressProps) => {
  const steps = [
    { number: 1, title: "Adresses et grille tarifaire" },
    { number: 2, title: "Détails du véhicule" },
    { number: 3, title: "Coordonnées de contact" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700">
              {step.title}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-16 ${
                  currentStep > step.number ? 'bg-[#1a237e]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteFormProgress;
