import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronRight as Bullet } from 'lucide-react';
import { COLORS } from '../../theme';

export default function ChapterModal({ chapters, currentIndex, onClose, onGoTo }) {
  const isOpen = currentIndex !== null && currentIndex >= 0;
  const chapter = isOpen ? chapters[currentIndex] : null;
  const total = chapters.length;

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) onGoTo(currentIndex + 1);
  }, [currentIndex, total, onGoTo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onGoTo(currentIndex - 1);
  }, [currentIndex, onGoTo]);

  // Navigation au clavier (flèches + échap)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen || !chapter) return null;

  const Icon = chapter.icon;
  const progressPct = ((currentIndex + 1) / total) * 100;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', width: '100%', maxWidth: '560px', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barre de progression */}
        <div style={{ height: '4px', background: COLORS.slateLight, flexShrink: 0 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: COLORS.orange, transition: 'width 0.25s ease' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px 16px', flexShrink: 0 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: COLORS.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={26} color={COLORS.navy} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Chapitre {currentIndex + 1} / {total}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: COLORS.navy, margin: '2px 0 0' }}>
              {chapter.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
            <X size={20} color={COLORS.slate} />
          </button>
        </div>

        {/* Corps scrollable */}
        <div style={{ padding: '4px 24px 20px', overflowY: 'auto', flex: 1 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {chapter.points.map((point, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ marginTop: '3px', flexShrink: 0, width: '20px', height: '20px', borderRadius: '6px', background: COLORS.orangeLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bullet size={13} color={COLORS.orange} strokeWidth={2.5} />
                </span>
                <span style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            style={{ ...navBtn, opacity: currentIndex === 0 ? 0.35 : 1, cursor: currentIndex === 0 ? 'default' : 'pointer' }}
          >
            <ChevronLeft size={16} /> Précédent
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {chapters.map((_, i) => (
              <span key={i} style={{
                width: i === currentIndex ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === currentIndex ? COLORS.orange : COLORS.border,
                transition: 'all 0.2s'
              }} />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentIndex === total - 1}
            style={{ ...navBtn, opacity: currentIndex === total - 1 ? 0.35 : 1, cursor: currentIndex === total - 1 ? 'default' : 'pointer' }}
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  display: 'flex', alignItems: 'center', gap: '4px',
  background: COLORS.navy, color: '#fff', border: 'none',
  padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700'
};
