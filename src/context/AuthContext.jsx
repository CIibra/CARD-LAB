import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Écouter les changements d'état (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erreur profil:', err);
    } finally {
      setLoading(false);
    }
  }

  // Connexion
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password });

  // Inscription avec attribution du rôle
  const register = async (email, password, fullName, role = 'citoyen') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: role }
      }
    });
    return { data, error };
  };

  // Déconnexion
  const logout = () => supabase.auth.signOut();

  // Envoie un email avec un lien de réinitialisation
  const requestPasswordReset = (email) => supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`
  });

  // Appelé depuis la page de réinitialisation, une fois le lien cliqué
  const updatePassword = (newPassword) => supabase.auth.updateUser({ password: newPassword });

  const isAdmin = profile?.role === 'mac_admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, isAdmin, requestPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
