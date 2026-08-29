import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORIES } from '../../data/regionsCI';
import { COLORS } from '../../theme';
import { timeAgo } from '../../utils/timeAgo';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Marqueurs colorés selon la priorité : rouge=urgente, orange=moyenne, bleu=faible
// (diversifie la palette carte, au lieu d'un unique marqueur rouge)
const MARKER_COLORS = { urgente: 'red', moyenne: 'orange', faible: 'blue' };

function buildIcon(priority) {
  const color = MARKER_COLORS[priority] || 'grey';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

const ICONS_CACHE = {
  urgente: buildIcon('urgente'),
  moyenne: buildIcon('moyenne'),
  faible: buildIcon('faible')
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label || value;
}

export default function MapView({ issues, center, zoom, onProposeSolution, canSeeAddress = () => true }) {
  // Rendu défensif : une coordonnée invalide ne doit jamais faire disparaître
  // silencieusement les AUTRES marqueurs valides.
  const validIssues = issues.filter(i => {
    const ok = Number.isFinite(i.latitude) && Number.isFinite(i.longitude);
    if (!ok) console.warn(`Signalement "${i.title}" (id: ${i.id}) ignoré sur la carte : coordonnées invalides.`, i.latitude, i.longitude);
    return ok;
  });

  return (
    <div className="map-view-wrapper" style={{
      position: 'relative',
      height: 'min(65vh, 560px)',
      minHeight: '360px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${COLORS.border}`
    }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <MapController center={center} zoom={zoom} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {validIssues.map(issue => (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={ICONS_CACHE[issue.priority] || ICONS_CACHE.faible}>
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <span style={{ fontSize: '10px', background: COLORS.orangeLight, color: COLORS.orange, padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  {issue.priority}
                </span>
                <h4 style={{ margin: '6px 0 4px 0', fontSize: '13px' }}>{issue.title}</h4>
                <p style={{ margin: '0 0 2px 0', fontSize: '11px', fontWeight: '600', color: COLORS.navy }}>
                  {categoryLabel(issue.category)}
                </p>
                <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: COLORS.slate }}>
                  📍 {issue.commune}
                  {canSeeAddress(issue) && issue.quartier ? ` — ${issue.quartier}` : ''}
                  {canSeeAddress(issue) && issue.adresse_complement ? ` (${issue.adresse_complement})` : ''}
                </p>
                {!canSeeAddress(issue) && (
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: COLORS.slate, fontStyle: 'italic' }}>
                    Adresse précise communiquée une fois une solution validée par le MAC.
                  </p>
                )}
                <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: COLORS.slate, fontStyle: 'italic' }}>
                  {timeAgo(issue.created_at)}
                </p>
                {issue.photos && issue.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {issue.photos.map((url, i) => (
                      <img key={i} src={url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => onProposeSolution(issue)}
                  style={{ width: '100%', background: COLORS.navy, color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Proposer une solution
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Légende des couleurs de priorité */}
      <div style={{
        position: 'absolute', bottom: '10px', left: '10px', zIndex: 500,
        background: 'rgba(255,255,255,0.95)', borderRadius: '8px', padding: '8px 12px',
        fontSize: '11px', display: 'flex', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <LegendDot color="#e11d48" label="Urgente" />
        <LegendDot color="#f2994a" label="Moyenne" />
        <LegendDot color="#3b82f6" label="Faible" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#334155' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}
