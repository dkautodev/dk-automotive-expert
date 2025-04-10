
import React from "react";

interface FormActionsProps {
  onSubmit?: () => void;
  onPrevious?: () => void;
  isSubmitting?: boolean;
  isClient: boolean;
  termsAccepted?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onSubmit, 
  onPrevious, 
  isSubmitting = false,
  isClient,
  termsAccepted = false
}) => {
  if (!onSubmit || !onPrevious) return null;

  return (
    <div className="flex justify-between pt-4">
      <button
        type="button"
        onClick={onPrevious}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        disabled={isSubmitting}
      >
        Précédent
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={isSubmitting || (isClient && !termsAccepted)}
      >
        {isSubmitting ? "Traitement en cours..." : "Créer la mission"}
      </button>
    </div>
  );
};

export default FormActions;
