import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { PROJECT_CATEGORIES, PROJECT_STATUS_LABELS, NEED_TYPES, ENGAGEMENT_STATUS_LABELS } from '../../data/projectsData';
import { timeAgo } from '../../utils/timeAgo';
import { COLORS } from '../../theme';

const HAS_ENGAGEMENTS_STATUSES = ['Publié', 'En cours', 'Terminé'];

export default function MyProjectCard({ project }) {
  const { fetchProjectEngagements, updateEngagementStatus } = useProjects();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [engagements, setEngagements] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const st = PROJECT_STATUS_LABELS[project.status];
  const canHaveEngagements = HAS_ENGAGEMENTS_STATUSES.includes(project.status);

  const toggleExpand = async () => {
    if (!canHaveEngagements) return;
    if (!expanded && engagements === null) {
      setLoading(true);
      const data = await fetchProjectEngagements(project.id);
      setEngagements(data);
      setLoading(false);
    }
    setExpanded(!expanded);
  };

  const markContacted = async (engagementId) => {
    setUpdatingId(engagementId);
    const result = await updateEngagementStatus(engagementId, 'Contacté');
    if (result.success) {
      setEngagements(prev => prev.map(e => (e.id === engagementId ? { ...e, status: 'Contacté' } : e)));
    } else {
      alert("Erreur : " + (result.error?.message || ''));
    }
    setUpdatingId(null);
  };

  return (
    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{project.title}</div>
          <div style={{ fontSize: '11px', color: COLORS.slate }}>
            {PROJECT_CATEGORIES.find(c => c.value === project.category)?.label} — {project.commune} · {timeAgo(project.created_at)}
          </div>
        </div>
        <span style={{ background: st?.color + '22', color: st?.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
          {st?.label}
        </span>
      </div>

      {project.status === 'Refusé' && project.rejection_reason && (
        <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '10px', fontSize: '12px', marginTop: '8px' }}>
          <strong>Raison du refus :</strong> {project.rejection_reason}
        </div>
      )}

      {project.status === 'En attente' && (
        <p style={{ fontSize: '11px', color: COLORS.slate, fontStyle: 'italic', marginTop: '6px' }}>
          En attente de validation par le bureau du MAC.
        </p>
      )}

      {canHaveEngagements && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={toggleExpand} style={toggleBtn}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Masquer les engagements reçus' : 'Voir les engagements reçus'}
          </button>

          {expanded && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loading && <p style={{ fontSize: '12px', color: '#94a3b8' }}>Chargement…</p>}
              {!loading && engagements?.length === 0 && (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Aucun engagement reçu pour l'instant.</p>
              )}
              {!loading && engagements?.map(eng => {
                const typeInfo = NEED_TYPES.find(t => t.value === eng.engagement_type);
                const engSt = ENGAGEMENT_STATUS_LABELS[eng.status];
                const phone = eng.project_engagement_contact_info?.phone;
                const isUpdating = updatingId === eng.id;

                return (
                  <div key={eng.id} style={{ background: COLORS.slateLight, borderRadius: '8px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: COLORS.navy }}>{typeInfo?.shortLabel}</span>
                      <span style={{ background: engSt?.color + '22', color: engSt?.color, fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                        {engSt?.label}
                      </span>
                    </div>
                    {eng.message && <p style={{ fontSize: '12px', color: '#334155', marginBottom: '4px' }}>{eng.message}</p>}
                    {eng.amount && <p style={{ fontSize: '11px', color: '#334155', marginBottom: '4px' }}>Montant envisagé : {eng.amount.toLocaleString('fr-FR')} FCFA</p>}
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: eng.status === 'Validé' ? '8px' : '0' }}>{timeAgo(eng.created_at)}</p>

                    {eng.status === 'Validé' && (
                      <>
                        <p style={{ fontSize: '12px', color: COLORS.greenDark, fontWeight: '700', marginBottom: '8px' }}>
                          Contact : {phone || 'en cours de transmission'}
                        </p>
                        <button onClick={() => markContacted(eng.id)} disabled={isUpdating} style={{ ...contactedBtn, opacity: isUpdating ? 0.7 : 1 }}>
                          {isUpdating ? 'Mise à jour…' : "J'ai contacté cette personne"}
                        </button>
                      </>
                    )}
                    {eng.status === 'Nouveau' && (
                      <p style={{ fontSize: '11px', color: COLORS.slate, fontStyle: 'italic' }}>
                        En attente de vérification par le MAC avant transmission du contact.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const toggleBtn = {
  display: 'flex', alignItems: 'center', gap: '4px',
  background: 'none', border: 'none', color: COLORS.green,
  fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0
};
const contactedBtn = {
  background: COLORS.green, color: '#fff', border: 'none',
  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
};
