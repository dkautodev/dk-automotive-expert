/**
 * Script de pré-rendu statique post-build pour DK Automotive.
 * Génère des fichiers HTML dédiés par route avec les balises Title, Meta,
 * Canonical et Open Graph spécifiques directement injectées dans le code source.
 * 
 * Permet un référencement optimal par les moteurs de recherche (Google, Bing)
 * et un affichage parfait des aperçus réseaux sociaux (LinkedIn, WhatsApp, etc.).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error("Le dossier 'dist' n'existe pas. Veuillez exécuter 'vite build' d'abord.");
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

const routes = [
  {
    path: '/',
    title: 'Convoyage de véhicules France & Île-de-France | DK Automotive',
    description: 'Confiez le transfert de votre voiture à DK Automotive : convoyeurs expérimentés, assurance tous risques incluse et devis immédiat en ligne partout en France.',
    canonical: 'https://www.dkautomotive.fr/',
    h1: 'Convoyage de véhicules par la route en France et Europe'
  },
  {
    path: '/devis',
    title: 'Devis Convoyage Voiture Gratuit & Tarif Immédiat | DK Automotive',
    description: 'Calculez le prix de votre convoyage automobile en quelques clics. Devis immédiat, gratuit, sans engagement, assurance tous risques incluse.',
    canonical: 'https://www.dkautomotive.fr/devis',
    h1: 'Obtenez votre devis immédiat pour votre convoyage automobile'
  },
  {
    path: '/about',
    title: 'À Propos — Société de Convoyage de Véhicules par Route | DK Automotive',
    description: 'Découvrez DK Automotive, société experte en convoyage automobile par route depuis 2018. Plus de 2 000 missions de transfert sécurisé pour particuliers et professionnels.',
    canonical: 'https://www.dkautomotive.fr/about',
    h1: 'À propos de DK Automotive — Expert en convoyage de véhicules'
  },
  {
    path: '/contact',
    title: 'Contactez DK Automotive — Devis Flotte & Convoyage Voiture | DK Automotive',
    description: 'Contactez notre équipe de convoyage de véhicules. Demandes spécifiques, transferts de flotte ou questions logistiques partout en France.',
    canonical: 'https://www.dkautomotive.fr/contact',
    h1: 'Contactez DK Automotive'
  },
  {
    path: '/faq',
    title: 'FAQ - Questions Fréquentes | DK Automotive',
    description: 'Trouvez toutes les réponses à vos questions sur notre service de convoyage de véhicules. FAQ complète sur les tarifs, délais, assurances et modalités.',
    canonical: 'https://www.dkautomotive.fr/faq',
    h1: 'Questions Fréquentes sur le Convoyage Automobile'
  },
  {
    path: '/cgv',
    title: 'CGV - Conditions Générales de Vente | DK Automotive',
    description: 'Consultez les conditions générales de vente de DK Automotive. Informations sur nos services de convoyage, tarifs et responsabilités.',
    canonical: 'https://www.dkautomotive.fr/cgv',
    h1: 'Conditions Générales de Vente'
  },
  {
    path: '/cgu',
    title: 'CGU - Conditions Générales d\'Utilisation | DK Automotive',
    description: 'Consultez les conditions générales d\'utilisation du site de DK Automotive. Informations sur l\'accès au site, son utilisation et la propriété intellectuelle.',
    canonical: 'https://www.dkautomotive.fr/cgu',
    h1: 'Conditions Générales d\'Utilisation'
  },
  {
    path: '/mentions-legales',
    title: 'Mentions Légales | DK Automotive',
    description: 'Consultez les mentions légales de DK Automotive. Informations sur la société, l\'hébergement du site et la protection des données.',
    canonical: 'https://www.dkautomotive.fr/mentions-legales',
    h1: 'Mentions Légales'
  },
  {
    path: '/politique-confidentialite',
    title: 'Politique de Confidentialité | DK Automotive',
    description: 'Consultez la politique de confidentialité de DK Automotive. Informations sur la collecte, l\'utilisation et la protection de vos données personnelles.',
    canonical: 'https://www.dkautomotive.fr/politique-confidentialite',
    h1: 'Politique de Confidentialité'
  },
  {
    path: '/gestion-cookies',
    title: 'Gestion des Cookies | DK Automotive',
    description: 'Informations sur l\'utilisation des cookies sur le site de DK Automotive. Apprenez comment nous utilisons les cookies et comment vous pouvez les gérer.',
    canonical: 'https://www.dkautomotive.fr/gestion-cookies',
    h1: 'Gestion des Cookies'
  }
];

console.log('🚀 Démarrage du pré-rendu SEO des routes statiques...');

for (const route of routes) {
  let html = template;

  // 1. Remplacement de la balise <title>
  html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title data-rh="true">${route.title}</title>`);

  // 2. Remplacement de la balise <meta name="description">
  html = html.replace(
    /<meta[^>]*name=["']description["'][^>]*>/i,
    `<meta data-rh="true" name="description" content="${route.description}" />`
  );

  // 3. Remplacement du lien canonical
  html = html.replace(
    /<link[^>]*rel=["']canonical["'][^>]*>/i,
    `<link data-rh="true" rel="canonical" href="${route.canonical}" />`
  );

  // 4. Remplacement des Open Graph
  html = html.replace(
    /<meta[^>]*property=["']og:title["'][^>]*>/i,
    `<meta data-rh="true" property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta[^>]*property=["']og:description["'][^>]*>/i,
    `<meta data-rh="true" property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta[^>]*property=["']og:url["'][^>]*>/i,
    `<meta data-rh="true" property="og:url" content="${route.canonical}" />`
  );

  // 5. Remplacement des Twitter Cards
  html = html.replace(
    /<meta[^>]*name=["']twitter:title["'][^>]*>/i,
    `<meta data-rh="true" name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta[^>]*name=["']twitter:description["'][^>]*>/i,
    `<meta data-rh="true" name="twitter:description" content="${route.description}" />`
  );

  // 6. Injection sémantique minimale dans #root pour les robots sans exécution JS
  const fallbackHtml = `<div id="root"><main style="opacity: 0.01; position: absolute; pointer-events: none;"><h1>${route.h1}</h1><p>${route.description}</p></main></div>`;
  html = html.replace(/<div id=["']root["']><\/div>/i, fallbackHtml);

  // 7. Écriture du fichier HTML correspondant
  if (route.path === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
  } else {
    const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), html);
  }

  console.log(`  ✓ Route pré-rendue : ${route.path} -> ${route.path === '/' ? 'index.html' : route.path.slice(1) + '/index.html'}`);
}

console.log('✅ Pré-rendu SEO terminé avec succès.');
