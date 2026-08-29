import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { COLORS } from '../../theme';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citoyen');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetLocalState = () => {
    setErrorMsg('');
    setInfoMsg('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetLocalState();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetLocalState();
    setSubmitting(true);

    if (mode === 'forgot') {
      const { error } = await requestPasswordReset(email);
      setSubmitting(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg("Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé. Vérifie ta boîte mail (et les spams).");
      }
      return;
    }

    if (mode === 'signup') {
      const { error } = await register(email, password, fullName, role);
      if (error) {
        if (error.message.includes('rate limit')) {
          setErrorMsg("Trop de tentatives d'inscription. Patientez quelques minutes.");
        } else if (error.message.includes('already registered')) {
          setErrorMsg('Cet email est déjà utilisé.');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        onClose();
        navigate('/'); // un nouveau compte n'est jamais admin par défaut
      }
    } else {
      const { data, error } = await login(email, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        onClose();
        // Redirection : accueil pour tous, sauf l'admin qui va sur son dashboard
        let destination = '/';
        if (data?.user?.id) {
          const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
          if (prof?.role === 'mac_admin') destination = '/admin';
        }
        navigate(destination);
      }
    }
    setSubmitting(false);
  };

  const titles = {
    login: 'Connexion à Mon Espace',
    signup: 'Créer un compte',
    forgot: 'Mot de passe oublié'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '420px', padding: '28px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: COLORS.green, textAlign: 'center' }}>
          {titles[mode]}
        </h3>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px', lineHeight: '1.4' }}>
            ⚠️ {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div style={{ background: COLORS.greenLight, color: COLORS.greenDark, padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px', lineHeight: '1.4' }}>
            ✅ {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={labelStyle}>Nom complet ou Nom de l'Organisation *</label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Type de compte *</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, background: '#fff' }}>
                  <option value="citoyen">👤 Citoyen simple</option>
                  <option value="entreprise">🏢 Entreprise</option>
                  <option value="ong">🤝 ONG</option>
                  <option value="association">🧑‍🤝‍🧑 Association</option>
                  <option value="collectivite">🏛️ Collectivité locale</option>
                  <option value="expert">🎓 Expert / Spécialiste</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Adresse Email *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label style={labelStyle}>Mot de passe *</label>
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
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    display: 'flex', alignItems: 'center', color: COLORS.slate
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <span onClick={() => switchMode('forgot')} style={{ fontSize: '12px', color: COLORS.green, fontWeight: '600', cursor: 'pointer' }}>
                Mot de passe oublié ?
              </span>
            </div>
          )}

          <button type="submit" disabled={submitting} style={{ width: '100%', background: COLORS.green, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: submitting ? 'default' : 'pointer', marginTop: '6px', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Veuillez patienter…' : {
              login: 'Se connecter',
              signup: 'Créer mon compte',
              forgot: 'Envoyer le lien de réinitialisation'
            }[mode]}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px' }}>
          {mode === 'signup' && (
            <p style={{ color: COLORS.slate }}>Déjà un compte ? <span onClick={() => switchMode('login')} style={linkStyle}>Se connecter</span></p>
          )}
          {mode === 'login' && (
            <p style={{ color: COLORS.slate }}>Pas encore de compte ? <span onClick={() => switchMode('signup')} style={linkStyle}>Créer un compte</span></p>
          )}
          {mode === 'forgot' && (
            <p style={{ color: COLORS.slate }}>Vous vous souvenez ? <span onClick={() => switchMode('login')} style={linkStyle}>Retour à la connexion</span></p>
          )}
        </div>

        <button onClick={onClose} style={{ width: '100%', border: 'none', background: 'transparent', color: '#94a3b8', marginTop: '12px', cursor: 'pointer', fontSize: '12px' }}>Fermer</button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#334155' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' };
const linkStyle = { color: '#0e7a4f', fontWeight: '700', cursor: 'pointer' };
