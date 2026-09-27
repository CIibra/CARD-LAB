import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

const POLL_INTERVAL_MS = 20000; // 20s : suffisant pour un ressenti "vivant" sans surcharger

function lastSeenKey(userId) {
  return `profil_last_seen_${userId}`;
}

export function getProfilLastSeen(userId) {
  const raw = localStorage.getItem(lastSeenKey(userId));
  return raw ? new Date(raw) : new Date(0);
}

export function markProfilAsSeen(userId) {
  localStorage.setItem(lastSeenKey(userId), new Date().toISOString());
}

// Indique s'il y a du nouveau à voir dans "Mon Profil" depuis la dernière visite :
// réponse du MAC à un message, solution acceptée/refusée, son propre
// signalement qui a avancé au-delà de "Nouveau", un de ses projets dont le
// statut a bougé (publié/refusé), ou un engagement reçu sur un de ses
// projets qui vient d'être validé par le MAC (contact désormais disponible).
export function useProfileNotifications() {
  const { user } = useAuth();
  const [hasNotifications, setHasNotifications] = useState(false);

  const check = useCallback(async () => {
    if (!user) {
      setHasNotifications(false);
      return;
    }
    const lastSeen = getProfilLastSeen(user.id).toISOString();

    try {
      const [messagesRes, solutionsRes, issuesRes, projectsRes, myProjectIdsRes] = await Promise.all([
        supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('replied_at', 'is', null)
          .gt('replied_at', lastSeen),
        supabase
          .from('issue_solutions')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .in('status', ['accepté', 'refusé'])
          .gt('updated_at', lastSeen),
        supabase
          .from('issues')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .neq('status', 'Nouveau')
          .gt('updated_at', lastSeen),
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .neq('status', 'En attente')
          .gt('updated_at', lastSeen),
        supabase
          .from('projects')
          .select('id')
          .eq('user_id', user.id)
      ]);

      let engagementsCount = 0;
      const myProjectIds = (myProjectIdsRes.data || []).map(p => p.id);
      if (myProjectIds.length > 0) {
        const engagementsRes = await supabase
          .from('project_engagements')
          .select('id', { count: 'exact', head: true })
          .in('project_id', myProjectIds)
          .eq('status', 'Validé')
          .gt('updated_at', lastSeen);
        engagementsCount = engagementsRes.count || 0;
      }

      const total = (messagesRes.count || 0) + (solutionsRes.count || 0) + (issuesRes.count || 0)
        + (projectsRes.count || 0) + engagementsCount;
      setHasNotifications(total > 0);
    } catch (err) {
      console.error('Erreur vérification notifications:', err.message);
    }
  }, [user]);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [check]);

  return { hasNotifications, refresh: check };
}
