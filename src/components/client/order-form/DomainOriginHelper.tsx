
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DomainOriginHelperProps {
  projectId: string;
  isVisible: boolean;
}

export const DomainOriginHelper = ({ projectId, isVisible }: DomainOriginHelperProps) => {
  const [currentOrigin, setCurrentOrigin] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  if (!isVisible) return null;

  const openGoogleCloudOAuthSettings = () => {
    const url = `https://console.cloud.google.com/apis/credentials/oauthclient?project=${projectId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
        <div>
          <h3 className="font-medium text-sm">Suggestion de configuration</h3>
          <p className="text-sm mt-1">
            Pour résoudre les problèmes d'autorisation Google Maps, ajoutez ce domaine aux origines JavaScript autorisées:
          </p>
          <code className="block bg-white p-2 rounded mt-2 text-xs border border-gray-200 font-mono">
            {currentOrigin}
          </code>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 text-xs" 
            onClick={openGoogleCloudOAuthSettings}
          >
            Configurer les origines autorisées
          </Button>
        </div>
      </div>
    </div>
  );
};
