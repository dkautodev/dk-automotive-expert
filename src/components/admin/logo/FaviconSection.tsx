import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContent } from '@/hooks/usePageContents';
interface FaviconSectionProps {
  contents: PageContent[];
  uploadImage: (file: File, blockKey: string) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<PageContent>) => Promise<void>;
  refetch: () => Promise<void>;
}
const FaviconSection = ({
  contents
}: FaviconSectionProps) => {
  const faviconContent = contents.find(item => item.block_key === 'favicon');
  const currentFaviconUrl = faviconContent?.content_value || '/lovable-uploads/favicon.png';
  return <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-dk-navy">
          Favicon actuel
        </CardTitle>
        <p className="text-sm text-gray-600">
          L'icône qui apparaît dans l'onglet du navigateur
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Favicon actuel */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 rounded-lg border bg-gray-300">
            <img src={currentFaviconUrl} alt="Favicon actuel" className="w-8 h-8 object-contain" onError={e => {
            e.currentTarget.src = '/placeholder.svg';
          }} />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Le favicon est fixé sur /lovable-uploads/favicon.png</p>
        </div>

      </CardContent>
    </Card>;
};
export default FaviconSection;