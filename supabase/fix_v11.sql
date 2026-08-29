-- =========================================================
-- CORRECTIF v11 — Photos de réalisation à la fin des travaux
-- =========================================================

ALTER TABLE public.issue_solutions ADD COLUMN IF NOT EXISTS completion_photos TEXT[] DEFAULT '{}';

-- Vérification
SELECT column_name FROM information_schema.columns WHERE table_name = 'issue_solutions';
