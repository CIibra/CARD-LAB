import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { REGIONS_CI } from '../../data/regionsCI';
import { PROJECT_CATEGORIES } from '../../data/projectsData';
import { uploadIssuePhotos } from '../../utils/uploadPhotos';
import PhotoPicker from '../citizen/PhotoPicker';
import NeedTypeSelector from './NeedTypeSelector';
import { COLORS } from '../../theme';

const DEFAULT_REGION = "District d'Abidjan";
const EMPTY_FORM = {
  title: '', description: '', category: PROJECT_CATEGORIES[0].value,
  region: DEFAULT_REGION, ville: REGIONS_CI[DEFAULT_REGION].villes[0],
  quartier: '', need_types: [], target_participants: ''
};

export default function ProposeProjectModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const { addProject } = useProjects();

  const [form, setForm] = useState(EMPTY_FORM);
  const [newFiles, setNewFiles] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    setNewFiles([]);
    setPhotoError(null);
    onClose();
  };

  if (!user) {
    return (
      <Overlay onClose={onClose}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>Connexion requise</h3>
        <p style={{ fontSize: '13px', color: COLORS.slate, marginBottom: '16px' }}>
          Connectez-vous pour proposer un projet.
        </p>
        <button onClick={onClose} style={btnSecondary}>Fermer</button>
      </Overlay>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photoError) return;
    if (form.need_types.length === 0) {
      setErrorMsg('Sélectionnez au moins un type de soutien recherché.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    try {
      const photoUrls = newFiles.length > 0 ? await uploadIssuePhotos(newFiles, user.id) : [];

      const result = await addProject({
        title: form.title,
        description: form.description,
        category: form.category,
        commune: form.ville,
        quartier: form.quartier,
        need_types: form.need_types,
        target_participants: form.target_participants ? parseInt(form.target_participants, 10) : null,
        photos: photoUrls,
        user_id: user.id
      });

      if (!result.success) {
        setErrorMsg(result.error?.message || "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }

      onCreated?.(result.project);
      resetAndClose();
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l'envoi des photos.");
    }
    setSubmitting(false);
  };

  return (
    <Overlay onClose={resetAndClose} maxWidth="540px">
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
        Proposer un projet
      </h3>
      <p style={{ fontSize: '12px', color: COLORS.slate, marginBottom: '16px' }}>
        Votre projet sera examiné par le bureau du MAC avant publication dans l'onglet
        "Appels à Projets".
      </p>

      {errorMsg && <div style={errBox}>⚠️ {errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <Field label="Titre du projet">
          <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="ex: Réhabilitation de la bibliothèque du quartier..." style={inputStyle} />
        </Field>

        <Field label="Description">
          <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Présentez le projet, son objectif, ce qu'il apportera à la communauté..." style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>

        <Field label="Catégorie">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
            {PROJECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <Field label="Région / District">
            <select
              value={form.region}
              onChange={e => {
                const reg = e.target.value;
                setForm({ ...form, region: reg, ville: REGIONS_CI[reg]?.villes[0] || '' });
              }}
              style={inputStyle}
            >
              {Object.keys(REGIONS_CI).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Ville / Commune">
            <select value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} style={inputStyle}>
              {(REGIONS_CI[form.region]?.villes || []).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Quartier (facultatif)">
          <input type="text" value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} style={inputStyle} />
        </Field>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
            Type(s) de soutien recherché(s)
          </label>
          <NeedTypeSelector selected={form.need_types} onChange={(v) => setForm({ ...form, need_types: v })} />
        </div>

        <Field label="Objectif de personnes mobilisées (facultatif)">
          <input type="number" min="1" value={form.target_participants}
            onChange={e => setForm({ ...form, target_participants: e.target.value })}
            placeholder="ex: 100" style={inputStyle} />
        </Field>
        <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '-6px', marginBottom: '10px' }}>
          Affiché comme une barre de progression publique une fois le projet publié.
        </p>

        <div style={{ marginBottom: '10px' }}>
          <PhotoPicker
            existingUrls={[]}
            onRemoveExisting={() => {}}
            newFiles={newFiles}
            onAddFiles={(files, err) => { setNewFiles(files); setPhotoError(err); }}
            onRemoveNewFile={(i) => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
            error={photoError}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <button type="button" onClick={resetAndClose} style={btnSecondary}>Annuler</button>
          <button type="submit" disabled={submitting || !!photoError} style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Envoi…' : 'Soumettre le projet'}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ fontSize: '11px', fontWeight: '700' }}>{label}</label>
      {children}
    </div>
  );
}

function Overlay({ children, onClose, maxWidth = '460px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth, maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', marginTop: '4px' };
const btnSecondary = { background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const btnPrimary = { background: COLORS.green, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const errBox = { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' };
