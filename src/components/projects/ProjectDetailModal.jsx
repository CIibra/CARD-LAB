import React, { useState } from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { PROJECT_CATEGORIES, NEED_TYPES } from '../../data/projectsData';
import { timeAgo } from '../../utils/timeAgo';
import ParticipationProgress from './ParticipationProgress';
import EngagementModal from './EngagementModal';
import { COLORS } from '../../theme';

export default function ProjectDetailModal({ project, onClose }) {
  const [engagementType, setEngagementType] = useState(null);

  if (!project) return null;

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}
        onClick={onClose}
      >
        <div
          style={{ background: '#fff', width: '100%', maxWidth: '580px', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '20px 24px 12px', flexShrink: 0 }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: COLORS.green, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {PROJECT_CATEGORIES.find(c => c.value === project.category)?.label}
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{project.title}</h3>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', flexShrink: 0 }}>
              <X size={20} color={COLORS.slate} />
            </button>
          </div>

          <div style={{ padding: '4px 24px 20px', overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.slate }}>
                <MapPin size={13} /> {project.commune}{project.quartier ? ` — ${project.quartier}` : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.slate }}>
                <Clock size={13} /> {timeAgo(project.created_at)}
              </span>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-wrap', marginBottom: '14px' }}>
              {project.description}
            </p>

            {project.photos && project.photos.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {project.photos.map((url, i) => (
                  <img key={i} src={url} alt="" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${COLORS.border}` }} />
                ))}
              </div>
            )}

            <ParticipationProgress project={project} />

            <div style={{ marginTop: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.slate, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Comment participer
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {NEED_TYPES.filter(t => project.need_types?.includes(t.value)).map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setEngagementType(type.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px',
                        borderRadius: '10px', border: `1.5px solid ${COLORS.green}`, background: COLORS.greenLight,
                        cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <Icon size={18} color={COLORS.greenDark} />
                      <span style={{ fontSize: '12px', fontWeight: '800', color: COLORS.greenDark }}>{type.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EngagementModal
        project={project}
        engagementType={engagementType}
        onClose={() => setEngagementType(null)}
      />
    </>
  );
}
