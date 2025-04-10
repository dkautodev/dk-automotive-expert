
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface TermsSectionProps {
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
  isClient: boolean;
}

const TermsSection: React.FC<TermsSectionProps> = ({ 
  termsAccepted = false, 
  onTermsChange,
  isClient
}) => {
  if (!isClient || !onTermsChange) return null;
  
  return (
    <div className="flex items-start space-x-2 mt-4">
      <Checkbox 
        id="terms" 
        checked={termsAccepted} 
        onCheckedChange={(checked) => onTermsChange(checked === true)}
        className="mt-1"
      />
      <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
        En cliquant sur "Créer la mission", vous reconnaissez avoir lu et accepté les{" "}
        <Link to="/cgv" target="_blank" className="text-blue-500 hover:underline">
          Conditions Générales de Vente
        </Link>
      </label>
    </div>
  );
};

export default TermsSection;
