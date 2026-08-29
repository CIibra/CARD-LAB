import React from 'react';
import { REGIONS_CI, CATEGORIES, getVillesForRegion } from '../../data/regionsCI';

export default function FilterBar({
  selectedRegion, setSelectedRegion,
  selectedVille, setSelectedVille,
  selectedCategory, setSelectedCategory,
  onOpenReport
}) {
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedVille('Toutes');
  };

  return (
    <div style={{
      background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1',
      marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px',
      alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select value={selectedRegion} onChange={e => handleRegionChange(e.target.value)} style={selStyle}>
          <option value="Toutes">🇨🇮 Toutes les régions (Toute la Côte d'Ivoire)</option>
          {Object.keys(REGIONS_CI).map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={selectedVille} onChange={e => setSelectedVille(e.target.value)} style={selStyle}>
          <option value="Toutes">🏙️ Toutes les villes</option>
          {getVillesForRegion(selectedRegion).map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={selStyle}>
          <option value="Toutes">🏷️ Toutes les catégories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <button onClick={onOpenReport} style={{
        background: '#e11d48', color: '#fff', border: 'none', padding: '8px 16px',
        borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        📢 Signaler un problème
      </button>
    </div>
  );
}

const selStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '600' };
