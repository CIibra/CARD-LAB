import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Phone } from 'lucide-react';
import BadgeStatus from '../common/BadgeStatus';
import { CATEGORIES } from '../../data/regionsCI';
import { timeAgo } from '../../utils/timeAgo';
import { supabase } from '../../services/supabaseClient';
import { COLORS } from '../../theme';

const PRIORITY_STYLE = {
  urgente: { bg: '#fee2e2', color: '#dc2626', label: '🚨 Urgente' },
  moyenne: { bg: COLORS.orangeLight, color: COLORS.orange, label: '⚠️ Moyenne' },
  faible: { bg: COLORS.tealLight, color: COLORS.teal, label: 'ℹ️ Faible' }
};

export default function IssueDetailModal({ issue, onClose, onProposeSolution, canSeeAddress = true, showPhone = false }) {
  const [phone, setPhone] = useState(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    if (issue && showPhone) {
      setPhoneLoading(true);
      supabase
        .from('issue_contact_info')
        .select('phone')
        .eq('issue_id', issue.id)
        .maybeSingle()
        .then(({ data }) => {
          setPhone(data?.phone || null);
          setPhoneLoading(false);
        });
    } else {
      setPhone(null);
    }
  }, [issue, showPhone]);

  if (!issue) return null;

  const priorityStyle = PRIORITY_STYLE[issue.priority] || PRIORITY_STYLE.faible;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', width: '100%', maxWidth: '560px', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '20px 24px 12px', flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{issue.title}</h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <BadgeStatus status={issue.status} />
              <span style={{ background: priorityStyle.bg, color: priorityStyle.color, fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '10px' }}>
                {priorityStyle.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
            <X size={20} color={COLORS.slate} />
          </button>
        </div>

        {/* Corps défilant */}
        <div style={{ padding: '4px 24px 20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', color: COLORS.slate, fontWeight: '600' }}>
              {CATEGORIES.find(c => c.value === issue.category)?.label || issue.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.slate }}>
              <MapPin size={13} /> {issue.commune}
              {canSeeAddress && issue.quartier ? ` — ${issue.quartier}` : ''}
              {canSeeAddress && issue.adresse_complement ? ` (${issue.adresse_complement})` : ''}
            </span>
            {!canSeeAddress && (
              <span style={{ fontSize: '11px', color: COLORS.slate, fontStyle: 'italic' }}>
                Adresse précise communiquée une fois une solution validée par le MAC.
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: COLORS.slate }}>
              <Clock size={13} /> {timeAgo(issue.created_at)}
            </span>

            {showPhone && (
              <div style={{ marginTop: '6px', background: COLORS.slateLight, borderRadius: '8px', padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: COLORS.navy }}>
                  <Phone size={13} />
                  {phoneLoading ? 'Chargement…' : (phone || 'Non renseigné')}
                </div>
                <div style={{ fontSize: '10px', color: COLORS.slate, marginTop: '2px' }}>
                  Confidentiel — réservé à l'équipe MAC, jamais communiqué à un prestataire.
                </div>
              </div>
            )}
          </div>

          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-wrap', marginBottom: issue.photos?.length ? '16px' : '0' }}>
            {issue.description}
          </p>

          {issue.photos && issue.photos.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {issue.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${COLORS.border}` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {onProposeSolution && (
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
            <button
              onClick={() => { onClose(); onProposeSolution(issue); }}
              style={{ width: '100%', background: COLORS.navy, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Proposer une solution
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
