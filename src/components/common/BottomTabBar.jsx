import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BASE_TABS, PROFILE_TAB, ADMIN_TAB } from './navTabs';
import { COLORS } from '../../theme';

export default function BottomTabBar() {
  const { user, isAdmin } = useAuth();

  const tabs = [
    ...BASE_TABS.filter(tab => !(tab.hideForAdmin && isAdmin)),
    ...(user ? [PROFILE_TAB] : []),
    ...(isAdmin ? [ADMIN_TAB] : [])
  ];

  return (
    <nav className="bottom-tab-bar" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
      background: '#fff', borderTop: `1px solid ${COLORS.border}`,
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.06)'
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isAdminTab = tab.to === '/admin';
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            aria-label={tab.fullLabel}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '2px',
              padding: '8px 2px 6px',
              textDecoration: 'none',
              color: isActive ? (isAdminTab ? COLORS.orange : COLORS.green) : COLORS.slate
            })}
          >
            <Icon size={20} strokeWidth={2} />
            <span style={{ fontSize: '9.5px', fontWeight: '700', lineHeight: 1 }}>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
