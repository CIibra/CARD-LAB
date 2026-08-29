import React from 'react';
import BadgeStatus from '../common/BadgeStatus';

export default function IssueDetail({ issue, onClose }) {
  if (!issue) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BadgeStatus status={issue.status} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {new Date(issue.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>

        <h2 style={{ fontSize: '20px', marginTop: '8px' }}>{issue.title}</h2>

        <p style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
          📍 {issue.commune} {issue.quartier ? `• ${issue.quartier}` : ''}
        </p>

        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '14px', color: '#334155' }}>
          {issue.description || 'Aucune description fournie.'}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}