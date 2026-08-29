import React from 'react';
import BadgeStatus from '../common/BadgeStatus';
import { STATUS_LABELS, CATEGORIES } from '../../data/regionsCI';

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

export default function IssueModerationTable({ issues, onStatusChange, onSelectIssue }) {
  if (issues.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucun signalement pour le moment.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
            <th style={th}>Titre</th>
            <th style={th}>Commune</th>
            <th style={th}>Catégorie</th>
            <th style={th}>Priorité</th>
            <th style={th}>Statut</th>
            <th style={th}>Changer le statut</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr
              key={issue.id}
              onClick={() => onSelectIssue?.(issue)}
              style={{ borderBottom: '1px solid #f1f5f9', cursor: onSelectIssue ? 'pointer' : 'default' }}
            >
              <td style={{ ...td, fontWeight: '600', maxWidth: '220px' }}>{issue.title}</td>
              <td style={td}>{issue.commune}</td>
              <td style={td}>{CATEGORIES.find(c => c.value === issue.category)?.label || issue.category}</td>
              <td style={td}>{issue.priority}</td>
              <td style={td}><BadgeStatus status={issue.status} /></td>
              <td style={td} onClick={(e) => e.stopPropagation()}>
                <select
                  value={issue.status}
                  onChange={e => onStatusChange(issue.id, e.target.value)}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px 8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const td = { padding: '10px 8px' };
