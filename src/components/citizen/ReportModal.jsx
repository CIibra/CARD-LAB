import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { REGIONS_CI, CATEGORIES, PRIORITIES, getCoordsForLocation } from '../../data/regionsCI';
import { uploadIssuePhotos } from '../../utils/uploadPhotos';
import PhotoPicker from './PhotoPicker';

const DEFAULT_REGION = "District d'Abidjan";
const EMPTY_FORM = {
  title: '', category: CATEGORIES[0].value, priority: 'urgente',
  region: DEFAULT_REGION, ville: REGIONS_CI[DEFAULT_REGION].villes[0],
  quartier: '', adresseComplement: '', description: '', phone: ''
};

export default function ReportModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const { addIssue } = useIssues();

  const [form, setForm] = useState(EMPTY_FORM);
  const [newFiles, setNewFiles] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  if (!user) {
    return (
      <Overlay onClose={onClose}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>🔒 Connexion requise</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Vous devez être connecté pour signaler un problème. Fermez cette fenêtre et cliquez sur « Connexion / Inscription » en haut de la page.
        </p>
        <button onClick={onClose} style={btnSecondary}>Fermer</button>
      </Overlay>
    );
  }

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    setNewFiles([]);
    setPhotoError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photoError) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const photoUrls = newFiles.length > 0 ? await uploadIssuePhotos(newFiles, user.id) : [];

      const [lat, lng] = getCoordsForLocation(form.ville);
      const jitterLat = (Math.random() - 0.5) * 0.01;
      const jitterLng = (Math.random() - 0.5) * 0.01;

      const result = await addIssue({
        title: form.title,
        category: form.category,
        priority: form.priority,
        commune: form.ville,
        quartier: form.quartier,
        adresse_complement: form.adresseComplement,
        description: form.description,
        latitude: lat + jitterLat,
        longitude: lng + jitterLng,
        user_id: user.id,
        photos: photoUrls,
        phone: form.phone
      });

      if (!result.success) {
        setErrorMsg(result.error?.message || "Une erreur est survenue lors de l'envoi.");
        setSubmitting(false);
        return;
      }

      onCreated?.(result.issue);
      resetAndClose();
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l'envoi des photos.");
    }
    setSubmitting(false);
  };

  return (
    <Overlay onClose={resetAndClose} maxWidth="520px">
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>📢 SIGNALER UN NOUVEAU PROBLÈME</h3>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
        Sélectionnez la région et la ville. Le point rouge s'affichera automatiquement sur la carte.
      </p>

      {errorMsg && <div style={errBox}>⚠️ {errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <Field label="Titre du problème">
          <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="ex: Caniveau bouché, Poteau dangereux, Route dégradée..." style={inputStyle} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <Field label="Catégorie">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Niveau d'urgence">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
        </div>

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

        <Field label="Quartier & repère">
          <input type="text" value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })}
            placeholder="ex: Quartier Saint Jean, près du grand marché..." style={inputStyle} />
        </Field>

        <Field label="Complément d'adresse (précision du lieu exact, facultatif)">
          <input type="text" value={form.adresseComplement} onChange={e => setForm({ ...form, adresseComplement: e.target.value })}
            placeholder="ex: 3ème maison après la pharmacie, portail bleu..." style={inputStyle} />
        </Field>
        <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '-6px', marginBottom: '10px' }}>
          Le quartier étant parfois très étendu, cette précision aide à localiser exactement le problème.
        </p>

        <Field label="Description détaillée">
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Expliquez brièvement le problème et les risques associés..." style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>

        <Field label="Votre numéro de téléphone (obligatoire)">
          <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+225 07 00 00 00 00" style={inputStyle} />
        </Field>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#1e40af', marginBottom: '10px', display: 'flex', gap: '6px' }}>
          <span>🔒</span>
          <span>
            Votre numéro reste strictement confidentiel : il n'est jamais communiqué aux prestataires ni
            affiché publiquement. Seule l'équipe du MAC peut l'utiliser, si besoin, pour vous recontacter
            et obtenir des précisions sur votre signalement.
          </span>
        </div>

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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingBottom: '8px', marginTop: '12px' }}>
          <button type="button" onClick={resetAndClose} style={btnSecondary}>Annuler</button>
          <button type="submit" disabled={submitting || !!photoError} style={{ ...btnDanger, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Envoi…' : "Publier l'Alerte"}
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

const inputStyle = { width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', marginTop: '4px' };
const btnSecondary = { background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { background: '#e11d48', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const errBox = { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' };
