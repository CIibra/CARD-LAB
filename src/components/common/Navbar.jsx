import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BookOpen, Mail, Info, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import LogoMac from './LogoMac';
import { COLORS } from '../../theme';

const BASE_TABS = [
  { to: '/', label: 'Carte & Signalements', icon: Map, end: true },
  { to: '/valeurs', label: 'Éducation & Valeurs', icon: BookOpen },
  { to: '/contact', label: 'Contacter le MAC', icon: Mail, hideForAdmin: true },
  { to: '/a-propos', label: 'À propos', icon: Info }
];

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const tabs = BASE_TABS.filter(tab => !(tab.hideForAdmin && isAdmin));

  return (
    <>
      <header style={{
        background: COLORS.green,
        color: '#fff',
        padding: '10px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div>
          <LogoMac />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '19px', fontWeight: '800', margin: 0 }}>La carte des citoyens ivoiriens</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <UserCircle size={16} />
                {profile?.full_name || 'Utilisateur'}
                {isAdmin && <span style={{ background: COLORS.orange, padding: '1px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: '4px' }}>ADMIN</span>}
              </span>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} style={{ background: COLORS.orange, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Connexion / Inscription
            </button>
          )}
        </div>
      </header>

      <nav style={{ background: '#fff', borderBottom: `1px solid ${COLORS.border}`, padding: '0 24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              style={({ isActive }) => ({
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
                borderBottom: isActive ? `3px solid ${COLORS.green}` : '3px solid transparent',
                color: isActive ? COLORS.green : COLORS.slate,
                fontWeight: isActive ? '700' : '500',
                fontSize: '13px'
              })}
            >
              <Icon size={15} /> {tab.label}
            </NavLink>
          );
        })}

        {user && (
          <NavLink
            to="/profil"
            style={({ isActive }) => ({
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: isActive ? `3px solid ${COLORS.green}` : '3px solid transparent',
              color: isActive ? COLORS.green : COLORS.slate,
              fontWeight: isActive ? '700' : '500',
              fontSize: '13px'
            })}
          >
            <UserCircle size={15} /> Mon Profil
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: isActive ? `3px solid ${COLORS.orange}` : '3px solid transparent',
              color: COLORS.orange,
              fontWeight: '700',
              fontSize: '13px'
            })}
          >
            <Shield size={15} /> Espace Admin
          </NavLink>
        )}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
