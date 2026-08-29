-- =========================================================
-- CORRECTIF v4 — à exécuter dans Supabase SQL Editor
-- Rejouable sans risque (idempotent)
-- =========================================================

-- ---------------------------------------------------------
-- 1. RENFORCEMENT DU CORRECTIF issue_solutions (persiste malgré
--    le script précédent) : on ajoute les GRANTs explicites en plus
--    des policies RLS. Sans ce GRANT, même une policy correcte peut
--    être ignorée si le rôle authenticated n'a pas le droit de base.
-- ---------------------------------------------------------
GRANT SELECT, INSERT ON public.issue_solutions TO authenticated;
GRANT UPDATE ON public.issue_solutions TO authenticated;
GRANT SELECT ON public.issue_solutions TO anon;

DROP POLICY IF EXISTS "Proposition de solution par utilisateur connecté" ON public.issue_solutions;
CREATE POLICY "Proposition de solution par utilisateur connecté" ON public.issue_solutions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Lecture publique des solutions" ON public.issue_solutions;
CREATE POLICY "Lecture publique des solutions" ON public.issue_solutions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Validation solution par admin" ON public.issue_solutions;
CREATE POLICY "Validation solution par admin" ON public.issue_solutions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

-- Mêmes GRANTs de sécurité sur issues (au cas où)
GRANT SELECT, INSERT ON public.issues TO authenticated;
GRANT UPDATE ON public.issues TO authenticated;
GRANT SELECT ON public.issues TO anon;


-- ---------------------------------------------------------
-- 2. CONTACT_MESSAGES : lien vers l'expéditeur + réponse admin
-- ---------------------------------------------------------
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

-- Un citoyen connecté peut lire ses propres messages (pour voir la réponse du MAC)
DROP POLICY IF EXISTS "Lecture de ses propres messages" ON public.contact_messages;
CREATE POLICY "Lecture de ses propres messages" ON public.contact_messages
  FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT ON public.contact_messages TO anon; -- filtré par RLS de toute façon (admin ou propriétaire)


-- ---------------------------------------------------------
-- 3. Vérification finale
-- ---------------------------------------------------------
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issue_solutions';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contact_messages';
SELECT column_name FROM information_schema.columns WHERE table_name = 'contact_messages';
