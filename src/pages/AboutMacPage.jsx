import React from 'react';
import { ExternalLink } from 'lucide-react';
import { COLORS } from '../theme';

export default function AboutMacPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h1 style={{ color: COLORS.navy, fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>
          À propos du Mouvement Avenir Citoyen (MAC)
        </h1>
        <p style={{ fontSize: '13px', color: COLORS.slate, marginBottom: '24px' }}>
          Ensemble pour une Côte d'Ivoire plus résiliente et plus citoyenne
        </p>

        <Section title="Notre mission">
          Fondé pour répondre aux défis majeurs de nos cités, le <strong>MAC</strong> regroupe citoyens, experts et
          organisations au service de la résilience urbaine et du développement en Côte d'Ivoire. Notre mission est
          de créer un pont concret entre les besoins des populations et les acteurs capables d'y répondre —
          collectivités locales, entreprises, ONG et bénévoles — en s'appuyant sur la participation citoyenne directe.
        </Section>

        <Section title="Ce que nous faisons">
          La Carte Citoyenne est notre outil phare : elle permet à tout citoyen de signaler un problème
          d'infrastructure, d'insalubrité, d'accès à l'eau, d'éclairage public ou de sécurité dans son quartier.
          Chaque signalement est ensuite examiné, et toute organisation ou citoyen volontaire peut proposer une
          solution concrète, validée par notre équipe avant mise en œuvre. Au-delà de la carte, le MAC mène des
          actions d'éducation civique, des campagnes de sensibilisation au civisme, et facilite la mise en relation
          entre communautés et partenaires.
        </Section>

        <Section title="Nos valeurs">
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.9', textAlign: 'left' }}>
            <li><strong>Transparence</strong> — chaque signalement et chaque solution proposée est traçable.</li>
            <li><strong>Neutralité</strong> — le MAC agit indépendamment de toute affiliation politique, religieuse ou ethnique.</li>
            <li><strong>Responsabilité partagée</strong> — chaque acteur a un rôle à jouer.</li>
            <li><strong>Proximité</strong> — nos actions partent des réalités du terrain, quartier par quartier.</li>
          </ul>
        </Section>

        <Section title="Gouvernance">
          Le MAC est administré par un bureau qui valide chaque signalement critique et chaque proposition de
          solution avant sa mise en œuvre, garantissant ainsi la fiabilité des informations diffusées sur la
          plateforme et la bonne coordination entre les différents intervenants.
        </Section>

        <Section title="Rejoindre le mouvement">
          Que vous soyez un citoyen souhaitant signaler un problème, une entreprise voulant s'engager dans une
          démarche de responsabilité sociétale, ou une ONG à la recherche de terrains d'action concrets, le MAC
          est ouvert à toute contribution. Créez un compte pour commencer, ou contactez-nous depuis l'onglet dédié.
        </Section>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${COLORS.border}` }}>
          <a
            href="https://mac-84b.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: COLORS.navy, fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
          >
            Visiter le site officiel du MAC <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{title}</h2>
      <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.7', textAlign: 'justify' }}>{children}</div>
    </div>
  );
}
