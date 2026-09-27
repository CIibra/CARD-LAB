import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { NEED_TYPES } from '../../data/projectsData';
import { COLORS } from '../../theme';

export default function EngagementModal({ project, engagementType, onClose }) {
  const { user } = useAuth();
  const { addEngagement } = useProjects();

  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!project || !engagementType) return null;

  const typeInfo = NEED_TYPES.find(t => t.value === engagementType);

  if (!user) {
    return (
      <Overlay onClose={onClose}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>Connexion requise</h3>
        <p style={{ fontSize: '13px', color: COLORS.slate, marginBottom: '16px' }}>
          Connectez-vous pour vous engager sur ce projet.
        </p>
        <button onClick={onClose} style={btnSecondary}>Fermer</button>
      </Overlay>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const result = await addEngagement(project.id, user.id, {
      engagement_type: engagementType,
      message,
      phone,
      amount: engagementType === 'financement' && amount ? parseFloat(amount) : null
    });

    setSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error?.message || "Une erreur est survenue.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <Overlay onClose={onClose}>
      {!submitted ? (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
            {typeInfo?.shortLabel}
          </h3>
          <p style={{ fontSize: '12px', color: COLORS.slate, marginBottom: '16px' }}>
            Projet concerné : <strong>{project.title}</strong>
          </p>

          {errorMsg && <div style={errBox}>⚠️ {errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            {engagementType === 'financement' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700' }}>Montant envisagé (FCFA, facultatif)</label>
                <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="ex: 25000" style={inputStyle} />
              </div>
            )}

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700' }}>Votre numéro de téléphone (obligatoire)</label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="ex: 07 00 00 00 00" style={inputStyle} />
              <p style={{ fontSize: '10px', color: COLORS.slate, marginTop: '4px' }}>
                Réservé au bureau du MAC — transmis au porteur du projet seulement après vérification.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700' }}>
                {engagementType === 'info' ? 'Message (facultatif)' : 'Votre message / ce que vous proposez'}
              </label>
              <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                placeholder={placeholderFor(engagementType)}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#1e40af', marginBottom: '16px' }}>
              Votre engagement sera transmis au bureau du MAC, qui fera le lien avec le porteur du projet.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={onClose} style={btnSecondary}>Annuler</button>
              <button type="submit" disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Envoi…' : 'Confirmer'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <h3 style={{ color: '#15803d', fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>
            Merci pour votre engagement !
          </h3>
          <p style={{ fontSize: '13px', color: COLORS.slate, marginBottom: '16px' }}>
            Le bureau du MAC a bien reçu votre proposition et reviendra vers vous si besoin.
          </p>
          <button onClick={onClose} style={{ ...btnPrimary, width: '100%' }}>Fermer</button>
        </div>
      )}
    </Overlay>
  );
}

function placeholderFor(type) {
  if (type === 'contribution') return 'ex: Je peux fournir des matériaux, prêter du matériel, offrir mes compétences en...';
  if (type === 'benevolat') return 'ex: Je suis disponible les week-ends, je peux aider sur place...';
  if (type === 'info') return 'Précisez si besoin (optionnel)';
  return 'Précisions sur votre proposition de financement...';
}

function Overlay({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '460px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', marginTop: '4px' };
const btnSecondary = { background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const btnPrimary = { background: COLORS.green, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const errBox = { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' };
