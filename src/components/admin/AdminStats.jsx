import React, { useMemo } from 'react';

export default function AdminStats({ issues, solutions }) {
  const stats = useMemo(() => {
    const total = issues.length;
    const nouveaux = issues.filter(i => i.status === 'Nouveau').length;
    const enCours = issues.filter(i => i.status === 'En cours').length;
    const resolus = issues.filter(i => i.status === 'Résolu').length;
    const urgents = issues.filter(i => i.priority === 'urgente' && i.status !== 'Résolu' && i.status !== 'Archivé').length;
    const solutionsEnAttente = solutions.filter(s => s.status === 'proposé').length;
    return { total, nouveaux, enCours, resolus, urgents, solutionsEnAttente };
  }, [issues, solutions]);

  const cards = [
    { label: 'Signalements totaux', value: stats.total, color: '#0f172a' },
    { label: 'Nouveaux (non traités)', value: stats.nouveaux, color: '#64748b' },
    { label: 'Urgents en attente', value: stats.urgents, color: '#e11d48' },
    { label: 'En cours de traitement', value: stats.enCours, color: '#f97316' },
    { label: 'Résolus', value: stats.resolus, color: '#22c55e' },
    { label: 'Solutions à valider', value: stats.solutionsEnAttente, color: '#8b5cf6' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '26px', fontWeight: '800', color: c.color }}>{c.value}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
