
import React from 'react';

interface QuoteFormProgressProps {
  currentStep: number;
}

const QuoteFormProgress: React.FC<QuoteFormProgressProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between mb-4">
      <div className={`h-2 bg-gray-200 rounded-full flex-1 mr-2 ${currentStep >= 1 ? 'bg-[#1a237e]' : ''}`}></div>
      <div className={`h-2 bg-gray-200 rounded-full flex-1 mr-2 ${currentStep >= 2 ? 'bg-[#1a237e]' : ''}`}></div>
      <div className={`h-2 bg-gray-200 rounded-full flex-1 ${currentStep >= 3 ? 'bg-[#1a237e]' : ''}`}></div>
    </div>
  );
};

export default QuoteFormProgress;
