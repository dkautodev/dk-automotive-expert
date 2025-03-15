import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Car, Users, FileText, EuroIcon, ArrowLeft, X, Send, Trash2, Plus, UserCog } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactsForm } from "@/components/order/ContactsForm";
import { AddVehicleForm } from "@/components/order/AddVehicleForm";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

interface Vehicle {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  pickupContact: Contact;
  deliveryContact: Contact;
  vehicles: Vehicle[];
  priceHT: string;
}

const QuoteTotal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState(location.state as OrderState | null);
  const [newFiles, setNewFiles] = useState<{ [key: number]: File[] }>({});
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  const handleFileChange = (vehicleIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.type === 'image/jpeg'
      );
      
      if (validFiles.length !== files.length) {
        alert("Seuls les fichiers PDF et JPG sont acceptés.");
      }
      
      setNewFiles(prev => ({
        ...prev,
        [vehicleIndex]: [...(prev[vehicleIndex] || []), ...validFiles]
      }));
    }
  };

  const removeFile = (vehicleIndex: number, fileIndex: number) => {
    setNewFiles(prev => ({
      ...prev,
      [vehicleIndex]: prev[vehicleIndex].filter((_, i) => i !== fileIndex)
    }));
  };

  const handleCancelQuote = () => {
    navigate("/dashboard/client");
  };

  const handleAddVehicle = () => {
    if (orderDetails) {
      const newVehicle: Vehicle = {
        brand: "",
        model: "",
        year: "",
        fuel: "",
        licensePlate: "",
        files: []
      };
      setOrderDetails({
        ...orderDetails,
        vehicles: [...orderDetails.vehicles, newVehicle]
      });
    }
  };

  const handleDeleteVehicle = (index: number) => {
    if (orderDetails) {
      const updatedVehicles = orderDetails.vehicles.filter((_, i) => i !== index);
      setOrderDetails({
        ...orderDetails,
        vehicles: updatedVehicles
      });
      
      const updatedNewFiles = { ...newFiles };
      delete updatedNewFiles[index];
      setNewFiles(updatedNewFiles);
    }
  };

  const handleContactsUpdate = (pickup: Contact, delivery: Contact) => {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        pickupContact: pickup,
        deliveryContact: delivery
      });
    }
  };

  const handleSubmitQuote = () => {
    toast({
      title: "Devis envoyé",
      description: "Votre devis a été envoyé avec succès et est en attente de validation.",
    });
    
    navigate("/dashboard/client");
  };

  const handleAddVehicleSubmit = (newVehicle: Vehicle) => {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        vehicles: [...orderDetails.vehicles, newVehicle]
      });
      setShowAddVehicleDialog(false);
    }
  };

  const totalPriceHT = Number(orderDetails.priceHT) * orderDetails.vehicles.length;

  const generatePDF = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #1a365d; margin-bottom: 20px;">Devis de transport</h1>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Adresses</h2>
          <p><strong>Départ:</strong> ${orderDetails.pickupAddress}</p>
          <p><strong>Livraison:</strong> ${orderDetails.deliveryAddress}</p>
          <p><strong>Distance:</strong> ${orderDetails.distance}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Contacts</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h3>Contact départ</h3>
              <p>${orderDetails.pickupContact.firstName} ${orderDetails.pickupContact.lastName}</p>
              <p>${orderDetails.pickupContact.email}</p>
              <p>${orderDetails.pickupContact.phone}</p>
            </div>
            <div>
              <h3>Contact livraison</h3>
              <p>${orderDetails.deliveryContact.firstName} ${orderDetails.deliveryContact.lastName}</p>
              <p>${orderDetails.deliveryContact.email}</p>
              <p>${orderDetails.deliveryContact.phone}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Véhicules</h2>
          ${orderDetails.vehicles.map(vehicle => `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #e2e8f0;">
              <p><strong>Marque:</strong> ${vehicle.brand}</p>
              <p><strong>Modèle:</strong> ${vehicle.model}</p>
              <p><strong>Année:</strong> ${vehicle.year}</p>
              <p><strong>Carburant:</strong> ${vehicle.fuel}</p>
              <p><strong>Immatriculation:</strong> ${vehicle.licensePlate}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 30px; text-align: right;">
          <h2 style="color: #2c5282;">Prix Total HT: ${totalPriceHT}€</h2>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: 'devis-transport.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Annuler le devis
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Voulez-vous annuler le devis ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les informations saisies seront perdues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, garder le devis</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelQuote}>
                Oui, annuler le devis
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de votre devis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Adresses</h3>
            </div>
            <div className="ml-7 space-y-2">
              <p><span className="font-medium">Départ:</span> {orderDetails.pickupAddress}</p>
              <p><span className="font-medium">Livraison:</span> {orderDetails.deliveryAddress}</p>
              <p><span className="font-medium">Distance:</span> {orderDetails.distance}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Contacts</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserCog className="h-4 w-4" />
                    Modifier les contacts
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Modifier les contacts</DialogTitle>
                  </DialogHeader>
                  <ContactsForm
                    onContactsValid={() => {}}
                    onShowVehicle={() => {}}
                    onContactsUpdate={handleContactsUpdate}
                    initialPickupContact={orderDetails.pickupContact}
                    initialDeliveryContact={orderDetails.deliveryContact}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Contact départ</h4>
                <p>{orderDetails.pickupContact.firstName} {orderDetails.pickupContact.lastName}</p>
                <p>{orderDetails.pickupContact.email}</p>
                <p>{orderDetails.pickupContact.phone}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact livraison</h4>
                <p>{orderDetails.deliveryContact.firstName} {orderDetails.deliveryContact.lastName}</p>
                <p>{orderDetails.deliveryContact.email}</p>
                <p>{orderDetails.deliveryContact.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Car className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Véhicules à livrer</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {orderDetails.vehicles.length} véhicule{orderDetails.vehicles.length > 1 ? 's' : ''}
                </span>
              </div>
              <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un véhicule</DialogTitle>
                  </DialogHeader>
                  <AddVehicleForm
                    onSubmit={handleAddVehicleSubmit}
                    onCancel={() => setShowAddVehicleDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="ml-7">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marque</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Carburant</TableHead>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.vehicles.map((vehicle, index) => (
                    <TableRow key={index}>
                      <TableCell>{vehicle.brand}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.fuel}</TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {vehicle.files.map((file, fileIndex) => (
                            <p key={fileIndex} className="text-sm text-gray-600">{file.name}</p>
                          ))}
                          {newFiles[index]?.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{file.name}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, fileIndex)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          ))}
                          <div>
                            <Label htmlFor={`files-${index}`}>Ajouter des documents</Label>
                            <Input
                              id={`files-${index}`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(index, e)}
                              multiple
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Voulez-vous supprimer ce véhicule ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Toutes les informations concernant ce véhicule seront perdues.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteVehicle(index)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSubmitQuote}
                className="gap-2"
                size="lg"
              >
                <Send className="h-4 w-4" />
                Envoyer votre devis
              </Button>
              <Button
                onClick={generatePDF}
                variant="outline"
                className="gap-2"
                size="lg"
              >
                <FileDown className="h-4 w-4" />
                Générer votre devis
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <EuroIcon className="h-5 w-5 text-blue-500" />
              <p className="text-xl font-semibold">Prix Total HT: {totalPriceHT}€</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteTotal;
