import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DocumentType } from "@/types/database";

interface Document {
  id: string;
  document_type: DocumentType;
  document_url: string;
  uploaded_at: string;
}

interface DocumentTypeInfo {
  id: DocumentType;
  name: string;
  description: string;
}

const documentTypes: DocumentTypeInfo[] = [
  { 
    id: "id_card", 
    name: "Carte d'identité", 
    description: "Pièce d'identité en cours de validité" 
  },
  { 
    id: "driving_license", 
    name: "Permis de conduire", 
    description: "Permis de conduire en cours de validité" 
  },
  { 
    id: "kbis", 
    name: "Extrait Kbis", 
    description: "Document officiel attestant de l'existence juridique de l'entreprise" 
  },
  { 
    id: "vigilance_certificate", 
    name: "Attestation de vigilance", 
    description: "Document attestant que vous êtes à jour de vos cotisations sociales" 
  }
];

const DriverDocuments = () => {
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDriverDocuments();
    }
  }, [user]);

  const fetchDriverDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux. Taille maximale: 5 Mo");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format de fichier non supporté. Formats acceptés: PDF, JPEG, PNG");
      return;
    }

    setUploadingFile(file);
    setSelectedDocType(documentType);
    setOpenDialog(true);
  };

  const uploadDocument = async () => {
    if (!uploadingFile || !selectedDocType || !user) return;

    try {
      setUploading(selectedDocType);
      setUploadProgress(10);

      // Upload to storage
      const fileName = `${user.id}-${selectedDocType}-${Date.now()}.${uploadingFile.name.split('.').pop()}`;
      const filePath = `documents/${fileName}`;
      
      setUploadProgress(30);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("documents")
        .upload(filePath, uploadingFile, {
          upsert: true,
        });

      if (uploadError) throw uploadError;
      
      setUploadProgress(60);
      
      // Get public URL
      const { data: publicURLData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicURL = publicURLData?.publicUrl;
      
      setUploadProgress(80);

      // Save document reference in database
      const { error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          document_type: selectedDocType,
          document_url: publicURL
        });

      if (insertError) throw insertError;
      
      setUploadProgress(100);
      
      toast.success("Document uploadé avec succès");
      fetchDriverDocuments();
      setOpenDialog(false);
      setUploadingFile(null);
      setSelectedDocType(null);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Erreur lors de l'upload du document");
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;
      
      toast.success("Document supprimé avec succès");
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes documents</h1>
        <p className="text-muted-foreground">Gérez vos documents importants</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-4">
          {documentTypes.map((docType) => {
            const uploadedDocument = documents.find(doc => doc.document_type === docType.id);
            
            return (
              <Card key={docType.id}>
                <CardHeader className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">{docType.name}</CardTitle>
                    <CardDescription>{docType.description}</CardDescription>
                  </div>
                  
                  {uploadedDocument ? (
                    <div className="flex items-center gap-2">
                      <a href={uploadedDocument.document_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir le document
                        </Button>
                      </a>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteDocument(uploadedDocument.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor={`upload-${docType.id}`}>
                      <input
                        type="file"
                        id={`upload-${docType.id}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, docType.id)}
                      />
                      <Button variant="outline" asChild>
                        <div className="flex items-center gap-2">
                          <UploadCloud className="h-4 w-4" />
                          Télécharger
                        </div>
                      </Button>
                    </label>
                  )}
                </CardHeader>
                
                {uploading === docType.id && (
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader className="h-4 w-4" />
                      Téléchargement en cours... {uploadProgress}%
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation de l'upload</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir uploader ce document ?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Type de document
              </Label>
              <Input id="name" value={selectedDocType ? documentTypes.find(dt => dt.id === selectedDocType)?.name : ''} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                Nom du fichier
              </Label>
              <Input id="filename" value={uploadingFile?.name || ''} className="col-span-3" disabled />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={uploadDocument} disabled={uploading !== null}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverDocuments;
