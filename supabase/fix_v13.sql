-- =========================================================
-- CORRECTIF v13 — Complément d'adresse + téléphone protégé
-- =========================================================

-- 1. Complément d'adresse : même visibilité que le champ "quartier" existant
--    (masqué publiquement, révélé après acceptation d'une solution par le MAC)
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS adresse_complement TEXT;


-- 2. Téléphone du déclarant : table séparée avec ses propres règles d'accès.
--    Contrairement au quartier/complément d'adresse, ce numéro n'est JAMAIS
--    révélé à un prestataire, même après acceptation de sa solution.
--    Seul un compte "mac_admin" peut le lire — vraie garantie en base de
--    données, pas seulement une donnée cachée à l'écran.
CREATE TABLE IF NOT EXISTS public.issue_contact_info (
  issue_id UUID PRIMARY KEY REFERENCES public.issues(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.issue_contact_info ENABLE ROW LEVEL SECURITY;

-- Le déclarant peut enregistrer son propre numéro au moment de son signalement
DROP POLICY IF EXISTS "Insertion telephone par l'auteur du signalement" ON public.issue_contact_info;
CREATE POLICY "Insertion telephone par l'auteur du signalement" ON public.issue_contact_info
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.issues WHERE id = issue_id AND user_id = auth.uid())
  );

-- Seul le MAC peut lire les numéros de téléphone
DROP POLICY IF EXISTS "Lecture telephone reservee au MAC" ON public.issue_contact_info;
CREATE POLICY "Lecture telephone reservee au MAC" ON public.issue_contact_info
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

-- Vérification
SELECT column_name FROM information_schema.columns WHERE table_name = 'issues' AND column_name = 'adresse_complement';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issue_contact_info';
