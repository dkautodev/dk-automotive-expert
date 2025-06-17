
-- Mettre à jour le rôle de l'utilisateur connecté pour en faire un administrateur
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'votre-email@exemple.com';

-- Ou si vous connaissez votre ID utilisateur, vous pouvez utiliser :
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = 'votre-user-id';

-- Pour voir tous les profils existants et identifier le vôtre :
SELECT id, email, role FROM public.profiles;
