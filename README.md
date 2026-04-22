# DK Automotive Expert 🚗

Expert en convoyage automobile en France. Solution complète de gestion de missions, calcul de devis en temps réel et interface d'administration sécurisée.

![DK Automotive Logo](https://www.dkautomotive.fr/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png)

## 📌 Présentation

DK Automotive Expert est une application web moderne conçue pour automatiser et sécuriser le workflow de convoyage automobile. De la demande de devis client jusqu'au paiement final, chaque étape est gérée de manière fluide et transparente.

## 🚀 Fonctionnalités Clés

### Côté Client
- **Calcul de Devis Dynamique** : Utilisation de l'API Google Maps pour le calcul des distances et intégration de grilles tarifaires complexes (véhicules légers, utilitaires, électriques).
- **Paiement Sécurisé via Stripe** : Workflow d'enregistrement de mission "En attente" avant redirection vers Stripe pour garantir l'intégrité des données.
- **Espace Devis & Contact** : Formulaires de contact et de devis avec validation en temps réel.
- **Interface responsive** : Expérience fluide sur mobiles, tablettes et ordinateurs.

### Côté Administration
- **Dashboard Complet** : Suivi des statistiques (revenus, missions actives, devis en attente).
- **CMS Intégré (Content Management System)** : Gestion dynamique des textes, images de fond, et contenus légaux (CGU/CGV) sans toucher au code.
- **Gestion des Missions** : Tableau de bord pour le suivi des états de livraison et des paiements.
- **Sécurité Avancée** : Accès restreint via RLS (Row Level Security) et rôles utilisateurs administrés côté serveur.

## 🛠 Tech Stack

- **Frontend** : [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database** : [Supabase](https://supabase.com/) (PostgreSQL + Auth + Edge Functions + Storage)
- **Calcul de distance** : [Google Maps Platform](https://developers.google.com/maps)
- **Paiements** : [Stripe](https://stripe.com/)
- **Composants UI** : [Shadcn/UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **SEO** : React Helmet Async + Sitemap dynamique

## ⚙️ Installation Locale

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/dkautodev/dk-automotive-expert.git
   cd dk-automotive-expert
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Variables d'Environnement** :
   Créez un fichier `.env` à la racine et renseignez les clés suivantes :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🔒 Sécurité & Performance

- **RLS (Row Level Security)** : Les données sensibles (missions, profils) sont protégées au niveau de la base de données.
- **Validation Backend** : Les prix sont recalculés côté serveur dans des Edge Functions pour éviter toute manipulation côté client.
- **SEO Ready** : Données structurées JSON-LD et balises Open Graph optimisées pour un partage parfait sur les réseaux sociaux.

---
**Développé par DK Automotive.**
