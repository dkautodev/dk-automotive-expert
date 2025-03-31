
import { useState, useEffect } from 'react';
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, FileCheck, FileMinus, FileWarning } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type DocumentType = 'kbis' | 'driving_license' | 'id_card' | 'vigilance_certificate';

interface Document {
  id: string;
  document_type: DocumentType;
  document_url: string;
  uploaded_at: string;
}

const documentConfig = {
  'kbis': {
    title: 'Extrait Kbis',
    description: 'Document officiel prouvant l\'existence légale de l\'entreprise',
    icon: FileCheck
  },
  'driving_license': {
    title: 'Permis de conduire',
    description: 'Permis de conduire en cours de validité',
    icon: FileCheck
  },
  'id_card': {
    title: 'Carte d\'identité',
    description: 'Carte d\'identité ou passeport en cours de validité',
    icon: FileCheck
  },
  'vigilance_certificate': {
    title: 'Attestation de vigilance',
    description: 'Attestation de vigilance URSSAF à jour',
    icon: FileCheck
  }
};

const DriverDocuments = () => {
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<DocumentType | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setDocuments(data as Document[] || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Impossible de récupérer vos documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user?.id}/${documentType}.${fileExt}`;
    
    try {
      setUploading(documentType);
      
      // Upload file to storage
      const { error: uploadError, data } = await supabase
        .storage
        .from('driver_documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('driver_documents')
        .getPublicUrl(filePath);
      
      // Check if document already exists
      const { data: existingDoc } = await supabase
        .from('documents')
        .select()
        .eq('user_id', user?.id)
        .eq('document_type', documentType)
        .maybeSingle();

      // Save or update document reference in database
      if (existingDoc) {
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            document_url: urlData.publicUrl,
            uploaded_at: new Date().toISOString()
          })
          .eq('id', existingDoc.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            user_id: user?.id,
            document_type: documentType,
            document_url: urlData.publicUrl
          });
          
        if (insertError) throw insertError;
      }
      
      // Refresh documents list
      fetchDocuments();
      toast.success('Document téléchargé avec succès');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erreur lors du téléchargement du document');
    } finally {
      setUploading(null);
      // Reset file input
      e.target.value = '';
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      
      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast.success('Document supprimé avec succès');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };

  const getDocumentByType = (type: DocumentType) => {
    return documents.find(doc => doc.document_type === type);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes documents</h1>
        <p className="text-muted-foreground">Gérez les documents requis pour votre activité</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.entries(documentConfig) as [DocumentType, typeof documentConfig[DocumentType]][]).map(([docType, config]) => {
            const existingDoc = getDocumentByType(docType);
            const isUploading = uploading === docType;
            const DocumentIcon = config.icon;
            
            return (
              <Card key={docType} className={existingDoc ? "border-green-200" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentIcon className={existingDoc ? "text-green-500" : "text-muted-foreground"} />
                    {config.title}
                  </CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {existingDoc ? (
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <FileCheck className="h-4 w-4" />
                          <span>Document téléchargé le {new Date(existingDoc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(existingDoc.document_url, '_blank')}
                          >
                            Voir
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce document ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteDocument(existingDoc.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <div className="relative mt-2 md:mt-0">
                            <input
                              type="file"
                              id={`replace-${docType}`}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => uploadDocument(e, docType)}
                              disabled={isUploading}
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <><Loader className="h-3 w-3 mr-1" /> Téléchargement...</>
                              ) : (
                                <><Upload className="h-4 w-4 mr-1" /> Remplacer</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <FileWarning className="h-4 w-4" />
                          <span>Document requis - Non téléchargé</span>
                        </div>

                        <div>
                          <Label 
                            htmlFor={`upload-${docType}`} 
                            className="block w-full cursor-pointer text-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                          >
                            {isUploading ? (
                              <span className="flex items-center justify-center">
                                <Loader className="h-4 w-4 mr-2" /> Téléchargement...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Upload className="h-4 w-4 mr-2" /> Télécharger un document
                              </span>
                            )}
                          </Label>
                          <input
                            type="file"
                            id={`upload-${docType}`}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => uploadDocument(e, docType)}
                            disabled={isUploading}
                          />
                          <p className="mt-2 text-xs text-muted-foreground text-center">
                            Formats acceptés : PDF, JPG, PNG
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverDocuments;
