import React from 'react';
import { NEED_TYPES, ENGAGEMENT_STATUS_LABELS } from '../../data/projectsData';
import { timeAgo } from '../../utils/timeAgo';
import { COLORS } from '../../theme';

export default function EngagementModerationList({ engagements, onValidate }) {
  if (engagements.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucun engagement pour le moment.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {engagements.map(eng => {
        const st = ENGAGEMENT_STATUS_LABELS[eng.status];
        const typeInfo = NEED_TYPES.find(t => t.value === eng.engagement_type);
        const phone = eng.project_engagement_contact_info?.phone;

        return (
          <div key={eng.id} style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  {typeInfo?.shortLabel} — {eng.projects?.title || 'Projet supprimé'}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.slate }}>
                  {eng.profiles?.full_name || 'Utilisateur'} · {eng.projects?.commune} · {timeAgo(eng.created_at)}
                </div>
              </div>
              <span style={{ background: st?.color + '22', color: st?.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                {st?.label}
              </span>
            </div>

            {eng.message && (
              <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: '8px' }}>{eng.message}</p>
            )}
            {eng.amount && (
              <p style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>Montant envisagé : <strong>{eng.amount.toLocaleString('fr-FR')} FCFA</strong></p>
            )}
            <p style={{ fontSize: '12px', color: COLORS.navy, marginBottom: '10px' }}>
              Téléphone : <strong>{phone || 'Non disponible'}</strong>
            </p>

            {eng.status === 'Nouveau' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => onValidate(eng.id, 'Validé')} style={btnAccept}>Valider (transmettre au porteur)</button>
                <button onClick={() => onValidate(eng.id, 'Refusé')} style={btnReject}>Refuser</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const btnAccept = { background: '#0e7a4f', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const btnReject = { background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
