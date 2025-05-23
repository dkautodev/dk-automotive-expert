
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, RotateCcw } from 'lucide-react';

interface MissionTypeStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
}

const MissionTypeStep = ({ form, onNext }: MissionTypeStepProps) => {
  const handleNext = () => {
    const data = {
      mission_type: form.getValues('mission_type')
    };
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Type de mission</h2>
      
      <FormField
        control={form.control}
        name="mission_type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-dk-navy font-semibold">
              Choisissez le type de service souhaité <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div 
                  className={`flex flex-col items-center space-y-3 p-6 border-2 rounded-lg shadow-sm cursor-pointer transition-colors ${
                    field.value === 'livraison' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    field.onChange('livraison');
                    console.log("Livraison selected");
                  }}
                >
                  <RadioGroupItem value="livraison" id="livraison" className="sr-only" />
                  <div className={`flex flex-col items-center space-y-2 ${field.value === 'livraison' ? 'text-dk-navy' : 'text-gray-500'}`}>
                    <Truck className="h-12 w-12" />
                    <FormLabel htmlFor="livraison" className="text-lg font-medium cursor-pointer text-center">
                      Livraison de véhicule
                    </FormLabel>
                    <p className="text-sm text-center">Transport de votre véhicule vers sa destination</p>
                  </div>
                </div>
                
                <div 
                  className={`flex flex-col items-center space-y-3 p-6 border-2 rounded-lg shadow-sm cursor-pointer transition-colors ${
                    field.value === 'restitution' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    field.onChange('restitution');
                    console.log("Restitution selected");
                  }}
                >
                  <RadioGroupItem value="restitution" id="restitution" className="sr-only" />
                  <div className={`flex flex-col items-center space-y-2 ${field.value === 'restitution' ? 'text-dk-navy' : 'text-gray-500'}`}>
                    <RotateCcw className="h-12 w-12" />
                    <FormLabel htmlFor="restitution" className="text-lg font-medium cursor-pointer text-center">
                      Restitution de véhicule
                    </FormLabel>
                    <p className="text-sm text-center">Retour de votre véhicule à son point d'origine</p>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={handleNext} 
          className="bg-[#1a237e] hover:bg-[#3f51b5]"
          disabled={!form.getValues('mission_type')}
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default MissionTypeStep;
