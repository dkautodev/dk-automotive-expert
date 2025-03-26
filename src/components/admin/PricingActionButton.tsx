
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';

interface PricingActionButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

const PricingActionButton: React.FC<PricingActionButtonProps> = ({
  isEditing,
  onEdit,
  onSave,
}) => {
  if (isEditing) {
    return (
      <Button 
        onClick={onSave}
        size="sm"
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Enregistrer
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={onEdit}
      variant="outline" 
      size="sm"
      className="gap-2"
    >
      <Edit className="h-4 w-4" />
      Modifier
    </Button>
  );
};

export default PricingActionButton;
