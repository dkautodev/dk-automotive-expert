
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { QuoteFormValues } from '../quoteFormSchema';

interface AddressFormLayoutProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
  handleNext: () => void;
  children: React.ReactNode;
}

const AddressFormLayout = ({
  onPrevious,
  handleNext,
  children
}: AddressFormLayoutProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Adresses de prise en charge et de livraison</h2>
      
      <div className="space-y-6">
        {children}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious} className="bg-white">
          RETOUR
        </Button>
        <Button type="button" onClick={handleNext} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default AddressFormLayout;
