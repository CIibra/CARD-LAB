import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { PROJECT_CATEGORIES, NEED_TYPES } from '../data/projectsData';
import ProposeProjectModal from '../components/projects/ProposeProjectModal';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';
import { timeAgo } from '../utils/timeAgo';
import { COLORS } from '../theme';

const VISIBLE_STATUSES = ['Publié', 'En cours', 'Terminé'];

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);

  const publicProjects = useMemo(() => projects.filter(p => VISIBLE_STATUSES.includes(p.status)), [projects]);

  const filteredProjects = useMemo(() => publicProjects.filter(p =>
    categoryFilter === 'Toutes' || p.category === categoryFilter
  ), [publicProjects, categoryFilter]);

  return (
    <div style={{ padding: '20px 20px 48px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: COLORS.navy, marginBottom: '8px' }}>
          Appels à Projets
        </h2>
        <p style={{ fontSize: '13px', color: COLORS.slate, lineHeight: '1.6' }}>
          Des initiatives portées par des citoyens, associations ou entreprises, validées par le MAC.
          Contribuez, financez, ou devenez bénévole sur les projets qui vous parlent.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selStyle}>
          <option value="Toutes">Toutes les catégories</option>
          {PROJECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <button
          onClick={() => setIsProposeOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.orange, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
        >
          <Plus size={16} /> Proposer un projet
        </button>
      </div>

      {loading && <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>}
      {!loading && filteredProjects.length === 0 && (
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
          Aucun projet publié pour le moment dans cette catégorie.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredProjects.map(project => (
          <button
            key={project.id}
            onClick={() => setDetailProject(project)}
            style={{
              background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '12px',
              padding: '16px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px'
            }}
          >
            {project.photos && project.photos.length > 0 && (
              <img src={project.photos[0]} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
            )}
            <span style={{ fontSize: '10px', fontWeight: '700', color: COLORS.green, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {PROJECT_CATEGORIES.find(c => c.value === project.category)?.label}
            </span>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{project.title}</h3>
            <p style={{
              fontSize: '12px', color: COLORS.slate, margin: 0, lineHeight: '1.4',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {NEED_TYPES.filter(t => project.need_types?.includes(t.value)).map(t => (
                <span key={t.value} style={{ background: COLORS.tealLight, color: COLORS.teal, fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '8px' }}>
                  {t.shortLabel}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{project.commune} — {timeAgo(project.created_at)}</span>
          </button>
        ))}
      </div>

      <ProposeProjectModal isOpen={isProposeOpen} onClose={() => setIsProposeOpen(false)} />
      <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
    </div>
  );
}

const selStyle = { padding: '8px 10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontSize: '12px' };
