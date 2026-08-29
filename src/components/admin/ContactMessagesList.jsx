import React, { useState } from 'react';
import { COLORS } from '../../theme';

const STATUS_STYLE = {
  'Nouveau': { bg: COLORS.orangeLight, color: COLORS.orange, label: 'Nouveau' },
  'Lu': { bg: COLORS.tealLight, color: COLORS.teal, label: 'Lu' },
  'Traité': { bg: COLORS.greenLight, color: COLORS.greenDark, label: 'Traité' }
};

export default function ContactMessagesList({ messages, onReply }) {
  const [openReplyId, setOpenReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  if (messages.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aucun message reçu pour le moment.</p>;
  }

  const startReply = (msg) => {
    setOpenReplyId(msg.id);
    setReplyText(msg.admin_reply || '');
  };

  const send = async (msg) => {
    setSending(true);
    await onReply(msg.id, replyText);
    setSending(false);
    setOpenReplyId(null);
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {messages.map(msg => {
        const st = STATUS_STYLE[msg.status] || STATUS_STYLE['Nouveau'];
        const isReplying = openReplyId === msg.id;
        return (
          <div key={msg.id} style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{msg.subject}</div>
                <div style={{ fontSize: '11px', color: COLORS.slate }}>
                  {msg.name} ({msg.category}) — {msg.email}
                  {!msg.user_id && <span style={{ marginLeft: '6px', fontStyle: 'italic' }}>(non connecté à l'envoi)</span>}
                </div>
              </div>
              <span style={{ background: st.bg, color: st.color, fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                {st.label}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.6', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </p>

            <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>
              Reçu le {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>

            {msg.admin_reply && !isReplying && (
              <div style={{ background: COLORS.greenLight, borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: COLORS.greenDark, marginBottom: '4px' }}>VOTRE RÉPONSE</div>
                <p style={{ fontSize: '12px', color: COLORS.greenDark, lineHeight: '1.5' }}>{msg.admin_reply}</p>
              </div>
            )}

            {isReplying ? (
              <div>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Votre réponse (visible par l'expéditeur s'il est connecté, dans son espace « Mon Profil »)..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontSize: '12px', boxSizing: 'border-box', marginBottom: '8px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setOpenReplyId(null)} style={{ background: '#f1f5f9', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button
                    onClick={() => send(msg)}
                    disabled={sending || !replyText.trim()}
                    style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: sending ? 0.7 : 1 }}
                  >
                    {sending ? 'Envoi…' : 'Envoyer la réponse'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => startReply(msg)}
                style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                {msg.admin_reply ? 'Modifier la réponse' : 'Répondre'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
