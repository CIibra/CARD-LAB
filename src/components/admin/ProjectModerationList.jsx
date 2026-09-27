import React, { useState } from 'react';
import { PROJECT_CATEGORIES, PROJECT_STATUS_LABELS } from '../../data/projectsData';
import { COLORS } from '../../theme';

export default function ProjectModerationList({ projects, onValidate }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');

  if (projects.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucun projet en attente de validation.</p>;
  }

  const confirmReject = async (projectId) => {
    await onValidate(projectId, 'Refusé', reason);
    setRejectingId(null);
    setReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {projects.map(project => {
        const st = PROJECT_STATUS_LABELS[project.status];
        return (
          <div key={project.id} style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{project.title}</div>
                <div style={{ fontSize: '11px', color: COLORS.slate }}>
                  {PROJECT_CATEGORIES.find(c => c.value === project.category)?.label} — {project.commune}
                </div>
              </div>
              <span style={{ background: st?.color + '22', color: st?.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                {st?.label}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: '10px' }}>{project.description}</p>

            {project.status === 'En attente' && rejectingId !== project.id && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => onValidate(project.id, 'Publié')} style={btnAccept}>Publier</button>
                <button onClick={() => setRejectingId(project.id)} style={btnReject}>Refuser</button>
              </div>
            )}

            {rejectingId === project.id && (
              <div>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Raison du refus (visible par le porteur du projet)..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontSize: '12px', boxSizing: 'border-box', marginBottom: '8px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setRejectingId(null)} style={btnSecondary}>Annuler</button>
                  <button onClick={() => confirmReject(project.id)} style={btnReject}>Confirmer le refus</button>
                </div>
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
const btnSecondary = { background: '#f1f5f9', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
