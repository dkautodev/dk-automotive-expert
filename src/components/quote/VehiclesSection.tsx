
import { Car, Plus, X } from "lucide-react";
import { Vehicle } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AddVehicleForm } from "@/components/order/AddVehicleForm";

interface VehiclesSectionProps {
  vehicles: Vehicle[];
  newFiles: { [key: number]: File[] };
  onFileChange: (vehicleIndex: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (vehicleIndex: number, fileIndex: number) => void;
  onDeleteVehicle: (index: number) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  showAddVehicleDialog: boolean;
  setShowAddVehicleDialog: (show: boolean) => void;
}

export const VehiclesSection = ({
  vehicles,
  newFiles,
  onFileChange,
  onRemoveFile,
  onDeleteVehicle,
  onAddVehicle,
  showAddVehicleDialog,
  setShowAddVehicleDialog
}: VehiclesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Car className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Véhicules à livrer</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''}
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
              onSubmit={onAddVehicle}
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
            {vehicles.map((vehicle, index) => (
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
                          onClick={() => onRemoveFile(index, fileIndex)}
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
                        onChange={(e) => onFileChange(index, e)}
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
                        <AlertDialogAction onClick={() => onDeleteVehicle(index)}>
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
  );
};
