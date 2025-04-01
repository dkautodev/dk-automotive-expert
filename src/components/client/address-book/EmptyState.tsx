
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddContact: () => void;
  hasContacts: boolean;
}

export const EmptyState = ({ onAddContact, hasContacts }: EmptyStateProps) => {
  return (
    <div className="text-center p-8">
      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {hasContacts 
          ? "Aucun contact ne correspond à votre recherche"
          : "Votre carnet d'adresses est vide"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasContacts 
          ? "Essayez avec d'autres termes de recherche ou ajoutez un nouveau contact."
          : "Commencez par ajouter votre premier contact pour simplifier vos futures missions."}
      </p>
      <div className="mt-6">
        <Button onClick={onAddContact} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Ajouter un contact</span>
        </Button>
      </div>
    </div>
  );
};
