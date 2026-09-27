import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      // La policy RLS filtre déjà : public si Publié/En cours/Terminé,
      // sinon uniquement visible par son auteur ou l'admin.
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erreur chargement projets:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(async (payload) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: payload.title,
          description: payload.description,
          category: payload.category,
          commune: payload.commune,
          quartier: payload.quartier || '',
          photos: payload.photos || [],
          need_types: payload.need_types || [],
          target_participants: payload.target_participants || null,
          user_id: payload.user_id,
          status: 'En attente'
        }])
        .select();
      if (error) return { success: false, error };
      if (data && data.length > 0) {
        setProjects((prev) => [data[0], ...prev]);
        return { success: true, project: data[0] };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, []);

  // Admin : publier, refuser, ou faire évoluer le statut d'un projet
  const updateProjectStatus = useCallback(async (projectId, status, rejectionReason = null) => {
    try {
      const updates = { status, updated_at: new Date().toISOString() };
      if (rejectionReason !== null) updates.rejection_reason = rejectionReason;

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select();
      if (error) return { success: false, error };

      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  }, []);

  // Enregistrer un engagement (contribution, financement, bénévolat, info)
  // Le téléphone part dans project_engagement_contact_info (lecture protégée,
  // voir fix_v21.sql) — jamais dans project_engagements lui-même.
  const addEngagement = useCallback(async (projectId, userId, payload) => {
    try {
      const { data, error } = await supabase
        .from('project_engagements')
        .insert([{
          project_id: projectId,
          user_id: userId,
          engagement_type: payload.engagement_type,
          message: payload.message || '',
          amount: payload.amount || null,
          status: 'Nouveau'
        }])
        .select();
      if (error) return { success: false, error };

      const engagement = data && data[0];
      if (engagement && payload.phone) {
        const { error: phoneError } = await supabase
          .from('project_engagement_contact_info')
          .insert([{ engagement_id: engagement.id, phone: payload.phone }]);
        if (phoneError) console.error('Erreur enregistrement téléphone engagement:', phoneError.message);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  }, []);

  // Nombre de participants distincts (tous types d'engagement confondus) pour
  // la barre de progression publique — on mobilise des personnes, pas une cagnotte.
  const fetchProjectParticipation = useCallback(async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_engagements')
        .select('user_id')
        .eq('project_id', projectId);
      if (error) throw error;
      const distinctUsers = new Set((data || []).map(e => e.user_id).filter(Boolean));
      return distinctUsers.size;
    } catch (err) {
      console.error('Erreur chargement participation:', err.message);
      return 0;
    }
  }, []);

  // Engagements reçus sur UN projet donné, avec le téléphone joint quand la
  // RLS l'autorise (admin, ou porteur si l'engagement est "Validé" — sinon la
  // jointure revient simplement vide, pas d'erreur). Usage : porteur du projet.
  const fetchProjectEngagements = useCallback(async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_engagements')
        .select('*, project_engagement_contact_info(phone)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur chargement engagements du projet:', err.message);
      return [];
    }
  }, []);

  // Toutes les propositions d'engagement (usage admin)
  const fetchAllEngagements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('project_engagements')
        .select('*, projects(title, commune), profiles(full_name), project_engagement_contact_info(phone)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur chargement engagements:', err.message);
      return [];
    }
  }, []);

  const updateEngagementStatus = useCallback(async (engagementId, status) => {
    try {
      const { data, error } = await supabase
        .from('project_engagements')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', engagementId)
        .select();
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      fetchProjects,
      addProject,
      updateProjectStatus,
      addEngagement,
      fetchProjectParticipation,
      fetchProjectEngagements,
      fetchAllEngagements,
      updateEngagementStatus
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
