
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { DriverDocument, DriverDocumentType, DOCUMENT_TYPE_LABELS } from "@/types/documents";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Service mock pour les documents
const mockDocumentService = {
  getDocuments: async (userId: string): Promise<DriverDocument[]> => {
    await simulateDelay();
    
    // Récupérer depuis localStorage ou utiliser des données mockées
    const storedDocs = localStorage.getItem(`driver_documents_${userId}`);
    return storedDocs ? JSON.parse(storedDocs) : [];
  },
  
  uploadDocument: async (userId: string, documentType: DriverDocumentType, file: File): Promise<DriverDocument> => {
    await simulateDelay(1500);
    
    // Simuler un téléchargement de fichier
    const mockUrl = `https://example.com/documents/${documentType}_${Date.now()}.pdf`;
    
    const newDocument: DriverDocument = {
      id: `doc_${Date.now()}`,
      user_id: userId,
      document_type: documentType,
      document_url: mockUrl,
      uploaded_at: new Date().toISOString(),
      verified: false
    };
    
    // Sauvegarder dans localStorage
    const storedDocs = localStorage.getItem(`driver_documents_${userId}`);
    const existingDocs: DriverDocument[] = storedDocs ? JSON.parse(storedDocs) : [];
    
    // Remplacer le document existant s'il existe
    const docIndex = existingDocs.findIndex(doc => doc.document_type === documentType);
    if (docIndex >= 0) {
      existingDocs[docIndex] = newDocument;
    } else {
      existingDocs.push(newDocument);
    }
    
    localStorage.setItem(`driver_documents_${userId}`, JSON.stringify(existingDocs));
    
    return newDocument;
  }
};

const DriverDocuments = () => {
  const [documents, setDocuments] = useState<Record<DriverDocumentType, DriverDocument | null>>({
    kbis: null,
    driving_license: null,
    id_card: null,
    vigilance_certificate: null,
  });
  const [loading, setLoading] = useState<Record<DriverDocumentType, boolean>>({
    kbis: false,
    driving_license: false,
    id_card: false,
    vigilance_certificate: false,
  });
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      if (!user?.id) return;
      
      const docs = await mockDocumentService.getDocuments(user.id);

      const documentMap: Record<DriverDocumentType, DriverDocument | null> = {
        kbis: null,
        driving_license: null,
        id_card: null,
        vigilance_certificate: null,
      };

      if (docs) {
        docs.forEach((doc) => {
          const documentType = doc.document_type as DriverDocumentType;
          if (documentType) {
            documentMap[documentType] = doc;
          }
        });
      }

      setDocuments(documentMap);
    } catch (error: any) {
      console.error("Erreur lors du chargement des documents:", error.message);
      toast.error("Impossible de charger vos documents");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: DriverDocumentType
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading((prev) => ({ ...prev, [documentType]: true }));

      const uploadedDoc = await mockDocumentService.uploadDocument(user.id, documentType, file);
      
      // Mettre à jour l'état local
      setDocuments(prev => ({
        ...prev,
        [documentType]: uploadedDoc
      }));
      
      toast.success(`${DOCUMENT_TYPE_LABELS[documentType]} mis à jour avec succès`);
    } catch (error: any) {
      console.error("Erreur d'envoi de fichier:", error.message);
      toast.error(`Erreur lors du téléchargement: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => {
          const documentType = type as DriverDocumentType;
          const document = documents[documentType];
          const isLoading = loading[documentType];

          return (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{label}</CardTitle>
                {document && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {document ? (
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Mis à jour le{" "}
                        {new Date(document.uploaded_at).toLocaleDateString("fr-FR")}
                      </p>
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Voir le document
                      </a>
                    </div>
                  ) : (
                    <div className="text-sm text-amber-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Document requis
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="relative">
                      <Button
                        type="button"
                        variant={document ? "outline" : "default"}
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {document ? "Mettre à jour" : "Télécharger"}
                        {isLoading && (
                          <span className="ml-2">
                            En cours...
                          </span>
                        )}
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, documentType)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DriverDocuments;
