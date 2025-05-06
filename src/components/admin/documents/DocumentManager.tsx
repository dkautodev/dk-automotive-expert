
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, File, FileText, Upload, X } from "lucide-react";
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
import { DocumentItem, DocumentType } from "@/types/database";

interface DocumentManagerProps {
  entityId?: string;
  entityType: 'user' | 'mission' | 'invoice';
  documentTypes?: string[];
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
  
  // If no entityId is provided, use the connected user's id
  const effectiveEntityId = entityId || user?.id;
  
  useEffect(() => {
    if (!effectiveEntityId) {
      setLoading(false);
      return;
    }
    
    // Mock fetch documents - no actual API call since we're removing dashboard
    setLoading(true);
    setTimeout(() => {
      setDocuments([]);
      setLoading(false);
    }, 500);
  }, [effectiveEntityId, entityType]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create a URL for preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType || !effectiveEntityId) {
      toast.error('Please select a file and document type');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock document creation
      const newDocument: DocumentItem = {
        id: `doc-${Date.now()}`,
        file_name: selectedFile.name,
        file_path: 'mocked-path',
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        created_at: new Date().toISOString(),
        document_type: selectedDocumentType,
        document_url: previewUrl || '',
        uploaded_at: new Date().toISOString()
      };
      
      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedDocumentType('');
      
      // Update local state
      setDocuments(prev => [newDocument, ...prev]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Error: ${error.message || 'Problem during upload'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      // Mock delete operation
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting document');
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
          Manage documents associated with {
            entityType === 'user' ? 'the user' : 
            entityType === 'mission' ? 'the mission' : 'the invoice'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!effectiveEntityId ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Missing entity ID. Unable to manage documents.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
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
                    <h3 className="text-lg font-medium mb-1">No documents</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      No documents have been uploaded {activeTab !== 'all' && `of type "${getDocumentTypeLabel(activeTab)}"`}.
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
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(document.id)}
                            >
                              Delete
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
              <h3 className="text-lg font-medium mb-4">Upload a new document</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="document-type">Document type</Label>
                  <select
                    id="document-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="">Select a type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {getDocumentTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="document-file">File</Label>
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
                      alt="Preview" 
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
                      Uploading... {uploadProgress}%
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
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !selectedDocumentType || !effectiveEntityId || uploading}
        >
          {uploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> 
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Upload
            </>
          )}
        </Button>
      </CardFooter>
      
      {/* Document viewing modal */}
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
                    This file type cannot be previewed. 
                    <a 
                      href={viewDocument.document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Download the file
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
                Download
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentManager;
