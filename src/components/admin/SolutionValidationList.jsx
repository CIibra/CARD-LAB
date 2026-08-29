import React from 'react';

const STATUS_STYLE = {
  'proposé': { bg: '#fef9c3', color: '#854d0e', label: 'En attente' },
  'accepté': { bg: '#dcfce7', color: '#166534', label: 'Accepté' },
  'refusé': { bg: '#fee2e2', color: '#991b1b', label: 'Refusé' },
  'en_execution': { bg: '#dbeafe', color: '#1e40af', label: 'En exécution' },
  'terminé': { bg: '#e0e7ff', color: '#3730a3', label: 'Terminé' }
};

export default function SolutionValidationList({ solutions, onValidate }) {
  if (solutions.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucune proposition de solution pour le moment.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {solutions.map(sol => {
        const st = STATUS_STYLE[sol.status] || STATUS_STYLE['proposé'];
        return (
          <div key={sol.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  {sol.issues?.title || 'Signalement inconnu'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Proposé par {sol.profiles?.full_name || 'Utilisateur'} — {sol.issues?.commune}
                </div>
              </div>
              <span style={{ background: st.bg, color: st.color, fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                {st.label}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', marginBottom: '4px' }}>
              <strong>Solution :</strong> {sol.solution_description}
            </p>
            {sol.resources_offered && (
              <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', marginBottom: '10px' }}>
                <strong>Ressources :</strong> {sol.resources_offered}
              </p>
            )}

            {sol.status === 'proposé' && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => onValidate(sol.id, 'accepté')}
                  style={{ background: '#12384a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ✅ Confirmer
                </button>
                <button
                  onClick={() => onValidate(sol.id, 'refusé')}
                  style={{ background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ❌ Rejeter
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
