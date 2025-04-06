import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Paperclip, Trash2, Download, FileText, File, Image, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useAttachmentUpload } from "@/hooks/useAttachmentUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { missionService } from "@/services/missionService";
import { formatFileSize } from "@/utils/fileUtils";
import { UserRole } from "@/hooks/auth/types";

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
  storage_provider?: string;
}

interface MissionAttachmentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  missionNumber: string | null;
}

export const MissionAttachmentsDialog: React.FC<MissionAttachmentsDialogProps> = ({
  isOpen,
  onClose,
  missionId,
  missionNumber
}) => {
  const { user, role } = useAuthContext();
  const { 
    uploadAttachments, 
    isUploading, 
    getFileDownloadUrl, 
    deleteAttachment, 
    isDeleting, 
    uploadProgress 
  } = useAttachmentUpload();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [acceptedFileTypes, setAcceptedFileTypes] = useState(
    ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
  );

  const loadAttachments = async () => {
    if (!missionId) return;
    
    setIsFetching(true);
    try {
      console.log("Chargement des pièces jointes pour la mission:", missionId);
      
      const { data, error } = await missionService.getMissionAttachments(missionId);
      
      if (error) {
        console.error("Erreur lors de la récupération des pièces jointes:", error);
        throw error;
      }
      
      console.log("Pièces jointes récupérées:", data);
      setAttachments(data as Attachment[]);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des pièces jointes:", error.message);
      toast.error("Erreur lors de la récupération des pièces jointes");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen && missionId) {
      loadAttachments();
      setUploadError(null);
      setFiles([]);
    }
  }, [isOpen, missionId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const filesArray = Array.from(newFiles);
      setFiles(filesArray);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!missionId || !user) return;
    
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }
    
    setUploadError(null);
    
    try {
      const success = await uploadAttachments(missionId, files, user.id);
      
      if (success) {
        setFiles([]);
        loadAttachments();
      } else {
        setUploadError("Certains fichiers n'ont pas pu être téléchargés. Veuillez réessayer.");
      }
    } catch (error: any) {
      console.error("Erreur de téléchargement:", error);
      setUploadError(`Erreur lors du téléchargement: ${error.message || "Erreur inconnue"}`);
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      console.log("Téléchargement depuis Supabase Storage:", attachment.file_path);
      
      const { data: existsData, error: existsError } = await supabase.storage
        .from('mission-attachments')
        .list(attachment.file_path.split('/').slice(0, -1).join('/'), {
          search: attachment.file_path.split('/').pop() || ''
        });
      
      if (existsError) {
        console.error("Erreur lors de la vérification de l'existence du fichier:", existsError);
      }
      
      if (existsData && existsData.length === 0) {
        console.error("Le fichier n'existe pas dans le stockage");
        toast.error("Le fichier n'existe pas dans le stockage");
        return;
      }
      
      const { data, error } = await supabase.storage
        .from('mission-attachments')
        .download(attachment.file_path);

      if (error) {
        console.error("Erreur lors du téléchargement du fichier:", error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du fichier:", error.message);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    toast.error("La suppression des documents n'est pas autorisée");
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const canDeleteFiles = false;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Pièces jointes - Mission {missionNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            {canDeleteFiles && (
              <div className="border rounded-lg p-4">
                <Label htmlFor="file-upload" className="block mb-2">Ajouter des fichiers</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept={acceptedFileTypes}
                      multiple
                      className="block w-full"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
                    {isUploading ? <Loader className="mr-2 h-4 w-4" /> : <Paperclip className="mr-2 h-4 w-4" />}
                    Télécharger
                  </Button>
                </div>
                
                {uploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}
                
                {files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      {files.length} fichier(s) sélectionné(s)
                    </p>
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="mt-1 space-y-1">
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                          <div key={fileName} className="text-xs flex items-center gap-2">
                            <div className="w-32 truncate">{fileName}</div>
                            <div className="w-full bg-secondary rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="w-8 text-right">{progress}%</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: images (jpg, png, gif), documents (pdf, doc, docx), tableurs (xls, xlsx), texte (txt, csv)
                  </p>
                </div>
              </div>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-2 font-medium text-sm">Fichiers attachés</div>
              
              {isFetching ? (
                <div className="flex justify-center p-4">
                  <Loader className="h-6 w-6" />
                </div>
              ) : attachments.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  Aucune pièce jointe
                </p>
              ) : (
                <ul className="divide-y">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="p-3 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0">
                            {getFileIcon(attachment.file_type || '')}
                          </span>
                          <div>
                            <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.file_size || 0)} • {new Date(attachment.created_at).toLocaleDateString()} 
                              {attachment.storage_provider && ` • ${attachment.storage_provider}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(attachment)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
