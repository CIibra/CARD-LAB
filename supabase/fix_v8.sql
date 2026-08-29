-- =========================================================
-- CORRECTIF v8 — Stockage des photos de signalement (max 2 par signalement)
-- =========================================================

-- 1. Créer le bucket public "issue-photos" (ne fait rien s'il existe déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-photos', 'issue-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies sur storage.objects pour ce bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des photos de signalement" ON storage.objects;
CREATE POLICY "Lecture publique des photos de signalement" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-photos');

DROP POLICY IF EXISTS "Upload photos par utilisateur connecte" ON storage.objects;
CREATE POLICY "Upload photos par utilisateur connecte" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Suppression de sa propre photo" ON storage.objects;
CREATE POLICY "Suppression de sa propre photo" ON storage.objects
  FOR DELETE USING (bucket_id = 'issue-photos' AND owner = auth.uid());

-- Vérification
SELECT id, name, public FROM storage.buckets WHERE id = 'issue-photos';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
