import React from 'react';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePageContents } from '@/hooks/usePageContents';
import LogoSection from '@/components/admin/logo/LogoSection';
import FaviconSection from '@/components/admin/logo/FaviconSection';

const LogoEditor = () => {
  const { contents, isLoading, updateContent, uploadImage, refetch } = usePageContents('navbar');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2">Logo et Favicon</h1>
        <p className="text-sm text-muted-foreground">
          Gérez le logo et le favicon de votre site.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['logo', 'favicon']} className="space-y-3">
        <AccordionItem value="logo" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Logo du site</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <LogoSection
              contents={contents}
              uploadImage={uploadImage}
              updateContent={updateContent}
              refetch={refetch}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="favicon" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold">Favicon</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <FaviconSection
              contents={contents}
              uploadImage={uploadImage}
              updateContent={updateContent}
              refetch={refetch}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LogoEditor;
