import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, PRIORITIES } from '../../data/regionsCI';
import { uploadIssuePhotos } from '../../utils/uploadPhotos';
import PhotoPicker from './PhotoPicker';
import { COLORS } from '../../theme';

export default function EditIssueModal({ issue, onClose, onSaved }) {
  const { user } = useAuth();
  const { updateIssue } = useIssues();

  const [form, setForm] = useState({
    title: issue.title,
    category: issue.category,
    priority: issue.priority,
    quartier: issue.quartier || '',
    adresse_complement: issue.adresse_complement || '',
    description: issue.description || ''
  });
  const [existingUrls, setExistingUrls] = useState(issue.photos || []);
  const [newFiles, setNewFiles] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photoError) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const newUrls = newFiles.length > 0 ? await uploadIssuePhotos(newFiles, user.id) : [];
      const finalPhotos = [...existingUrls, ...newUrls];

      const result = await updateIssue(issue.id, { ...form, photos: finalPhotos });
      if (!result.success) {
        setErrorMsg(result.error?.message || "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l'envoi des photos.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          Modifier mon signalement
        </h3>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Field label="Titre">
            <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Field label="Catégorie">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Priorité">
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Quartier / repère">
            <input type="text" value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} style={inputStyle} />
          </Field>

          <Field label="Complément d'adresse (facultatif)">
            <input type="text" value={form.adresse_complement} onChange={e => setForm({ ...form, adresse_complement: e.target.value })} style={inputStyle} />
          </Field>

          <Field label="Description">
            <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>

          <div style={{ marginBottom: '10px' }}>
            <PhotoPicker
              existingUrls={existingUrls}
              onRemoveExisting={(i) => setExistingUrls(prev => prev.filter((_, idx) => idx !== i))}
              newFiles={newFiles}
              onAddFiles={(files, err) => { setNewFiles(files); setPhotoError(err); }}
              onRemoveNewFile={(i) => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
              error={photoError}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              Annuler
            </button>
            <button type="submit" disabled={submitting || !!photoError} style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '7px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', marginTop: '4px' };
