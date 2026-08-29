import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const IssueContext = createContext();

// Statuts avant lesquels on peut encore auto-avancer sans écraser une progression manuelle de l'admin
const EARLY_STATUSES = ['Nouveau', 'En vérification', 'Confirmé'];
const PRE_PARTNER_STATUSES = ['Nouveau', 'En vérification', 'Confirmé', 'Solution proposée'];

export function IssueProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err) {
      console.error('Erreur chargement signalements:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Ajouter un nouveau signalement (le user_id de l'auteur est maintenant bien enregistré)
  const addIssue = async (newIssue) => {
    try {
      const payload = {
        title: newIssue.title,
        category: newIssue.category || 'autre',
        commune: newIssue.commune,
        quartier: newIssue.quartier || '',
        adresse_complement: newIssue.adresse_complement || null,
        description: newIssue.description || '',
        priority: newIssue.priority || 'faible',
        latitude: parseFloat(newIssue.latitude),
        longitude: parseFloat(newIssue.longitude),
        status: 'Nouveau',
        user_id: newIssue.user_id || null,
        photos: newIssue.photos || []
      };

      const { data, error } = await supabase
        .from('issues')
        .insert([payload])
        .select();

      if (error) {
        console.error('Erreur Supabase lors de l\'insertion:', error);
        return { success: false, error };
      }

      if (data && data.length > 0) {
        const createdIssue = data[0];

        // Le téléphone est enregistré à part, dans une table à lecture strictement réservée au MAC
        if (newIssue.phone) {
          const { error: phoneError } = await supabase
            .from('issue_contact_info')
            .insert([{ issue_id: createdIssue.id, phone: newIssue.phone }]);
          if (phoneError) {
            console.error('Erreur enregistrement téléphone:', phoneError);
            // Le signalement est déjà créé : on ne bloque pas l'utilisateur pour autant,
            // mais on le signale pour diagnostic.
          }
        }

        setIssues((prev) => [createdIssue, ...prev]);
        return { success: true, issue: createdIssue };
      }
      await fetchIssues();
      return { success: true };
    } catch (err) {
      console.error('Exception addIssue:', err);
      return { success: false, error: err };
    }
  };

  // Changer le statut d'un signalement (admin, ou auto-avancement interne)
  const updateIssueStatus = async (issueId, status) => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId)
        .select();

      if (error) return { success: false, error };

      setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status } : i)));
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const confirmIssue = async (issueId, userId) => {
    try {
      const { error } = await supabase
        .from('issue_confirmations')
        .insert([{ issue_id: issueId, user_id: userId }]);
      if (error && error.code !== '23505') {
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // Modifier son propre signalement (l'auteur uniquement, via policy RLS existante)
  const updateIssue = async (issueId, updates) => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .update({
          title: updates.title,
          category: updates.category,
          priority: updates.priority,
          quartier: updates.quartier,
          adresse_complement: updates.adresse_complement,
          description: updates.description,
          photos: updates.photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId)
        .select();

      if (error) return { success: false, error };

      setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ...data[0] } : i)));
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // Supprimer son propre signalement (autorisé uniquement si statut "Nouveau", via policy RLS)
  const deleteIssue = async (issueId) => {
    try {
      const { error } = await supabase.from('issues').delete().eq('id', issueId);
      if (error) return { success: false, error };

      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // Proposer une solution — fait automatiquement avancer le signalement en "Solution proposée"
  // s'il n'a pas déjà progressé plus loin (ne rétrograde jamais un statut plus avancé).
  const addSolution = async (issueId, providerId, payload) => {
    try {
      const { data, error } = await supabase
        .from('issue_solutions')
        .insert([{
          issue_id: issueId,
          provider_id: providerId,
          solution_description: payload.solution_description,
          resources_offered: payload.resources_offered || '',
          status: 'proposé'
        }])
        .select();

      if (error) return { success: false, error };

      const currentIssue = issues.find(i => i.id === issueId);
      if (currentIssue && EARLY_STATUSES.includes(currentIssue.status)) {
        await updateIssueStatus(issueId, 'Solution proposée');
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const fetchAllSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('issue_solutions')
        .select('*, issues(title, commune, status), profiles(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur chargement solutions:', err.message);
      return [];
    }
  };

  // IDs des signalements pour lesquels l'utilisateur a une solution validée
  // (accepté / en_execution / terminé) — donc autorisé à voir l'adresse exacte.
  const fetchMyClearedIssueIds = async (userId) => {
    if (!userId) return new Set();
    try {
      const { data, error } = await supabase
        .from('issue_solutions')
        .select('issue_id')
        .eq('provider_id', userId)
        .in('status', ['accepté', 'en_execution', 'terminé']);
      if (error) throw error;
      return new Set((data || []).map(r => r.issue_id));
    } catch (err) {
      console.error('Erreur chargement des accès autorisés:', err.message);
      return new Set();
    }
  };

  // Changer le statut d'une solution : utilisé par l'admin (accepté/refusé) ET par
  // le prestataire lui-même depuis son profil (en_execution/terminé).
  // issueId est optionnel : quand fourni et que le nouveau statut est "accepté",
  // le signalement lié avance automatiquement vers "Partenaire identifié".
  const updateSolutionStatus = async (solutionId, status, issueId = null) => {
    try {
      const { data, error } = await supabase
        .from('issue_solutions')
        .update({ status })
        .eq('id', solutionId)
        .select();
      if (error) return { success: false, error };

      if (issueId && status === 'accepté') {
        const currentIssue = issues.find(i => i.id === issueId);
        if (currentIssue && PRE_PARTNER_STATUSES.includes(currentIssue.status)) {
          await updateIssueStatus(issueId, 'Partenaire identifié');
        }
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // Le prestataire signale la fin des travaux, avec éventuellement des photos de la réalisation
  const completeSolution = async (solutionId, photoUrls = []) => {
    try {
      const { data, error } = await supabase
        .from('issue_solutions')
        .update({ status: 'terminé', completion_photos: photoUrls })
        .eq('id', solutionId)
        .select();
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return (
    <IssueContext.Provider value={{
      issues,
      loading,
      fetchIssues,
      addIssue,
      updateIssue,
      deleteIssue,
      updateIssueStatus,
      confirmIssue,
      addSolution,
      fetchAllSolutions,
      fetchMyClearedIssueIds,
      updateSolutionStatus,
      completeSolution
    }}>
      {children}
    </IssueContext.Provider>
  );
}

export const useIssues = () => useContext(IssueContext);
