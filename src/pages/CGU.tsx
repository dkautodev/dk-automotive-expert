import React from 'react';
import { Separator } from "@/components/ui/separator";
import SEO from '@/components/SEO';
import { cguSections } from '@/data/faqAndLegalContent';

const CGU = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.dkautomotive.fr/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "CGU",
        "item": "https://www.dkautomotive.fr/cgu"
      }
    ]
  };

  return (
    <main className="min-h-screen flex flex-col">
      <SEO 
        title="CGU - Conditions Générales d'Utilisation"
        description="Consultez les conditions générales d'utilisation du site de DK Automotive. Informations sur l'accès au site, son utilisation et la propriété intellectuelle."
        canonical="https://www.dkautomotive.fr/cgu"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {cguSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <section className="mb-8">
                  {section.section_title && (
                    <h2 className="text-xl font-semibold text-dk-navy mb-4">
                      {section.section_title}
                    </h2>
                  )}
                  {section.section_content && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {section.section_content}
                      </p>
                    </div>
                  )}
                </section>
                {index < cguSections.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CGU;
