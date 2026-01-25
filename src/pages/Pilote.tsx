import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Mission {
  id: string;
  created_at: string;
  updated_at: string;
  pickup_address: string;
  pickup_city: string | null;
  pickup_postal_code: string | null;
  delivery_address: string;
  delivery_city: string | null;
  delivery_postal_code: string | null;
  distance_km: number | null;
  price_ht: number | null;
  price_ttc: number | null;
  vehicle_type: string | null;
  vehicle_brand: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  vehicle_fuel: string | null;
  license_plate: string | null;
  vehicle_vin: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  status: string;
  payment_status: string | null;
  payment_intent_id: string | null;
  notes: string | null;
  pickup_date: string | null;
  pickup_time: string | null;
  pickup_time_end: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  delivery_time_end: string | null;
  pickup_contact_name: string | null;
  pickup_contact_phone: string | null;
  delivery_contact_name: string | null;
  delivery_contact_phone: string | null;
  is_processed: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'En cours', color: 'bg-purple-500' },
  { value: 'completed', label: 'Terminée', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-500' },
];

const paymentStatusOptions = [
  { value: 'unpaid', label: 'Non payé', color: 'bg-red-500' },
  { value: 'pending', label: 'En attente', color: 'bg-yellow-500' },
  { value: 'paid', label: 'Payé', color: 'bg-green-500' },
  { value: 'refunded', label: 'Remboursé', color: 'bg-gray-500' },
];

const statusFilterOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

const Pilote = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isAdminLoading } = useAdminCheck();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Mission>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMissions = missions.filter((mission) => {
    if (statusFilter === 'all') return true;
    return mission.status === statusFilter;
  });

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      toast.error("Accès refusé. Vous devez être administrateur.");
      navigate('/auth');
    }
  }, [isAdmin, isAdminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchMissions();
    }
  }, [isAdmin]);

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des missions:', error);
      toast.error('Erreur lors du chargement des missions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (mission: Mission) => {
    setSelectedMission(mission);
    setEditForm(mission);
    setIsEditDialogOpen(true);
  };

  const handleView = (mission: Mission) => {
    setSelectedMission(mission);
    setIsViewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMission) return;

    try {
      const { error } = await supabase
        .from('missions')
        .update({
          pickup_address: editForm.pickup_address,
          pickup_city: editForm.pickup_city,
          delivery_address: editForm.delivery_address,
          delivery_city: editForm.delivery_city,
          vehicle_type: editForm.vehicle_type,
          vehicle_brand: editForm.vehicle_brand,
          vehicle_model: editForm.vehicle_model,
          vehicle_year: editForm.vehicle_year,
          vehicle_fuel: editForm.vehicle_fuel,
          vehicle_vin: editForm.vehicle_vin,
          license_plate: editForm.license_plate,
          client_name: editForm.client_name,
          client_email: editForm.client_email,
          client_phone: editForm.client_phone,
          client_company: editForm.client_company,
          status: editForm.status,
          payment_status: editForm.payment_status,
          notes: editForm.notes,
          pickup_contact_name: editForm.pickup_contact_name,
          pickup_contact_phone: editForm.pickup_contact_phone,
          delivery_contact_name: editForm.delivery_contact_name,
          delivery_contact_phone: editForm.delivery_contact_phone,
          pickup_time: editForm.pickup_time,
          pickup_time_end: editForm.pickup_time_end,
          delivery_time: editForm.delivery_time,
          delivery_time_end: editForm.delivery_time_end,
        })
        .eq('id', selectedMission.id);

      if (error) throw error;

      toast.success('Mission mise à jour avec succès');
      setIsEditDialogOpen(false);
      fetchMissions();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la mission');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) return;

    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Mission supprimée avec succès');
      fetchMissions();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la mission');
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(o => o.value === status);
    return (
      <Badge className={`${option?.color || 'bg-gray-500'} text-white`}>
        {option?.label || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string | null) => {
    const option = paymentStatusOptions.find(o => o.value === status);
    return (
      <Badge className={`${option?.color || 'bg-gray-500'} text-white`}>
        {option?.label || status || 'Non défini'}
      </Badge>
    );
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour Admin
              </Button>
              <h1 className="text-3xl font-bold text-dk-navy">Gestion des Missions</h1>
            </div>
            <Button onClick={fetchMissions} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Missions commandées ({filteredMissions.length}/{missions.length})</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : filteredMissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {missions.length === 0 ? 'Aucune mission enregistrée pour le moment.' : 'Aucune mission ne correspond au filtre sélectionné.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Trajet</TableHead>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Prix TTC</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMissions.map((mission) => (
                        <TableRow key={mission.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(mission.created_at).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{mission.client_name}</div>
                            <div className="text-sm text-gray-500">{mission.client_email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">De: {mission.pickup_city || mission.pickup_address}</div>
                              <div>À: {mission.delivery_city || mission.delivery_address}</div>
                              {mission.distance_km && (
                                <div className="text-gray-500">{mission.distance_km} km</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {mission.vehicle_brand} {mission.vehicle_model}
                              {mission.license_plate && (
                                <div className="text-gray-500">{mission.license_plate}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {mission.price_ttc ? `${mission.price_ttc.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(mission.status)}</TableCell>
                          <TableCell>{getPaymentBadge(mission.payment_status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleView(mission)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(mission)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(mission.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la mission</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Client</h3>
                  <p><strong>Nom:</strong> {selectedMission.client_name}</p>
                  <p><strong>Email:</strong> {selectedMission.client_email}</p>
                  <p><strong>Téléphone:</strong> {selectedMission.client_phone || '-'}</p>
                  <p><strong>Entreprise:</strong> {selectedMission.client_company || '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Véhicule</h3>
                  <p><strong>Type:</strong> {selectedMission.vehicle_type || '-'}</p>
                  <p><strong>Marque:</strong> {selectedMission.vehicle_brand || '-'}</p>
                  <p><strong>Modèle:</strong> {selectedMission.vehicle_model || '-'}</p>
                  <p><strong>Année:</strong> {selectedMission.vehicle_year || '-'}</p>
                  <p><strong>Carburant:</strong> {selectedMission.vehicle_fuel || '-'}</p>
                  <p><strong>Immatriculation:</strong> {selectedMission.license_plate || '-'}</p>
                  <p><strong>VIN:</strong> {selectedMission.vehicle_vin || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Enlèvement</h3>
                  <p>{selectedMission.pickup_address}</p>
                  <p>{selectedMission.pickup_postal_code} {selectedMission.pickup_city}</p>
                  {selectedMission.pickup_date && (
                    <p className="mt-2">
                      <strong>Date:</strong> {new Date(selectedMission.pickup_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {selectedMission.pickup_time && (
                    <p>
                      <strong>Créneau:</strong> {selectedMission.pickup_time}
                      {selectedMission.pickup_time_end && ` - ${selectedMission.pickup_time_end}`}
                    </p>
                  )}
                  {selectedMission.pickup_contact_name && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      <p><strong>Contact:</strong> {selectedMission.pickup_contact_name}</p>
                      {selectedMission.pickup_contact_phone && (
                        <p><strong>Tél:</strong> {selectedMission.pickup_contact_phone}</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Livraison</h3>
                  <p>{selectedMission.delivery_address}</p>
                  <p>{selectedMission.delivery_postal_code} {selectedMission.delivery_city}</p>
                  {selectedMission.delivery_date && (
                    <p className="mt-2">
                      <strong>Date:</strong> {new Date(selectedMission.delivery_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {selectedMission.delivery_time && (
                    <p>
                      <strong>Créneau:</strong> {selectedMission.delivery_time}
                      {selectedMission.delivery_time_end && ` - ${selectedMission.delivery_time_end}`}
                    </p>
                  )}
                  {selectedMission.delivery_contact_name && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      <p><strong>Contact:</strong> {selectedMission.delivery_contact_name}</p>
                      {selectedMission.delivery_contact_phone && (
                        <p><strong>Tél:</strong> {selectedMission.delivery_contact_phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Distance</h3>
                  <p>{selectedMission.distance_km ? `${selectedMission.distance_km} km` : '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Prix HT</h3>
                  <p>{selectedMission.price_ht ? `${selectedMission.price_ht.toFixed(2)} €` : '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Prix TTC</h3>
                  <p className="text-lg font-bold">{selectedMission.price_ttc ? `${selectedMission.price_ttc.toFixed(2)} €` : '-'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Statut</h3>
                  {getStatusBadge(selectedMission.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Paiement</h3>
                  {getPaymentBadge(selectedMission.payment_status)}
                </div>
              </div>
              {selectedMission.notes && (
                <div>
                  <h3 className="font-semibold text-dk-navy mb-2">Notes</h3>
                  <p className="whitespace-pre-wrap">{selectedMission.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la mission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Section Client */}
            <div>
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">👤 Client</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom client</label>
                    <Input
                      value={editForm.client_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      value={editForm.client_email || ''}
                      onChange={(e) => setEditForm({ ...editForm, client_email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      value={editForm.client_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, client_phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Entreprise</label>
                    <Input
                      value={editForm.client_company || ''}
                      onChange={(e) => setEditForm({ ...editForm, client_company: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Départ */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">🚗 Départ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse d'enlèvement</label>
                  <Input
                    value={editForm.pickup_address || ''}
                    onChange={(e) => setEditForm({ ...editForm, pickup_address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du contact</label>
                    <Input
                      value={editForm.pickup_contact_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, pickup_contact_name: e.target.value })}
                      placeholder="Nom du contact au départ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone du contact</label>
                    <Input
                      value={editForm.pickup_contact_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, pickup_contact_phone: e.target.value })}
                      placeholder="Téléphone du contact"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure début créneau</label>
                    <Input
                      type="time"
                      value={editForm.pickup_time || ''}
                      onChange={(e) => setEditForm({ ...editForm, pickup_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure fin créneau</label>
                    <Input
                      type="time"
                      value={editForm.pickup_time_end || ''}
                      onChange={(e) => setEditForm({ ...editForm, pickup_time_end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section Livraison */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">📍 Livraison</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse de livraison</label>
                  <Input
                    value={editForm.delivery_address || ''}
                    onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du contact</label>
                    <Input
                      value={editForm.delivery_contact_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, delivery_contact_name: e.target.value })}
                      placeholder="Nom du contact à la livraison"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone du contact</label>
                    <Input
                      value={editForm.delivery_contact_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, delivery_contact_phone: e.target.value })}
                      placeholder="Téléphone du contact"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure début créneau</label>
                    <Input
                      type="time"
                      value={editForm.delivery_time || ''}
                      onChange={(e) => setEditForm({ ...editForm, delivery_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure fin créneau</label>
                    <Input
                      type="time"
                      value={editForm.delivery_time_end || ''}
                      onChange={(e) => setEditForm({ ...editForm, delivery_time_end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Véhicule */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">🚙 Véhicule</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marque</label>
                    <Input
                      value={editForm.vehicle_brand || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Modèle</label>
                    <Input
                      value={editForm.vehicle_model || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Année</label>
                    <Input
                      value={editForm.vehicle_year || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_year: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Carburant</label>
                    <Input
                      value={editForm.vehicle_fuel || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_fuel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <Input
                      value={editForm.vehicle_type || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_type: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Immatriculation</label>
                    <Input
                      value={editForm.license_plate || ''}
                      onChange={(e) => setEditForm({ ...editForm, license_plate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro VIN</label>
                    <Input
                      value={editForm.vehicle_vin || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicle_vin: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Tarification (lecture seule) */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">💰 Tarification</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Distance (km)</label>
                  <Input
                    type="number"
                    value={editForm.distance_km || ''}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix HT (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.price_ht || ''}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix TTC (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.price_ttc || ''}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section Statuts */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">📋 Statuts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut mission</label>
                  <Select
                    value={editForm.status || 'pending'}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut paiement</label>
                  <Select
                    value={editForm.payment_status || 'unpaid'}
                    onValueChange={(value) => setEditForm({ ...editForm, payment_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section Notes */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-dk-navy mb-3 text-lg">📝 Notes</h3>
              <Textarea
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Pilote;
