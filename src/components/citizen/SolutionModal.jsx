import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';

export default function SolutionModal({ isOpen, onClose, issue }) {
  const { user } = useAuth();
  const { addSolution } = useIssues();

  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !issue) return null;

  const close = () => {
    setDescription('');
    setResources('');
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  if (!user) {
    return (
      <Overlay onClose={close}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>🔒 Connexion requise</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Vous devez être connecté pour proposer une solution. Fermez cette fenêtre et connectez-vous depuis le haut de la page.
        </p>
        <button onClick={close} style={btnSecondary}>Fermer</button>
      </Overlay>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const result = await addSolution(issue.id, user.id, {
      solution_description: description,
      resources_offered: resources
    });

    setSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error?.message || "Une erreur est survenue lors de l'envoi.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <Overlay onClose={close}>
      {!submitted ? (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
            🤝 Proposer une solution
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Problème concerné : <strong>{issue.title}</strong>
          </p>

          {errorMsg && <div style={errBox}>⚠️ {errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700' }}>Description technique de la solution proposée</label>
              <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Méthode d'intervention, matériaux, calendrier estimé..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700' }}>Ressources / soutien proposé (main d'œuvre, matériel, budget…)</label>
              <textarea rows={2} value={resources} onChange={e => setResources(e.target.value)}
                placeholder="ex: 5 bénévoles disponibles le week-end, don de matériaux..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#1e40af', marginBottom: '16px' }}>
              ℹ️ Votre proposition sera examinée par le bureau du MAC avant validation et mise en relation.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={close} style={btnSecondary}>Annuler</button>
              <button type="submit" disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Envoi…' : 'Envoyer la proposition'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <h3 style={{ color: '#15803d', fontSize: '18px', fontWeight: '800' }}>✅ Solution transmise avec succès !</h3>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '8px', margin: '14px 0', fontSize: '12px', color: '#166534', lineHeight: '1.6' }}>
            <p>Votre proposition a bien été enregistrée et transmise au bureau du MAC pour validation.</p>
            <p style={{ marginTop: '8px' }}>
              🇨🇮 Consultez l'onglet <strong>Éducation & Valeurs</strong> pour en savoir plus sur l'engagement civique.
            </p>
          </div>
          <button onClick={close} style={{ ...btnPrimary, width: '100%' }}>Compris et Fermer</button>
        </div>
      )}
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', marginTop: '4px' };
const btnSecondary = { background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const btnPrimary = { background: '#12384a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const errBox = { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' };
