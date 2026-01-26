import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Car, User, MapPin, Calendar, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
const FUEL_OPTIONS = [{
  value: 'essence',
  label: 'Essence'
}, {
  value: 'diesel',
  label: 'Diesel'
}, {
  value: 'hybride',
  label: 'Hybride'
}, {
  value: 'electrique',
  label: 'Électrique'
}, {
  value: 'gpl',
  label: 'GPL'
}, {
  value: 'autre',
  label: 'Autre'
}];
const TIME_QUARTER_HOURS = ['00', '15', '30', '45'];
interface QuoteData {
  pickup_address?: string;
  delivery_address?: string;
  vehicle_type?: string;
  brand?: string;
  model?: string;
  year?: string;
  fuel?: string;
  licensePlate?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  distance?: string;
  price_ht?: string;
  price_ttc?: string;
  additionalInfo?: string;
}
interface FormData {
  // Dates & Times
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  // Vehicle
  vehicleType: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  vin: string;
  // Client
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Pickup Contact
  pickupContactName: string;
  pickupContactPhone: string;
  // Delivery Contact
  deliveryContactName: string;
  deliveryContactPhone: string;
  // Notes
  additionalInfo: string;
}
const PreCommande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quoteData = location.state as QuoteData | null;
  const [isProcessing, setIsProcessing] = useState(false);

  // Time state - separated into hours and minutes for time slots
  const [pickupStartHour, setPickupStartHour] = useState('09');
  const [pickupStartMinute, setPickupStartMinute] = useState('00');
  const [pickupEndHour, setPickupEndHour] = useState('11');
  const [pickupEndMinute, setPickupEndMinute] = useState('00');
  const [deliveryStartHour, setDeliveryStartHour] = useState('14');
  const [deliveryStartMinute, setDeliveryStartMinute] = useState('00');
  const [deliveryEndHour, setDeliveryEndHour] = useState('17');
  const [deliveryEndMinute, setDeliveryEndMinute] = useState('00');
  const [formData, setFormData] = useState<FormData>({
    pickupDate: '',
    pickupTimeStart: '09:00',
    pickupTimeEnd: '11:00',
    deliveryDate: '',
    deliveryTimeStart: '14:00',
    deliveryTimeEnd: '17:00',
    vehicleType: quoteData?.vehicle_type || '',
    brand: quoteData?.brand || '',
    model: quoteData?.model || '',
    year: quoteData?.year || '',
    fuel: quoteData?.fuel || '',
    licensePlate: quoteData?.licensePlate || '',
    vin: '',
    company: quoteData?.company || '',
    firstName: quoteData?.firstName || '',
    lastName: quoteData?.lastName || '',
    email: quoteData?.email || '',
    phone: quoteData?.phone || '',
    pickupContactName: '',
    pickupContactPhone: '',
    deliveryContactName: '',
    deliveryContactPhone: '',
    additionalInfo: quoteData?.additionalInfo || ''
  });

  // Sync time with formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pickupTimeStart: `${pickupStartHour}:${pickupStartMinute}`,
      pickupTimeEnd: `${pickupEndHour}:${pickupEndMinute}`,
      deliveryTimeStart: `${deliveryStartHour}:${deliveryStartMinute}`,
      deliveryTimeEnd: `${deliveryEndHour}:${deliveryEndMinute}`
    }));
  }, [pickupStartHour, pickupStartMinute, pickupEndHour, pickupEndMinute, deliveryStartHour, deliveryStartMinute, deliveryEndHour, deliveryEndMinute]);

  // Calculate TVA (20%)
  const priceHT = parseFloat(quoteData?.price_ht || '0');
  const priceTTC = parseFloat(quoteData?.price_ttc || '0');
  const tva = priceTTC - priceHT;
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate hours array 00-23
  const hours = Array.from({
    length: 24
  }, (_, i) => i.toString().padStart(2, '0'));
  const handlePayment = async () => {
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Veuillez remplir les informations de contact');
      return;
    }
    if (!formData.pickupDate || !formData.deliveryDate) {
      toast.error('Veuillez sélectionner les dates de départ et d\'arrivée');
      return;
    }

    // Validate required vehicle fields
    if (!formData.brand || !formData.model || !formData.fuel || !formData.licensePlate) {
      toast.error('Veuillez remplir les champs véhicule obligatoires (marque, modèle, carburant, immatriculation)');
      return;
    }
    setIsProcessing(true);
    try {
      const missionData = {
        pickup_address: quoteData?.pickup_address || '',
        delivery_address: quoteData?.delivery_address || '',
        distance_km: parseFloat(quoteData?.distance || '0'),
        price_ht: priceHT,
        price_ttc: priceTTC,
        vehicle_type: formData.vehicleType,
        vehicle_brand: formData.brand,
        vehicle_model: formData.model,
        vehicle_year: formData.year,
        vehicle_fuel: formData.fuel,
        license_plate: formData.licensePlate,
        vehicle_vin: formData.vin,
        client_name: `${formData.firstName} ${formData.lastName}`,
        client_email: formData.email,
        client_phone: formData.phone,
        client_company: formData.company,
        pickup_date: formData.pickupDate,
        pickup_time: formData.pickupTimeStart,
        pickup_time_end: formData.pickupTimeEnd,
        delivery_date: formData.deliveryDate,
        delivery_time: formData.deliveryTimeStart,
        delivery_time_end: formData.deliveryTimeEnd,
        pickup_contact_name: formData.pickupContactName,
        pickup_contact_phone: formData.pickupContactPhone,
        delivery_contact_name: formData.deliveryContactName,
        delivery_contact_phone: formData.deliveryContactPhone,
        notes: formData.additionalInfo
      };
      const {
        data,
        error
      } = await supabase.functions.invoke('create-mission-payment', {
        body: missionData
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(`Erreur lors de la création du paiement: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  if (!quoteData) {
    return <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 animate-fadeIn">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-dk-navy mb-4">Aucune donnée de devis</h2>
                <p className="text-gray-600 mb-6">
                  Veuillez d'abord remplir le formulaire de devis pour accéder à la pré-commande.
                </p>
                <Button onClick={() => navigate('/devis')} className="bg-dk-navy hover:bg-dk-blue">
                  Retour au formulaire de devis
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 animate-fadeIn">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/devis')} className="mb-6 text-dk-navy hover:text-dk-blue my-[10px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au formulaire de devis
          </Button>

          <h1 className="text-3xl font-bold text-dk-navy mb-8">Finaliser votre pré-commande</h1>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Editable forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trajet (Non-editable) */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Trajet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-500">Départ</span>
                      <p className="font-medium">{quoteData.pickup_address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Arrivée</span>
                      <p className="font-medium">{quoteData.delivery_address}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-500">Distance: </span>
                    <span className="font-semibold text-dk-navy">{quoteData.distance} km</span>
                  </div>
                </CardContent>
              </Card>

              {/* Dates & Heures */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Dates et horaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-dk-navy">Créneau d'enlèvement</h4>
                      <div>
                        <Label htmlFor="pickupDate">Date *</Label>
                        <Input id="pickupDate" type="date" value={formData.pickupDate} onChange={e => handleInputChange('pickupDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Heure début *</Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Select value={pickupStartHour} onValueChange={setPickupStartHour}>
                              <SelectTrigger>
                                <SelectValue placeholder="Heure" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map(h => <SelectItem key={h} value={h}>{h}h</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={pickupStartMinute} onValueChange={setPickupStartMinute}>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_QUARTER_HOURS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Heure fin *</Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Select value={pickupEndHour} onValueChange={setPickupEndHour}>
                              <SelectTrigger>
                                <SelectValue placeholder="Heure" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map(h => <SelectItem key={h} value={h}>{h}h</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={pickupEndMinute} onValueChange={setPickupEndMinute}>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_QUARTER_HOURS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-dk-navy">Créneau de livraison</h4>
                      <div>
                        <Label htmlFor="deliveryDate">Date *</Label>
                        <Input id="deliveryDate" type="date" value={formData.deliveryDate} onChange={e => handleInputChange('deliveryDate', e.target.value)} min={formData.pickupDate || new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Heure début *</Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Select value={deliveryStartHour} onValueChange={setDeliveryStartHour}>
                              <SelectTrigger>
                                <SelectValue placeholder="Heure" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map(h => <SelectItem key={h} value={h}>{h}h</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={deliveryStartMinute} onValueChange={setDeliveryStartMinute}>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_QUARTER_HOURS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Heure fin *</Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Select value={deliveryEndHour} onValueChange={setDeliveryEndHour}>
                              <SelectTrigger>
                                <SelectValue placeholder="Heure" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map(h => <SelectItem key={h} value={h}>{h}h</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={deliveryEndMinute} onValueChange={setDeliveryEndMinute}>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_QUARTER_HOURS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Véhicule */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Véhicule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="brand">Marque *</Label>
                      <Input id="brand" value={formData.brand} onChange={e => handleInputChange('brand', e.target.value)} placeholder="Ex: Peugeot" required />
                    </div>
                    <div>
                      <Label htmlFor="model">Modèle *</Label>
                      <Input id="model" value={formData.model} onChange={e => handleInputChange('model', e.target.value)} placeholder="Ex: 308" required />
                    </div>
                    <div>
                      <Label htmlFor="year">Année</Label>
                      <Input id="year" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} placeholder="Ex: 2023" />
                    </div>
                    <div>
                      <Label htmlFor="fuel">Carburant *</Label>
                      <Select value={formData.fuel} onValueChange={value => handleInputChange('fuel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le carburant" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUEL_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="licensePlate">Immatriculation *</Label>
                      <Input id="licensePlate" value={formData.licensePlate} onChange={e => handleInputChange('licensePlate', e.target.value)} placeholder="Ex: AB-123-CD" required />
                    </div>
                    <div>
                      <Label htmlFor="vin">Numéro VIN</Label>
                      <Input id="vin" value={formData.vin} onChange={e => handleInputChange('vin', e.target.value)} placeholder="Ex: VF3LBHZG8FS000001" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact client */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Vos coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="company">Société (optionnel)</Label>
                      <Input id="company" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input id="firstName" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input id="lastName" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contacts de départ et livraison */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contacts sur place
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-dk-navy">Contact au départ</h4>
                      <div>
                        <Label htmlFor="pickupContactName">Nom complet</Label>
                        <Input id="pickupContactName" value={formData.pickupContactName} onChange={e => handleInputChange('pickupContactName', e.target.value)} placeholder="Nom de la personne sur place" />
                      </div>
                      <div>
                        <Label htmlFor="pickupContactPhone">Téléphone</Label>
                        <Input id="pickupContactPhone" type="tel" value={formData.pickupContactPhone} onChange={e => handleInputChange('pickupContactPhone', e.target.value)} placeholder="Numéro de téléphone" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-dk-navy">Contact à la livraison</h4>
                      <div>
                        <Label htmlFor="deliveryContactName">Nom complet</Label>
                        <Input id="deliveryContactName" value={formData.deliveryContactName} onChange={e => handleInputChange('deliveryContactName', e.target.value)} placeholder="Nom de la personne sur place" />
                      </div>
                      <div>
                        <Label htmlFor="deliveryContactPhone">Téléphone</Label>
                        <Input id="deliveryContactPhone" type="tel" value={formData.deliveryContactPhone} onChange={e => handleInputChange('deliveryContactPhone', e.target.value)} placeholder="Numéro de téléphone" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations complémentaires */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-dk-navy">Informations complémentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-dk-navy" value={formData.additionalInfo} onChange={e => handleInputChange('additionalInfo', e.target.value)} placeholder="Instructions particulières, accès, horaires spéciaux..." />
                </CardContent>
              </Card>
            </div>

            {/* Right column - Payment */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-2 border-green-500">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Paiement sécurisé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Tarifs */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Prix HT:</span>
                        <span className="font-semibold">{priceHT.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">TVA (20%):</span>
                        <span className="text-gray-600">{tva.toFixed(2)} €</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-medium">Prix TTC:</span>
                        <span className="font-bold text-xl text-green-600">{priceTTC.toFixed(2)} €</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment methods info */}
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Moyens de paiement acceptés:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">Carte bancaire</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">PayPal</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">SEPA</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">Apple Pay</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">Google Pay</span>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg" onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Traitement en cours...
                        </> : <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Payer {priceTTC.toFixed(2)} €
                        </>}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Paiement sécurisé par Stripe. Vos données bancaires sont protégées.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default PreCommande;