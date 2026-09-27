import React from 'react';
import { NEED_TYPES } from '../../data/projectsData';
import { COLORS } from '../../theme';

export default function NeedTypeSelector({ selected, onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {NEED_TYPES.map(type => {
        const Icon = type.icon;
        const isSelected = selected.includes(type.value);
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => toggle(type.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px', borderRadius: '8px', cursor: 'pointer',
              border: `1.5px solid ${isSelected ? COLORS.green : COLORS.border}`,
              background: isSelected ? COLORS.greenLight : '#fff',
              textAlign: 'left'
            }}
          >
            <Icon size={17} color={isSelected ? COLORS.greenDark : COLORS.slate} strokeWidth={2} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? COLORS.greenDark : COLORS.navy }}>
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
