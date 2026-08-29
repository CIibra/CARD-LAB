import { createClient } from '@supabase/supabase-js';

// Remplace ces deux valeurs par tes clés Supabase (disponibles dans Project Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://votre-projet.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'votre-cle-anon-ici';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // pas de session sauvegardée : reconnexion requise à chaque lancement
  }
});
