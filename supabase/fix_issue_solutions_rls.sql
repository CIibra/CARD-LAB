-- =========================================================
-- CORRECTIF : erreur RLS sur "Proposer une solution"
-- "new row violates row-level security policy for table issue_solutions"
-- =========================================================
-- Ce script est idempotent : il peut être exécuté plusieurs fois sans erreur,
-- même si certaines policies existent déjà.

-- 1. Vérifier ce qui existe actuellement (à titre informatif)
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issue_solutions';

-- 2. Recréer la policy d'insertion pour issue_solutions (utilisateur connecté uniquement)
DROP POLICY IF EXISTS "Proposition de solution par utilisateur connecté" ON public.issue_solutions;
CREATE POLICY "Proposition de solution par utilisateur connecté" ON public.issue_solutions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. S'assurer que la lecture publique existe aussi (nécessaire pour l'affichage)
DROP POLICY IF EXISTS "Lecture publique des solutions" ON public.issue_solutions;
CREATE POLICY "Lecture publique des solutions" ON public.issue_solutions
  FOR SELECT USING (true);

-- 4. S'assurer que la validation admin existe (confirmer/refuser une solution)
DROP POLICY IF EXISTS "Validation solution par admin" ON public.issue_solutions;
CREATE POLICY "Validation solution par admin" ON public.issue_solutions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

-- 5. Vérification finale : tu dois voir 3 lignes après exécution
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issue_solutions';
