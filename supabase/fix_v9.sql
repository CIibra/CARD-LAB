-- =========================================================
-- CORRECTIF v9 — Policies du bucket "issue-photos"
-- =========================================================
-- ⚠️ PRÉ-REQUIS : crée d'abord le bucket manuellement dans
-- Supabase → Storage → New bucket → nom "issue-photos" → coche "Public".
-- La création par SQL (INSERT dans storage.buckets) échoue souvent selon
-- les permissions du rôle utilisé dans le SQL Editor — d'où l'erreur
-- "Bucket not found" que tu as rencontrée.
--
-- Une fois le bucket créé à la main, exécute ce script (policies uniquement).
-- =========================================================

-- Note : RLS est déjà activé par défaut sur storage.objects par Supabase.
-- Inutile (et impossible sans être propriétaire de la table) de le réactiver
-- soi-même via ALTER TABLE — d'où l'erreur "must be owner of table objects"
-- si tu as tenté cette ligne. On passe directement aux policies :

DROP POLICY IF EXISTS "Lecture publique des photos de signalement" ON storage.objects;
CREATE POLICY "Lecture publique des photos de signalement" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-photos');

DROP POLICY IF EXISTS "Upload photos par utilisateur connecte" ON storage.objects;
CREATE POLICY "Upload photos par utilisateur connecte" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Suppression de sa propre photo" ON storage.objects;
CREATE POLICY "Suppression de sa propre photo" ON storage.objects
  FOR DELETE USING (bucket_id = 'issue-photos' AND owner = auth.uid());

-- Vérification : la première requête doit renvoyer une ligne avec public = true
SELECT id, name, public FROM storage.buckets WHERE id = 'issue-photos';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
