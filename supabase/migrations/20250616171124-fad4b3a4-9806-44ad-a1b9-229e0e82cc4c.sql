
-- Create table for cookie management content
CREATE TABLE public.cookie_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT NOT NULL,
  section_content TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data for cookie management
INSERT INTO public.cookie_management (section_key, section_title, section_content, display_order) VALUES
('introduction', 'Qu''est-ce qu''un cookie ?', 'Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d''un site internet. Il permet de reconnaître votre navigateur et de conserver certaines informations vous concernant.', 1),
('utilisation', 'Utilisation des cookies sur notre site', 'Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser l''utilisation de notre site. Ces cookies nous permettent de mémoriser vos préférences de navigation, analyser le trafic et l''utilisation de notre site, et améliorer nos services.', 2),
('gestion', 'Gestion de vos cookies', 'Vous pouvez à tout moment modifier vos préférences concernant les cookies via les paramètres de votre navigateur. Pour plus d''informations sur la gestion des cookies, consultez l''aide de votre navigateur.', 3),
('contact', 'Contact', 'Pour toute question concernant notre politique de cookies, contactez-nous à : dkautomotive70@gmail.com', 4);

-- Create table for CGV (Conditions Générales de Vente)
CREATE TABLE public.cgv_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT NOT NULL,
  section_content TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data for CGV
INSERT INTO public.cgv_content (section_key, section_title, section_content, display_order) VALUES
('introduction', 'Introduction', 'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre DK AUTOMOTIVE et ses clients dans le cadre de la prestation de services de transport de véhicules.', 1),
('services', 'Description des services', 'DK AUTOMOTIVE propose des services de transport de véhicules particuliers et professionnels sur l''ensemble du territoire français et européen.', 2),
('tarifs', 'Tarifs et modalités de paiement', 'Les tarifs sont communiqués lors de l''établissement du devis. Ils s''entendent toutes taxes comprises et sont fermes et définitifs.', 3),
('responsabilite', 'Responsabilité et assurance', 'DK AUTOMOTIVE souscrit une assurance responsabilité civile professionnelle couvrant les dommages pouvant être causés aux véhicules transportés.', 4),
('annulation', 'Annulation et modification', 'Toute annulation ou modification doit être notifiée par écrit dans les délais prévus au contrat.', 5),
('litiges', 'Règlement des litiges', 'En cas de litige, les parties s''efforceront de trouver une solution amiable. À défaut, les tribunaux compétents seront ceux du ressort du siège social de DK AUTOMOTIVE.', 6);

-- Create table for CGU (Conditions Générales d'Utilisation)
CREATE TABLE public.cgu_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT NOT NULL,
  section_content TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data for CGU
INSERT INTO public.cgu_content (section_key, section_title, section_content, display_order) VALUES
('introduction', 'Introduction', 'Les présentes Conditions Générales d''Utilisation (CGU) régissent l''utilisation du site internet de DK AUTOMOTIVE accessible à l''adresse [URL du site].', 1),
('acces_site', 'Accès au site', 'L''accès au site est gratuit et ouvert à tous les utilisateurs disposant d''un accès à internet. Tous les coûts afférents à l''accès au site sont exclusivement à la charge de l''utilisateur.', 2),
('utilisation', 'Utilisation du site', 'L''utilisateur s''engage à utiliser le site de manière loyale et conforme à sa destination. Il s''interdit notamment de porter atteinte aux droits de tiers ou à l''ordre public.', 3),
('propriete_intellectuelle', 'Propriété intellectuelle', 'Le contenu du site (textes, images, vidéos, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.', 4),
('donnees_personnelles', 'Protection des données personnelles', 'Les données personnelles collectées font l''objet d''un traitement conforme à notre politique de confidentialité.', 5),
('responsabilite', 'Limitation de responsabilité', 'DK AUTOMOTIVE ne saurait être tenu responsable des dommages directs ou indirects résultant de l''utilisation du site.', 6),
('modifications', 'Modifications des CGU', 'DK AUTOMOTIVE se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site.', 7);

-- Add triggers for updated_at on all new tables
CREATE TRIGGER update_cookie_management_updated_at
  BEFORE UPDATE ON public.cookie_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cgv_content_updated_at
  BEFORE UPDATE ON public.cgv_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cgu_content_updated_at
  BEFORE UPDATE ON public.cgu_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
