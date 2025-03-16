
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Clock, CalendarIcon, Calculator } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { OrderState, Vehicle, Contact } from "@/types/order";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateQuotePDF } from "@/utils/pdfGenerator";
import { Json } from "@/integrations/supabase/types";

interface UnifiedOrderFormProps {
  orderDetails: OrderState;
}

export const UnifiedOrderForm = ({
  orderDetails
}: UnifiedOrderFormProps) => {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState<Date | undefined>(orderDetails.pickupDate);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(orderDetails.deliveryDate);
  const [pickupTime, setPickupTime] = useState(orderDetails.pickupTime || "08:00");
  const [deliveryTime, setDeliveryTime] = useState(orderDetails.deliveryTime || "08:00");
  const [pickupContact, setPickupContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [deliveryContact, setDeliveryContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [vehicleFormsValidity, setVehicleFormsValidity] = useState<boolean[]>([]);

  const validateContact = (contact: Contact): boolean => {
    return !!(contact.firstName && 
      contact.lastName && 
      contact.email && 
      contact.phone && 
      contact.email.includes('@') && 
      contact.phone.length >= 10);
  };

  const isFormValid = (): boolean => {
    return !!(pickupDate && 
      deliveryDate && 
      pickupTime && 
      deliveryTime && 
      validateContact(pickupContact) && 
      validateContact(deliveryContact) && 
      vehicles.length > 0 && 
      vehicleFormsValidity.some(v => v));
  };

  const handleVehicleValidityChange = (index: number, isValid: boolean) => {
    setVehicleFormsValidity(prev => {
      const newValidity = [...prev];
      newValidity[index] = isValid;
      return newValidity;
    });
  };

  const handleVehicleUpdate = (index: number, vehicle: Vehicle) => {
    setVehicles(prev => {
      const newVehicles = [...prev];
      newVehicles[index] = vehicle;
      return newVehicles;
    });
  };

  const handleDeleteVehicle = (indexToDelete: number) => {
    setVehicleCount(prev => prev - 1);
    setVehicleFormsValidity(prev => prev.filter((_, i) => i !== indexToDelete));
    setVehicles(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    try {
      if (!isFormValid()) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }

      const pickupDateStr = pickupDate?.toISOString().split('T')[0];
      const deliveryDateStr = deliveryDate?.toISOString().split('T')[0];
      const totalPriceHT = 150;
      const totalPriceTTC = totalPriceHT * 1.20;

      const { data: quoteNumber } = await supabase.rpc('generate_quote_number');

      // Cast contacts to Json type for database storage
      const pickupContactJson = pickupContact as unknown as Json;
      const deliveryContactJson = deliveryContact as unknown as Json;

      const orderData = {
        quote_number: quoteNumber,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        pickup_address: orderDetails.pickupAddress,
        delivery_address: orderDetails.deliveryAddress,
        vehicles: vehicles as unknown as Json,
        total_price_ht: totalPriceHT,
        total_price_ttc: totalPriceTTC,
        distance: orderDetails.distance.toString(),
        pickup_date: pickupDateStr,
        delivery_date: deliveryDateStr,
        pickup_time: pickupTime,
        delivery_time: deliveryTime,
        pickup_contact: pickupContactJson,
        delivery_contact: deliveryContactJson,
        status: 'pending' as const
      };

      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert(orderData)
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Convert the stored Json back to Contact type for the quote object
      const quote = {
        id: quoteData.id,
        quote_number: quoteData.quote_number,
        pickupAddress: orderDetails.pickupAddress,
        deliveryAddress: orderDetails.deliveryAddress,
        vehicles,
        totalPriceHT,
        totalPriceTTC,
        distance: orderDetails.distance,
        status: quoteData.status as 'pending' | 'accepted' | 'rejected',
        dateCreated: new Date(quoteData.date_created),
        pickupDate: pickupDate as Date,
        pickupTime,
        deliveryDate: deliveryDate as Date,
        deliveryTime,
        pickupContact: quoteData.pickup_contact as unknown as Contact,
        deliveryContact: quoteData.delivery_contact as unknown as Contact
      };

      generateQuotePDF(quote);
      
      toast({
        title: "Devis créé avec succès",
        description: "Le PDF a été généré et téléchargé"
      });

      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du devis",
        variant: "destructive"
      });
    }
  };

  const canSubmit = isFormValid();

  return <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold">Détails de prise en charge</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Adresse de prise en charge</Label>
              <p className="mt-1 text-gray-600">{orderDetails.pickupAddress}</p>
            </div>

            <div className="space-y-2">
              <Label>Date de prise en charge</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !pickupDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP", {
                    locale: fr
                  }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} disabled={date => date < new Date()} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Heure de prise en charge</Label>
              <div className="relative mt-1">
                <Input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="pl-10" />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact pour la prise en charge</Label>
              <Input placeholder="Prénom" value={pickupContact.firstName} onChange={e => setPickupContact({
              ...pickupContact,
              firstName: e.target.value
            })} className="mb-2" />
              <Input placeholder="Nom" value={pickupContact.lastName} onChange={e => setPickupContact({
              ...pickupContact,
              lastName: e.target.value
            })} className="mb-2" />
              <Input type="email" placeholder="Email" value={pickupContact.email} onChange={e => setPickupContact({
              ...pickupContact,
              email: e.target.value
            })} className={cn("mb-2", !validateEmail(pickupContact.email) && pickupContact.email && "border-red-500")} />
              <Input placeholder="Téléphone" value={pickupContact.phone} onChange={e => setPickupContact({
              ...pickupContact,
              phone: e.target.value
            })} className={cn(!validatePhone(pickupContact.phone) && pickupContact.phone && "border-red-500")} />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold">Détails de livraison</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Adresse de livraison</Label>
              <p className="mt-1 text-gray-600">{orderDetails.deliveryAddress}</p>
            </div>

            <div className="space-y-2">
              <Label>Date de livraison</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP", {
                    locale: fr
                  }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} disabled={date => date < (pickupDate || new Date())} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Heure de livraison</Label>
              <div className="relative mt-1">
                <Input type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className="pl-10" />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact pour la livraison</Label>
              <Input placeholder="Prénom" value={deliveryContact.firstName} onChange={e => setDeliveryContact({
              ...deliveryContact,
              firstName: e.target.value
            })} className="mb-2" />
              <Input placeholder="Nom" value={deliveryContact.lastName} onChange={e => setDeliveryContact({
              ...deliveryContact,
              lastName: e.target.value
            })} className="mb-2" />
              <Input type="email" placeholder="Email" value={deliveryContact.email} onChange={e => setDeliveryContact({
              ...deliveryContact,
              email: e.target.value
            })} className={cn("mb-2", !validateEmail(deliveryContact.email) && deliveryContact.email && "border-red-500")} />
              <Input placeholder="Téléphone" value={deliveryContact.phone} onChange={e => setDeliveryContact({
              ...deliveryContact,
              phone: e.target.value
            })} className={cn(!validatePhone(deliveryContact.phone) && deliveryContact.phone && "border-red-500")} />
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <VehiclesSection vehicleCount={vehicleCount} vehicleFormsValidity={vehicleFormsValidity} onVehicleValidityChange={handleVehicleValidityChange} onDeleteVehicle={handleDeleteVehicle} onVehicleUpdate={handleVehicleUpdate} setVehicleCount={setVehicleCount} />

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              <Calculator className="h-4 w-4" />
              Générer le devis
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

