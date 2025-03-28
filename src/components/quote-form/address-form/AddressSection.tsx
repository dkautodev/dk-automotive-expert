
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteFormValues } from '../quoteFormSchema';
import { Commune } from '@/utils/locationService';
import { complementOptions, streetTypeOptions } from './constants';

interface AddressSectionProps {
  title: string;
  form: UseFormReturn<QuoteFormValues>;
  prefix: 'pickup' | 'delivery';
  communes: Commune[];
  isLoadingCommunes: boolean;
}

const AddressSection = ({
  title,
  form,
  prefix,
  communes,
  isLoadingCommunes
}: AddressSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-dk-navy">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          control={form.control} 
          name={`${prefix}StreetNumber`} 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Numéro de rue <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField 
          control={form.control} 
          name={`${prefix}StreetType`} 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Type de voie <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue="Rue"
                >
                  <SelectTrigger className="bg-[#EEF1FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {streetTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField 
        control={form.control} 
        name={`${prefix}StreetName`} 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              Nom de la voie <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Ex: des Fleurs" className="bg-[#EEF1FF]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField 
        control={form.control} 
        name={`${prefix}Complement`} 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              Complément
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="bg-[#EEF1FF]">
                  <SelectValue placeholder="Sélectionner un complément" />
                </SelectTrigger>
                <SelectContent>
                  {complementOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          control={form.control} 
          name={`${prefix}PostalCode`} 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Code postal <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: 75001" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              {isLoadingCommunes && <div className="text-sm text-gray-500">Chargement des communes...</div>}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField 
          control={form.control} 
          name={`${prefix}City`} 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Ville <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                {communes.length > 1 ? (
                  <Select 
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-[#EEF1FF]">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {communes.map((commune) => (
                        <SelectItem key={commune.code} value={commune.nom}>
                          {commune.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input placeholder="Ex: Paris" className="bg-[#EEF1FF]" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField 
        control={form.control} 
        name={`${prefix}Country`} 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              Pays <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input defaultValue="France" className="bg-[#EEF1FF]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressSection;
