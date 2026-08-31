import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, BookOpen, Mail, Info, Shield, UserCircle, LogIn, LogOut } from 'lucide-react';
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
        padding: '10px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div>
          <LogoMac />
        </div>

        <div style={{ textAlign: 'center', minWidth: 0 }}>
          <h1 className="site-title" style={{ fontSize: '19px', fontWeight: '800', margin: 0, whiteSpace: 'nowrap' }}>
            La carte des citoyens
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', minWidth: 0 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span className="user-name-text" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                <UserCircle size={16} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || 'Utilisateur'}</span>
                {isAdmin && <span style={{ background: COLORS.orange, padding: '1px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: '2px', flexShrink: 0 }}>ADMIN</span>}
              </span>
              <button
                onClick={logout}
                aria-label="Déconnexion"
                className="auth-btn"
                style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', padding: '7px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
              >
                <LogOut size={15} />
                <span className="auth-btn-text">Déconnexion</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              aria-label="Connexion / Inscription"
              className="auth-btn"
              style={{ background: COLORS.orange, color: '#fff', border: 'none', padding: '8px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogIn size={16} />
              <span className="auth-btn-text">Connexion / Inscription</span>
            </button>
          )}
        </div>
      </header>

      <nav className="main-nav" style={{ background: '#fff', borderBottom: `1px solid ${COLORS.border}`, padding: '0 16px', display: 'flex', gap: '18px' }}>
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
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
              whiteSpace: 'nowrap',
              flexShrink: 0,
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
              whiteSpace: 'nowrap',
              flexShrink: 0,
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
