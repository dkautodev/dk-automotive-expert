
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, File, FileText, Upload, X } from "lucide-react";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentManagerProps {
  entityId?: string;
  entityType: 'user' | 'mission' | 'invoice';
  documentTypes?: string[];
}

interface DocumentItem {
  id: string;
  document_type: string;
  document_url: string;
  uploaded_at: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

const fileTypeIcons: Record<string, React.ReactNode> = {
  'application/pdf': <FileText className="h-8 w-8 text-red-500" />,
  'image/jpeg': <File className="h-8 w-8 text-blue-500" />,
  'image/png': <File className="h-8 w-8 text-green-500" />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileText className="h-8 w-8 text-indigo-500" />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileText className="h-8 w-8 text-emerald-500" />,
};

const getDocumentTypeLabel = (type: string) => {
  switch (type) {
    case 'identity': return 'Pièce d\'identité';
    case 'license': return 'Permis de conduire';
    case 'insurance': return 'Assurance';
    case 'invoice': return 'Facture';
    case 'contract': return 'Contrat';
    case 'quote': return 'Devis';
    case 'damage_report': return 'Constat';
    case 'vehicle_photo': return 'Photo véhicule';
    case 'delivery_note': return 'Bon de livraison';
    default: return type;
  }
};

const DocumentManager = ({ entityId, entityType, documentTypes = [] }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewDocument, setViewDocument] = useState<DocumentItem | null>(null);
  const { user } = useAuthContext();
  
  // Si aucun entityId n'est fourni, utiliser l'id de l'utilisateur connecté
  const effectiveEntityId = entityId || user?.id;
  
  useEffect(() => {
    if (!effectiveEntityId) {
      setLoading(false);
      return;
    }
    
    fetchDocuments();
  }, [effectiveEntityId, entityType]);
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let table = '';
      let filter = {};
      
      // Déterminer quelle table utiliser et quel filtre appliquer
      if (entityType === 'user') {
        table = 'documents';
        filter = { user_id: effectiveEntityId };
      } else if (entityType === 'mission') {
        table = 'mission_documents';
        filter = { mission_id: effectiveEntityId };
      } else if (entityType === 'invoice') {
        table = 'documents'; // Ou une table dédiée aux documents de facture
        filter = { invoice_id: effectiveEntityId };
      }
      
      if (!table) {
        throw new Error('Type d\'entité non supporté');
      }
      
      const { data, error } = await extendedSupabase
        .from(table)
        .select('*')
        .match(filter)
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Créer une URL pour la prévisualisation
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType || !effectiveEntityId) {
      toast.error('Veuillez sélectionner un fichier et un type de document');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // 1. Télécharger le fichier dans le bucket de stockage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${entityType}_${effectiveEntityId}_${selectedDocumentType}_${Date.now()}.${fileExt}`;
      const filePath = `${entityType}s/${effectiveEntityId}/${fileName}`;
      
      // Simuler la progression du téléchargement
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      const { data: uploadData, error: uploadError } = await extendedSupabase.storage
        .from('documents')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // 2. Obtenir l'URL publique du fichier
      const { data: urlData } = extendedSupabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // 3. Créer l'entrée de document dans la base de données
      let table = '';
      let documentData = {};
      
      if (entityType === 'user') {
        table = 'documents';
        documentData = {
          user_id: effectiveEntityId,
          document_type: selectedDocumentType,
          document_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        };
      } else if (entityType === 'mission') {
        table = 'mission_documents';
        documentData = {
          mission_id: effectiveEntityId,
          document_type: selectedDocumentType,
          document_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        };
      } else if (entityType === 'invoice') {
        table = 'documents'; // Ou une table dédiée
        documentData = {
          invoice_id: effectiveEntityId,
          document_type: selectedDocumentType,
          document_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type
        };
      }
      
      const { error: dbError } = await extendedSupabase
        .from(table)
        .insert(documentData);
        
      if (dbError) throw dbError;
      
      toast.success('Document téléchargé avec succès');
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedDocumentType('');
      
      // Actualiser la liste des documents
      fetchDocuments();
      
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error(`Erreur: ${error.message || 'Problème lors du téléchargement'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      let table = '';
      
      if (entityType === 'user') {
        table = 'documents';
      } else if (entityType === 'mission') {
        table = 'mission_documents';
      } else if (entityType === 'invoice') {
        table = 'documents'; // Ou table dédiée
      }
      
      const { error } = await extendedSupabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Mettre à jour la liste locale
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document supprimé');
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' octets';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
  };
  
  const getFileTypeIcon = (fileType: string | undefined): React.ReactNode => {
    if (!fileType) return <File className="h-8 w-8 text-gray-500" />;
    return fileTypeIcons[fileType] || <File className="h-8 w-8 text-gray-500" />;
  };
  
  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.document_type === activeTab);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          Gérer les documents associés à {
            entityType === 'user' ? 'l\'utilisateur' : 
            entityType === 'mission' ? 'la mission' : 'la facture'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!effectiveEntityId ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              ID d'entité manquant. Impossible de gérer les documents.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="all">Tous</TabsTrigger>
                {documentTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {getDocumentTypeLabel(type)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="flex justify-center p-6">
                    <Loader className="h-8 w-8" />
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center p-6 border rounded-md border-dashed">
                    <File className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Aucun document</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aucun document n'a été téléchargé {activeTab !== 'all' && `de type "${getDocumentTypeLabel(activeTab)}"`}.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {filteredDocuments.map((document) => (
                        <div 
                          key={document.id} 
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            {getFileTypeIcon(document.file_type)}
                            <div>
                              <p className="font-medium text-sm">{document.file_name || 'Document'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {getDocumentTypeLabel(document.document_type)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(document.uploaded_at), "dd MMM yyyy", { locale: fr })}
                                </span>
                                {document.file_size && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatFileSize(document.file_size)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setViewDocument(document)}
                            >
                              Voir
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(document.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Télécharger un nouveau document</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="document-type">Type de document</Label>
                  <select
                    id="document-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="">Sélectionnez un type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {getDocumentTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="document-file">Fichier</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="document-file"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    {selectedFile && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {previewUrl && (
                  <div className="mt-2">
                    <img 
                      src={previewUrl} 
                      alt="Prévisualisation" 
                      className="max-h-40 rounded-md border"
                    />
                  </div>
                )}
                
                {selectedFile && (
                  <div className="text-sm text-muted-foreground">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
                
                {uploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Téléchargement en cours... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" disabled={uploading}>
          Annuler
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !selectedDocumentType || !effectiveEntityId || uploading}
        >
          {uploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> 
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Télécharger
            </>
          )}
        </Button>
      </CardFooter>
      
      {/* Modal de visualisation du document */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {viewDocument?.file_name || 'Document'}
            </DialogTitle>
            <DialogDescription>
              Type: {viewDocument && getDocumentTypeLabel(viewDocument.document_type)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            {viewDocument && (
              viewDocument.file_type?.startsWith('image/') ? (
                <img 
                  src={viewDocument.document_url} 
                  alt={viewDocument.file_name || 'Document'} 
                  className="max-h-[60vh] mx-auto rounded-md"
                />
              ) : viewDocument.file_type === 'application/pdf' ? (
                <iframe 
                  src={viewDocument.document_url} 
                  className="w-full h-[60vh] rounded-md"
                  title={viewDocument.file_name || 'PDF Document'}
                />
              ) : (
                <div className="text-center p-8 border rounded-md">
                  {getFileTypeIcon(viewDocument.file_type)}
                  <p className="mt-2">
                    Ce type de fichier ne peut pas être prévisualisé. 
                    <a 
                      href={viewDocument.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Télécharger le fichier
                    </a>
                  </p>
                </div>
              )
            )}
          </div>
          
          <DialogFooter>
            {viewDocument && (
              <a 
                href={viewDocument.document_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Télécharger
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentManager;
