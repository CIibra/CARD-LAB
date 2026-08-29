import React from 'react';
import { ExternalLink } from 'lucide-react';
import { COLORS } from '../../theme';

export default function Footer() {
  return (
    <footer style={{ marginTop: '40px', background: COLORS.navy, color: '#fff' }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '28px 24px',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px'
      }}>
        <div style={{ maxWidth: '360px' }}>
          <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '6px' }}>Mouvement Avenir Citoyen</div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
            Une plateforme citoyenne au service de la résilience urbaine et du développement en Côte d'Ivoire.
          </p>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: COLORS.orange, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Liens utiles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FooterLink href="/" label="Carte & Signalements" />
            <FooterLink href="/valeurs" label="Éducation & Valeurs" />
            <FooterLink href="/contact" label="Contacter le MAC" />
            <FooterLink href="/a-propos" label="À propos" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: COLORS.orange, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Officiel
          </div>
          <a
            href="https://mac-84b.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#fff', fontWeight: '600', textDecoration: 'none' }}
          >
            Site officiel du MAC <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: '14px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
          © {new Date().getFullYear()} Mouvement Avenir Citoyen — Côte d'Ivoire
        </span>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <a href={href} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
      {label}
    </a>
  );
}
