import React from 'react';
import { STATUS_LABELS } from '../../data/regionsCI';

export default function BadgeStatus({ status }) {
  const info = STATUS_LABELS[status] || { label: status, color: '#64748b' };
  return (
    <span style={{
      background: info.color,
      color: '#fff',
      fontSize: '10px',
      fontWeight: '800',
      padding: '3px 8px',
      borderRadius: '10px',
      whiteSpace: 'nowrap'
    }}>
      {info.label}
    </span>
  );
}
