import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: "website" | "article" | "product";
  image?: string;
  noIndex?: boolean;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = "Convoyage Automobile France & Île-de-France | DK Automotive";
const DEFAULT_DESCRIPTION =
  "Société de convoyage de véhicules par route en Île-de-France et France entière. Acheminement sécurisé porte-à-porte avec assurance tous risques incluse.";
const SITE_NAME = "DK Automotive";
const DEFAULT_IMAGE = "https://www.dkautomotive.fr/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png";
const SITE_URL = "https://www.dkautomotive.fr";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  noIndex = false,
  schema,
}: SEOProps) => {
  // If title already has the brand suffix, don't duplicate it
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  const currentUrl = canonical || SITE_URL;

  return (
    <Helmet>
      {/* Basic meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Optional Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
