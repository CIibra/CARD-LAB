-- =========================================================
-- CORRECTIF v6 — Circuit de résolution
-- =========================================================

-- Le porteur d'une solution peut mettre à jour SA propre solution
-- (ex: passer de "accepté" à "en_execution" puis "terminé")
DROP POLICY IF EXISTS "Prestataire modifie sa propre solution" ON public.issue_solutions;
CREATE POLICY "Prestataire modifie sa propre solution" ON public.issue_solutions
  FOR UPDATE USING (auth.uid() = provider_id);

-- Vérification
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issue_solutions';
