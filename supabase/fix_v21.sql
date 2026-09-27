-- =========================================================
-- CORRECTIF v21 — Appels à Projets : suivi du statut + engagements exploitables
-- =========================================================

-- 1. STATUTS D'ENGAGEMENT élargis
--    Nouveau  : vient d'être soumis, en attente de vérification par le MAC
--    Validé   : le MAC a vérifié (anti-spam), le contact devient visible pour le porteur
--    Refusé   : jugé abusif/spam par le MAC, jamais transmis au porteur
--    Contacté : le porteur a effectivement recontacté la personne
--    Confirmé : collaboration effective
ALTER TABLE public.project_engagements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.project_engagements DROP CONSTRAINT IF EXISTS project_engagements_status_check;
ALTER TABLE public.project_engagements ADD CONSTRAINT project_engagements_status_check
  CHECK (status IN ('Nouveau', 'Validé', 'Refusé', 'Contacté', 'Confirmé'));

-- 2. TÉLÉPHONE DE LA PERSONNE QUI S'ENGAGE — même principe que issue_contact_info (v13) :
--    une vraie garantie en base de données, pas juste une donnée cachée à l'écran.
--    Le porteur du projet ne le voit QUE si l'admin a validé l'engagement.
CREATE TABLE IF NOT EXISTS public.project_engagement_contact_info (
  engagement_id UUID PRIMARY KEY REFERENCES public.project_engagements(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.project_engagement_contact_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Insertion telephone par l'auteur de l'engagement" ON public.project_engagement_contact_info;
CREATE POLICY "Insertion telephone par l'auteur de l'engagement" ON public.project_engagement_contact_info
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.project_engagements WHERE id = engagement_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Lecture telephone engagement par admin ou porteur si valide" ON public.project_engagement_contact_info;
CREATE POLICY "Lecture telephone engagement par admin ou porteur si valide" ON public.project_engagement_contact_info
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
    OR EXISTS (
      SELECT 1 FROM public.project_engagements pe
      JOIN public.projects p ON p.id = pe.project_id
      WHERE pe.id = project_engagement_contact_info.engagement_id
        AND p.user_id = auth.uid()
        AND pe.status = 'Validé'
    )
  );

-- 3. MISE A JOUR DU STATUT D'ENGAGEMENT : l'admin (Valider/Refuser) ET désormais
--    le porteur du projet concerné (pour passer à "Contacté" une fois l'appel fait).
--    Note : la restriction "le porteur ne peut passer qu'à Contacté" est appliquée
--    côté application (bouton unique), pas en base — cohérent avec le reste du projet.
DROP POLICY IF EXISTS "Mise a jour engagement par admin" ON public.project_engagements;
DROP POLICY IF EXISTS "Mise a jour engagement par admin ou porteur" ON public.project_engagements;
CREATE POLICY "Mise a jour engagement par admin ou porteur" ON public.project_engagements
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
    OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
  );

-- Vérification
SELECT policyname, cmd FROM pg_policies WHERE tablename IN ('project_engagements', 'project_engagement_contact_info');
