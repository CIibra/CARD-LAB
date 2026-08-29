import React from 'react';
import { COLORS } from '../../theme';

export default function ResolutionConfirmList({ solutions, onConfirm }) {
  // Ne montre que les travaux terminés dont le signalement n'est pas déjà résolu
  const pending = solutions.filter(s => s.status === 'terminé' && s.issues?.status !== 'Résolu');

  if (pending.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucun travail terminé en attente de confirmation.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {pending.map(sol => (
        <div key={sol.id} style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            {sol.issues?.title || 'Signalement'}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.slate, marginBottom: '10px' }}>
            Réalisé par {sol.profiles?.full_name || 'un prestataire'} — {sol.issues?.commune}
          </div>
          <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: '12px' }}>
            {sol.solution_description}
          </p>
          {sol.completion_photos && sol.completion_photos.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {sol.completion_photos.map((url, i) => (
                <img key={i} src={url} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${COLORS.border}` }} />
              ))}
            </div>
          )}
          <button
            onClick={() => onConfirm(sol.issue_id)}
            style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Confirmer la résolution
          </button>
        </div>
      ))}
    </div>
  );
}
