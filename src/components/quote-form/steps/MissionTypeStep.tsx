
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="livraison" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Livraison de véhicule
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="restitution" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Restitution de véhicule
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end mt-6">
        <Button type="button" onClick={handleNext} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default MissionTypeStep;
