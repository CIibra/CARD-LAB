import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const CATEGORY_OPTIONS = ['Citoyen', 'ONG / Association', 'Entreprise', 'Collectivité'];

const EMPTY_FORM = { name: '', email: '', category: 'Citoyen', subject: '', message: '' };

export default function ContactPage() {
  const { user, profile, isAdmin } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Pré-remplissage nom/email si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || profile?.full_name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.from('contact_messages').insert([{
      name: form.name,
      email: form.email,
      category: form.category,
      subject: form.subject,
      message: form.message,
      user_id: user ? user.id : null
    }]);

    setSubmitting(false);

    if (error) {
      console.error('Erreur envoi message contact:', error);
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm({
      ...EMPTY_FORM,
      name: user ? (profile?.full_name || '') : '',
      email: user ? (user.email || '') : ''
    });
  };

  if (isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Vous êtes le destinataire de ce formulaire</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          En tant qu'administrateur MAC, les messages envoyés ici vous sont adressés.
          Consulte l'onglet "Messages" de ton espace admin pour les lire et y répondre.
        </p>
      </div>
    );
  }

  return (
    // padding + flex centré : corrige le bug "formulaire collé à gauche"
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', maxWidth: '650px' }}>
        <h2 style={{ color: '#12384a', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
          ✉️ Contacter le Mouvement Avenir Citoyen
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Vous êtes un citoyen, une association ou une entreprise ? Écrivez-nous pour un partenariat ou une sollicitation.
        </p>

        {status === 'success' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            ✅ Votre message a été transmis au bureau du MAC. Nous reviendrons vers vous rapidement.
          </div>
        )}
        {status === 'error' && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            ⚠️ Une erreur est survenue lors de l'envoi. Réessayez dans quelques instants.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <Field label="Nom complet / Raison sociale">
              <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Adresse email">
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </Field>
          </div>

          <Field label="Vous êtes :">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Sujet">
            <input required type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} />
          </Field>

          <Field label="Votre Message">
            <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>

          <button type="submit" disabled={submitting} style={{
            background: '#12384a', color: '#fff', border: 'none', padding: '10px 20px',
            borderRadius: '6px', fontWeight: '700', cursor: submitting ? 'default' : 'pointer',
            fontSize: '13px', marginTop: '8px', opacity: submitting ? 0.7 : 1
          }}>
            {submitting ? 'Envoi…' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', boxSizing: 'border-box' };
