import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import { uploadIssuePhotos } from '../../utils/uploadPhotos';
import PhotoPicker from './PhotoPicker';
import { COLORS } from '../../theme';

export default function CompleteSolutionModal({ solution, onClose, onCompleted }) {
  const { user } = useAuth();
  const { completeSolution } = useIssues();

  const [newFiles, setNewFiles] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!solution) return null;

  const handleConfirm = async () => {
    if (photoError) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const photoUrls = newFiles.length > 0 ? await uploadIssuePhotos(newFiles, user.id) : [];
      const result = await completeSolution(solution.id, photoUrls);
      if (!result.success) {
        setErrorMsg(result.error?.message || "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      onCompleted?.(photoUrls);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Erreur lors de l'envoi des photos.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '460px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          Signaler la fin des travaux
        </h3>
        <p style={{ fontSize: '12px', color: COLORS.slate, marginBottom: '16px' }}>
          Vous pouvez ajouter jusqu'à 2 photos de la réalisation (facultatif) — elles aideront
          le MAC à confirmer la résolution.
        </p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <PhotoPicker
          existingUrls={[]}
          onRemoveExisting={() => {}}
          newFiles={newFiles}
          onAddFiles={(files, err) => { setNewFiles(files); setPhotoError(err); }}
          onRemoveNewFile={(i) => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
          error={photoError}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
          <button type="button" onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || !!photoError}
            style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Envoi…' : 'Confirmer la fin des travaux'}
          </button>
        </div>
      </div>
    </div>
  );
}
