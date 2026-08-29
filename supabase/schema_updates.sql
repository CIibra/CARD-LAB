-- =========================================================
-- MISE A JOUR SCHEMA - Carte Citoyenne MAC
-- A executer dans Supabase > SQL Editor, APRES le schema.sql initial
-- =========================================================

-- 1. TABLE CONTACT_MESSAGES (formulaire "Contacter le MAC")
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT CHECK (category IN ('Citoyen', 'ONG / Association', 'Entreprise', 'Collectivité')) DEFAULT 'Citoyen',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('Nouveau', 'Lu', 'Traité')) DEFAULT 'Nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Tout le monde (meme non connecte) peut envoyer un message de contact
CREATE POLICY "Envoi message contact par tous" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Seul l'admin MAC peut lire / traiter les messages
CREATE POLICY "Lecture messages contact par admin" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

CREATE POLICY "Mise a jour messages contact par admin" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );


-- 2. POLICY MANQUANTE : validation des solutions par l'admin MAC
-- (sans ceci, personne ne peut passer une solution de "propose" a "accepte"/"refuse")
CREATE POLICY "Validation solution par admin" ON public.issue_solutions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );


-- 3. POLICIES MANQUANTES : organisations (creation/edition par le proprietaire)
CREATE POLICY "Creation organisation par son proprietaire" ON public.organisations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Modification organisation par proprietaire ou admin" ON public.organisations
  FOR UPDATE USING (
    auth.uid() = profile_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );


-- 4. POLICY MANQUANTE : mise a jour de son propre profil
-- (empeche un utilisateur de s'auto-promouvoir mac_admin : le role doit rester inchange)
CREATE POLICY "Modification profil par son proprietaire" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );


-- 5. MISE A JOUR STATUT SIGNALEMENT PAR ADMIN (deja couvert par la policy existante
-- "Mise à jour signalement par admin ou auteur" du schema.sql initial - rien a faire ici)


-- =========================================================
-- 6. PROMOUVOIR TON PROPRE COMPTE EN SUPER-ADMIN MAC
-- =========================================================
-- Etape 1 : cree ton compte normalement depuis le site (inscription email + mot de passe)
-- Etape 2 : remplace l'email ci-dessous par le tien, puis execute cette requete UNE FOIS :

-- UPDATE public.profiles
-- SET role = 'mac_admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'ton-email@exemple.com');

-- Verification :
-- SELECT id, full_name, role FROM public.profiles WHERE role = 'mac_admin';
