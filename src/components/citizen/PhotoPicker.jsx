import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { MAX_ISSUE_PHOTOS, validatePhotoFiles } from '../../utils/uploadPhotos';
import { COLORS } from '../../theme';

/**
 * Gère un mélange de :
 * - existingUrls : URLs déjà en ligne (mode édition)
 * - newFiles : fichiers fraîchement sélectionnés, pas encore uploadés
 * Le total (existants restants + nouveaux) ne doit jamais dépasser MAX_ISSUE_PHOTOS.
 */
export default function PhotoPicker({ existingUrls, onRemoveExisting, newFiles, onAddFiles, onRemoveNewFile, error }) {
  const inputRef = useRef(null);
  const total = existingUrls.length + newFiles.length;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const combined = [...newFiles, ...selected];
    const remainingSlots = MAX_ISSUE_PHOTOS - existingUrls.length;
    const finalFiles = combined.slice(0, remainingSlots);

    const validationError = validatePhotoFiles(finalFiles);
    onAddFiles(finalFiles, validationError);
    e.target.value = ''; // permet de resélectionner le même fichier si besoin
  };

  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>
        Photos (facultatif, {MAX_ISSUE_PHOTOS} max)
      </label>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
        {existingUrls.map((url, i) => (
          <Thumb key={`existing-${i}`} src={url} onRemove={() => onRemoveExisting(i)} />
        ))}
        {newFiles.map((file, i) => (
          <Thumb key={`new-${i}`} src={URL.createObjectURL(file)} onRemove={() => onRemoveNewFile(i)} />
        ))}

        {total < MAX_ISSUE_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              width: '64px', height: '64px', borderRadius: '8px',
              border: `1.5px dashed ${COLORS.border}`, background: COLORS.slateLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <ImagePlus size={20} color={COLORS.slate} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {error && <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}

function Thumb({ src, onRemove }) {
  return (
    <div style={{ position: 'relative', width: '64px', height: '64px' }}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: 'absolute', top: '-6px', right: '-6px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#dc2626', color: '#fff', border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}
      >
        <X size={11} />
      </button>
    </div>
  );
}
