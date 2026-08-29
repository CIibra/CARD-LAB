-- =========================================================
-- CORRECTIF v7 — Suppression de signalement par son auteur
-- =========================================================

DROP POLICY IF EXISTS "Suppression signalement par son auteur si nouveau" ON public.issues;
CREATE POLICY "Suppression signalement par son auteur si nouveau" ON public.issues
  FOR DELETE USING (auth.uid() = user_id AND status = 'Nouveau');

GRANT DELETE ON public.issues TO authenticated;

-- Vérification
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'issues';
