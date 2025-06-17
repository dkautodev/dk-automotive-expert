
import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePageContents } from '@/hooks/usePageContents';
import LogoSection from '@/components/admin/logo/LogoSection';
import FaviconSection from '@/components/admin/logo/FaviconSection';

const LogoEditor = () => {
  const { contents, isLoading, updateContent, uploadImage, refetch } = usePageContents('navbar');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <LogoSection
        contents={contents}
        uploadImage={uploadImage}
        updateContent={updateContent}
        refetch={refetch}
      />
      
      <FaviconSection
        contents={contents}
        uploadImage={uploadImage}
        updateContent={updateContent}
        refetch={refetch}
      />
    </div>
  );
};

export default LogoEditor;
