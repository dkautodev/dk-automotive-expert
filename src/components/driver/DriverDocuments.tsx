
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileCheck, FileX, AlertTriangle } from "lucide-react";

// Types de documents requis pour les chauffeurs
const REQUIRED_DOCUMENTS = [
  { id: "cni", name: "Carte Nationale d'Identité", type: "cni" },
  { id: "permis", name: "Permis de conduire", type: "permis" },
  { id: "kbis", name: "Extrait Kbis", type: "kbis" },
  { id: "vigilance", name: "Attestation de vigilance", type: "vigilance" }
];

type Document = {
  id: string;
  document_type: string;
  document_url: string;
  user_id: string;
  uploaded_at: string;
};

const DriverDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setDocuments(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
        toast.error("Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${documentType}-${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `driver-documents/${fileName}`;
    
    try {
      setUploading(prev => ({ ...prev, [documentType]: true }));
      
      // Upload du fichier dans le storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Récupération de l'URL publique
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      if (!urlData) throw new Error("Impossible de récupérer l'URL du document");
      
      // Vérifier si un document de ce type existe déjà
      const existingDocIndex = documents.findIndex(doc => doc.document_type === documentType);
      
      if (existingDocIndex >= 0) {
        // Mettre à jour le document existant
        const { error: updateError } = await supabase
          .from('documents')
          .update({ 
            document_url: urlData.publicUrl,
            uploaded_at: new Date().toISOString()
          })
          .eq('id', documents[existingDocIndex].id);
          
        if (updateError) throw updateError;
        
        // Mettre à jour l'état local
        const updatedDocuments = [...documents];
        updatedDocuments[existingDocIndex] = {
          ...updatedDocuments[existingDocIndex],
          document_url: urlData.publicUrl,
          uploaded_at: new Date().toISOString()
        };
        setDocuments(updatedDocuments);
      } else {
        // Créer une nouvelle entrée de document
        const { data: newDoc, error: insertError } = await supabase
          .from('documents')
          .insert({
            user_id: user?.id,
            document_type: documentType,
            document_url: urlData.publicUrl
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        // Ajouter le nouveau document à l'état local
        if (newDoc) {
          setDocuments(prev => [...prev, newDoc]);
        }
      }
      
      toast.success(`Document ${documentType} téléchargé avec succès`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      toast.error(`Erreur lors du téléchargement du document: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    return doc ? true : false;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Documents</h1>
        <p className="text-muted-foreground">
          Téléchargez vos documents obligatoires pour pouvoir accepter des missions
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const isUploaded = getDocumentStatus(doc.type);
            const isUploading = uploading[doc.type] || false;
            
            return (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{doc.name}</CardTitle>
                    {isUploaded ? (
                      <FileCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <CardDescription>
                    {isUploaded ? "Document téléchargé" : "Document requis"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {isUploaded && (
                      <a 
                        href={documents.find(d => d.document_type === doc.type)?.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm underline"
                      >
                        Voir le document
                      </a>
                    )}
                    <div>
                      <input
                        id={`file-${doc.id}`}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, doc.type)}
                        disabled={isUploading}
                      />
                      <label htmlFor={`file-${doc.id}`}>
                        <Button
                          variant={isUploaded ? "outline" : "default"}
                          type="button"
                          disabled={isUploading}
                          className={`cursor-pointer ${isUploaded ? "ml-auto" : ""}`}
                        >
                          {isUploading ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploaded ? "Mettre à jour" : "Télécharger"}
                            </>
                          )}
                        </Button>
                      </label>
                    </div>
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
