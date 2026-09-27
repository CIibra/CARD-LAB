import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { COLORS } from '../../theme';

export default function ParticipationProgress({ project }) {
  const { fetchProjectParticipation } = useProjects();
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetchProjectParticipation(project.id).then(setCount);
  }, [project.id, fetchProjectParticipation]);

  if (!project.target_participants) return null;

  const pct = count !== null ? Math.min(100, Math.round((count / project.target_participants) * 100)) : 0;

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: COLORS.navy }}>
          {count === null ? '…' : count} <span style={{ fontWeight: '600', color: COLORS.slate, fontSize: '11px' }}>/ {project.target_participants} personnes mobilisées</span>
        </span>
        <span style={{ fontSize: '13px', fontWeight: '800', color: COLORS.orange }}>
          {count !== null ? `${pct}%` : ''}
        </span>
      </div>
      <div style={{ height: '10px', background: COLORS.slateLight, borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.orange})`,
          borderRadius: '6px',
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
}
