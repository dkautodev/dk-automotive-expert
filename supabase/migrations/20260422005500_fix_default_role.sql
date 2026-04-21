-- Mise à jour de la fonction pour que les nouveaux utilisateurs ne soient plus admin par défaut.
-- Le rôle par défaut passe de 'admin' à 'user'.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;
