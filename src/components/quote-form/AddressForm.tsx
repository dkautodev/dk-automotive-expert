
import { UseFormReturn } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuoteFormValues } from './quoteFormSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCommunesByPostalCode, type Commune } from '@/utils/locationService';

interface AddressFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
}

const complementOptions = [{
  value: "aucun",
  label: "Aucun"
}, {
  value: "Appartement",
  label: "Appartement"
}, {
  value: "Étage",
  label: "Étage"
}, {
  value: "Résidence",
  label: "Résidence"
}, {
  value: "Bâtiment",
  label: "Bâtiment"
}, {
  value: "Lieu-dit",
  label: "Lieu-dit"
}, {
  value: "Zone Industrielle",
  label: "Zone Industrielle"
}, {
  value: "Zone Commerciale",
  label: "Zone Commerciale"
}, {
  value: "Centre Commercial",
  label: "Centre Commercial"
}, {
  value: "Parking",
  label: "Parking"
}];

const streetTypeOptions = [
  { value: "Rue", label: "Rue" },
  { value: "Avenue", label: "Avenue" },
  { value: "Boulevard", label: "Boulevard" },
  { value: "Chemin", label: "Chemin" },
  { value: "Impasse", label: "Impasse" },
  { value: "Allée", label: "Allée" },
  { value: "Place", label: "Place" },
  { value: "Route", label: "Route" },
  { value: "Quai", label: "Quai" },
  { value: "Passage", label: "Passage" }
];

const AddressForm = ({
  form,
  onNext,
  onPrevious
}: AddressFormProps) => {
  const [pickupCommunes, setPickupCommunes] = useState<Commune[]>([]);
  const [deliveryCommunes, setDeliveryCommunes] = useState<Commune[]>([]);
  const [isLoadingPickupCommunes, setIsLoadingPickupCommunes] = useState(false);
  const [isLoadingDeliveryCommunes, setIsLoadingDeliveryCommunes] = useState(false);

  useEffect(() => {
    const postalCode = form.watch('pickupPostalCode');
    const fetchPickupCommunes = async () => {
      if (postalCode && postalCode.length === 5) {
        setIsLoadingPickupCommunes(true);
        const communes = await getCommunesByPostalCode(postalCode);
        setPickupCommunes(communes);
        setIsLoadingPickupCommunes(false);
        
        if (communes.length === 1) {
          form.setValue('pickupCity', communes[0].nom);
        }
      } else {
        setPickupCommunes([]);
      }
    };
    
    fetchPickupCommunes();
  }, [form, form.watch('pickupPostalCode')]);

  useEffect(() => {
    const postalCode = form.watch('deliveryPostalCode');
    const fetchDeliveryCommunes = async () => {
      if (postalCode && postalCode.length === 5) {
        setIsLoadingDeliveryCommunes(true);
        const communes = await getCommunesByPostalCode(postalCode);
        setDeliveryCommunes(communes);
        setIsLoadingDeliveryCommunes(false);
        
        if (communes.length === 1) {
          form.setValue('deliveryCity', communes[0].nom);
        }
      } else {
        setDeliveryCommunes([]);
      }
    };
    
    fetchDeliveryCommunes();
  }, [form, form.watch('deliveryPostalCode')]);

  const handleNext = () => {
    const pickupComplement = form.getValues('pickupComplement') ? `, ${form.getValues('pickupComplement')}` : '';
    const deliveryComplement = form.getValues('deliveryComplement') ? `, ${form.getValues('deliveryComplement')}` : '';
    const pickupAddress = `${form.getValues('pickupStreetNumber')} ${form.getValues('pickupStreetType')} ${form.getValues('pickupStreetName')}${pickupComplement}, ${form.getValues('pickupPostalCode')} ${form.getValues('pickupCity')}, ${form.getValues('pickupCountry')}`;
    const deliveryAddress = `${form.getValues('deliveryStreetNumber')} ${form.getValues('deliveryStreetType')} ${form.getValues('deliveryStreetName')}${deliveryComplement}, ${form.getValues('deliveryPostalCode')} ${form.getValues('deliveryCity')}, ${form.getValues('deliveryCountry')}`;

    form.setValue('pickup_address', pickupAddress);
    form.setValue('delivery_address', deliveryAddress);
    const addressData = {
      pickupStreetNumber: form.getValues('pickupStreetNumber'),
      pickupStreetType: form.getValues('pickupStreetType'),
      pickupStreetName: form.getValues('pickupStreetName'),
      pickupComplement: form.getValues('pickupComplement'),
      pickupPostalCode: form.getValues('pickupPostalCode'),
      pickupCity: form.getValues('pickupCity'),
      pickupCountry: form.getValues('pickupCountry'),
      deliveryStreetNumber: form.getValues('deliveryStreetNumber'),
      deliveryStreetType: form.getValues('deliveryStreetType'),
      deliveryStreetName: form.getValues('deliveryStreetName'),
      deliveryComplement: form.getValues('deliveryComplement'),
      deliveryPostalCode: form.getValues('deliveryPostalCode'),
      deliveryCity: form.getValues('deliveryCity'),
      deliveryCountry: form.getValues('deliveryCountry'),
      pickup_address: pickupAddress,
      delivery_address: deliveryAddress
    };
    const pickupFieldsValid = !form.formState.errors.pickupStreetNumber && !form.formState.errors.pickupStreetType && !form.formState.errors.pickupStreetName && !form.formState.errors.pickupPostalCode && !form.formState.errors.pickupCity;
    const deliveryFieldsValid = !form.formState.errors.deliveryStreetNumber && !form.formState.errors.deliveryStreetType && !form.formState.errors.deliveryStreetName && !form.formState.errors.deliveryPostalCode && !form.formState.errors.deliveryCity;
    if (pickupFieldsValid && deliveryFieldsValid) {
      onNext(addressData);
    } else {
      form.trigger(['pickupStreetNumber', 'pickupStreetType', 'pickupStreetName', 'pickupPostalCode', 'pickupCity', 'deliveryStreetNumber', 'deliveryStreetType', 'deliveryStreetName', 'deliveryPostalCode', 'deliveryCity']);
    }
  };

  return <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Adresses de prise en charge et de livraison</h2>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-dk-navy">ADRESSE DE PRISE EN CHARGE</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="pickupStreetNumber" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Numéro de rue <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123" className="bg-[#EEF1FF]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="pickupStreetType" render={({
          field
        }) => <FormItem>
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
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="pickupStreetName" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Nom de la voie <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: des Fleurs" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="pickupComplement" render={({
        field
      }) => <FormItem>
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
            </FormItem>} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="pickupPostalCode" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Code postal <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 75001" className="bg-[#EEF1FF]" {...field} />
                </FormControl>
                {isLoadingPickupCommunes && <div className="text-sm text-gray-500">Chargement des communes...</div>}
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="pickupCity" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Ville <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  {pickupCommunes.length > 1 ? (
                    <Select 
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#EEF1FF]">
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupCommunes.map((commune) => (
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
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="pickupCountry" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Pays <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input defaultValue="France" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <h3 className="text-lg font-semibold text-dk-navy mt-8">ADRESSE DE LIVRAISON</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="deliveryStreetNumber" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Numéro de rue <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123" className="bg-[#EEF1FF]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="deliveryStreetType" render={({
          field
        }) => <FormItem>
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
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="deliveryStreetName" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Nom de la voie <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: des Fleurs" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="deliveryComplement" render={({
        field
      }) => <FormItem>
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
            </FormItem>} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="deliveryPostalCode" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Code postal <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 75001" className="bg-[#EEF1FF]" {...field} />
                </FormControl>
                {isLoadingDeliveryCommunes && <div className="text-sm text-gray-500">Chargement des communes...</div>}
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="deliveryCity" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  Ville <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  {deliveryCommunes.length > 1 ? (
                    <Select 
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#EEF1FF]">
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryCommunes.map((commune) => (
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
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="deliveryCountry" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                Pays <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input defaultValue="France" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious} className="bg-white">
          RETOUR
        </Button>
        <Button type="button" onClick={handleNext} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>;
};
export default AddressForm;

