
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, RotateCcw } from 'lucide-react';

interface MissionTypeStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
}

const MissionTypeStep = ({ form, onNext }: MissionTypeStepProps) => {
  const handleSelect = (type: 'livraison' | 'restitution') => {
    form.setValue('mission_type', type);
    onNext({ mission_type: type });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Type de mission</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            form.watch('mission_type') === 'livraison' ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => handleSelect('livraison')}
        >
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Truck className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Livraison</h3>
            <p className="text-muted-foreground">
              Transport de votre véhicule vers une destination
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            form.watch('mission_type') === 'restitution' ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => handleSelect('restitution')}
        >
          <CardContent className="flex flex-col items-center p-6 text-center">
            <RotateCcw className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Restitution</h3>
            <p className="text-muted-foreground">
              Retour de votre véhicule à son point d'origine
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionTypeStep;
