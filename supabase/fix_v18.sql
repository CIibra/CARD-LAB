-- =========================================================
-- CORRECTIF v18 — Suivi des mises à jour pour les notifications
-- =========================================================

ALTER TABLE public.issue_solutions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Vérification
SELECT column_name FROM information_schema.columns WHERE table_name = 'issue_solutions';
