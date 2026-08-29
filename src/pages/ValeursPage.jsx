import React, { useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import ChapterModal from '../components/citizen/ChapterModal';
import { COLORS } from '../theme';

export default function ValeursPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ padding: '20px', maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, marginBottom: '20px' }}>
        <h2 style={{ color: COLORS.navy, fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>
          Éducation Civique & Citoyenneté
        </h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
          Le Mouvement Avenir Citoyen s'engage à inculquer aux Ivoiriens le sens du civisme, de la responsabilité
          individuelle et collective, et de l'engagement dans le développement du pays. Cliquez sur un chapitre
          pour le découvrir.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {CHAPTERS.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <button
              key={index}
              onClick={() => setOpenIndex(index)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
                background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '12px',
                padding: '18px', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: COLORS.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={COLORS.navy} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: COLORS.orange, letterSpacing: '0.5px', marginBottom: '4px' }}>
                  CHAPITRE {index + 1}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: COLORS.navy, lineHeight: '1.3' }}>
                  {chapter.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ChapterModal
        chapters={CHAPTERS}
        currentIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onGoTo={setOpenIndex}
      />
    </div>
  );
}
