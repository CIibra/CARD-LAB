-- =========================================================
-- CORRECTIF v20 — Appels à Projets
-- =========================================================

-- 1. TABLE PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  commune TEXT NOT NULL,
  quartier TEXT,
  photos TEXT[] DEFAULT '{}',
  need_types TEXT[] NOT NULL DEFAULT '{}', -- 'contribution' | 'financement' | 'benevolat' | 'info'
  target_participants INTEGER, -- objectif de nombre de participants (facultatif, tous types d'engagement confondus)
  status TEXT CHECK (status IN ('En attente', 'Publié', 'Refusé', 'En cours', 'Terminé', 'Archivé')) DEFAULT 'En attente',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Lecture publique des projets PUBLIÉS uniquement, + le porteur voit toujours le sien, + l'admin voit tout
DROP POLICY IF EXISTS "Lecture publique des projets publies" ON public.projects;
CREATE POLICY "Lecture publique des projets publies" ON public.projects
  FOR SELECT USING (
    status IN ('Publié', 'En cours', 'Terminé')
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

DROP POLICY IF EXISTS "Creation projet par utilisateur connecte" ON public.projects;
CREATE POLICY "Creation projet par utilisateur connecte" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Modification projet par admin ou auteur si en attente" ON public.projects;
CREATE POLICY "Modification projet par admin ou auteur si en attente" ON public.projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
    OR (auth.uid() = user_id AND status = 'En attente')
  );


-- 2. TABLE PROJECT_ENGAGEMENTS (contributions, financements, bénévolat, demandes d'infos)
CREATE TABLE IF NOT EXISTS public.project_engagements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  engagement_type TEXT CHECK (engagement_type IN ('contribution', 'financement', 'benevolat', 'info')) NOT NULL,
  message TEXT,
  amount NUMERIC, -- montant proposé, si type = financement (privé, jamais public)
  status TEXT CHECK (status IN ('Nouveau', 'Contacté', 'Confirmé')) DEFAULT 'Nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.project_engagements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creation engagement par utilisateur connecte" ON public.project_engagements;
CREATE POLICY "Creation engagement par utilisateur connecte" ON public.project_engagements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Lecture : l'admin, le porteur du projet, et l'auteur de l'engagement lui-même
DROP POLICY IF EXISTS "Lecture engagement par admin porteur ou auteur" ON public.project_engagements;
CREATE POLICY "Lecture engagement par admin porteur ou auteur" ON public.project_engagements
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

DROP POLICY IF EXISTS "Mise a jour engagement par admin" ON public.project_engagements;
CREATE POLICY "Mise a jour engagement par admin" ON public.project_engagements
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'mac_admin')
  );

-- Vérification
SELECT table_name FROM information_schema.tables WHERE table_name IN ('projects', 'project_engagements');
