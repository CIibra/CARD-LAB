import { Map, BookOpen, Mail, Info, UserCircle, Shield, Rocket } from 'lucide-react';

// Onglets de base, communs à tous les utilisateurs (Contact masqué pour l'admin)
export const BASE_TABS = [
  { to: '/', label: 'Carte', fullLabel: 'Carte & Signalements', icon: Map, end: true },
  { to: '/projets', label: 'Projets', fullLabel: 'Appels à Projets', icon: Rocket },
  { to: '/valeurs', label: 'Valeurs', fullLabel: 'Éducation & Valeurs', icon: BookOpen },
  { to: '/contact', label: 'Contact', fullLabel: 'Contacter le MAC', icon: Mail, hideForAdmin: true },
  { to: '/a-propos', label: 'Infos', fullLabel: 'À propos', icon: Info }
];

export const PROFILE_TAB = { to: '/profil', label: 'Profil', fullLabel: 'Mon Profil', icon: UserCircle };
export const ADMIN_TAB = { to: '/admin', label: 'Admin', fullLabel: 'Espace Admin', icon: Shield };
