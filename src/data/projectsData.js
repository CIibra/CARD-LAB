import { Wrench, HandCoins, Clock, Info } from 'lucide-react';

export const PROJECT_CATEGORIES = [
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
  { value: 'environnement', label: 'Environnement' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'entrepreneuriat', label: 'Entrepreneuriat' },
  { value: 'culture', label: 'Culture & Sport' },
  { value: 'social', label: 'Solidarité & Social' },
  { value: 'autre', label: 'Autre' }
];

// Types de besoin qu'un projet peut rechercher — un projet peut en cocher plusieurs
export const NEED_TYPES = [
  { value: 'contribution', label: 'Contribution en nature', shortLabel: 'Je veux contribuer', icon: Wrench },
  { value: 'financement', label: 'Financement', shortLabel: 'Je veux financer', icon: HandCoins },
  { value: 'benevolat', label: 'Bénévolat', shortLabel: 'Je veux être bénévole', icon: Clock },
  { value: 'info', label: 'Être tenu informé', shortLabel: "Me tenir informé", icon: Info }
];

export const ENGAGEMENT_STATUS_LABELS = {
  'Nouveau': { label: 'En attente de vérification MAC', color: '#64748b' },
  'Validé': { label: 'Validé — contact disponible', color: '#0e7a4f' },
  'Refusé': { label: 'Refusé', color: '#dc2626' },
  'Contacté': { label: 'Contacté', color: '#4a9db0' },
  'Confirmé': { label: 'Confirmé', color: '#3730a3' }
};

export const PROJECT_STATUS_LABELS = {
  'En attente': { label: 'En attente de validation', color: '#64748b' },
  'Publié': { label: 'Publié', color: '#0e7a4f' },
  'Refusé': { label: 'Refusé', color: '#dc2626' },
  'En cours': { label: 'En cours', color: '#f2994a' },
  'Terminé': { label: 'Terminé', color: '#3730a3' },
  'Archivé': { label: 'Archivé', color: '#94a3b8' }
};
