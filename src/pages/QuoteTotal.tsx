
import { useLocation, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Car, Users, FileText, EuroIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const orderDetails = location.state as OrderState | null;
  const [newFiles, setNewFiles] = useState<{ [key: number]: File[] }>({});

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

  const totalPriceHT = Number(orderDetails.priceHT) * orderDetails.vehicles.length;

  return (
    <div className="p-6 space-y-6">
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
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Contacts</h3>
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
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Véhicules à livrer</h3>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <EuroIcon className="h-5 w-5 text-blue-500" />
            <p className="text-xl font-semibold">Prix Total HT: {totalPriceHT}€</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteTotal;
