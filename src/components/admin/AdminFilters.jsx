import React from 'react';
import { CATEGORIES, STATUS_LABELS } from '../../data/regionsCI';
import { COLORS } from '../../theme';

export default function AdminFilters({ statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, communeSearch, setCommuneSearch }) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selStyle}>
        <option value="Toutes">Tous les statuts</option>
        {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selStyle}>
        <option value="Toutes">Toutes les catégories</option>
        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>

      <input
        type="text"
        value={communeSearch}
        onChange={e => setCommuneSearch(e.target.value)}
        placeholder="Rechercher une commune..."
        style={{ ...selStyle, minWidth: '180px' }}
      />
    </div>
  );
}

const selStyle = { padding: '7px 10px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontSize: '12px' };
