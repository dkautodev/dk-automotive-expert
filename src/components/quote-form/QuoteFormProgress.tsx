import React from 'react';
import { MapPin, Car, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteFormProgressProps {
  currentStep: number;
}

const QuoteFormProgress = ({ currentStep }: QuoteFormProgressProps) => {
  const steps = [
    { number: 1, title: "Adresses", shortTitle: "Adresses", icon: MapPin },
    { number: 2, title: "Véhicule", shortTitle: "Véhicule", icon: Car },
    { number: 3, title: "Contact", shortTitle: "Contact", icon: User }
  ];

  return (
    <div className="w-full mb-6 md:mb-8">
      {/* Desktop version */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
        {/* Active progress line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-dk-navy transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-dk-navy text-white",
                  isCurrent && "bg-dk-navy text-white ring-4 ring-dk-navy/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-border"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span 
                className={cn(
                  "mt-3 text-sm font-medium transition-colors",
                  isCurrent && "text-dk-navy",
                  isCompleted && "text-dk-navy",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-dk-navy text-white",
                    isCurrent && "bg-dk-navy text-white ring-2 ring-dk-navy/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    isCurrent && "text-dk-navy",
                    isCompleted && "text-dk-navy",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.shortTitle}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    currentStep > step.number ? "bg-dk-navy" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default QuoteFormProgress;
