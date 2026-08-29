import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirm) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Le lien a peut-être expiré. Redemande un nouveau lien depuis la page de connexion.");
      return;
    }
    setDone(true);
  };

  return (
    <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: COLORS.green, marginBottom: '16px', textAlign: 'center' }}>
          Choisir un nouveau mot de passe
        </h2>

        {done ? (
          <div>
            <div style={{ background: COLORS.greenLight, color: COLORS.greenDark, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              ✅ Mot de passe mis à jour avec succès.
            </div>
            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', background: COLORS.green, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {errorMsg && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: COLORS.slate }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Confirmer le mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', background: COLORS.green, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Mise à jour…' : 'Valider le nouveau mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' };
