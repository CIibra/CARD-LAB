import React from 'react';
import { Link } from 'react-router-dom';
import logoMac from '../../assets/logo-mac.png';

export default function LogoMac() {
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '5px 8px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
      }}>
        <img src={logoMac} alt="Logo MAC" style={{ height: '30px', width: 'auto', display: 'block' }} />
      </div>
    </Link>
  );
}
