// Données géographiques & référentiels partagés (Côte d'Ivoire)
// Utilisées par MapView, FilterBar, ReportModal

export const CI_CENTER_COORDS = [7.539989, -5.547080];
export const ZOOM_PAYS = 7;
export const ZOOM_REGION = 11;

export const REGIONS_CI = {
  "District d'Abidjan": {
    coords: [5.3600, -4.0083],
    villes: ["Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon", "Anyama", "Bingerville"]
  },
  "District de Yamoussoukro": {
    coords: [6.8276, -5.2893],
    villes: ["Yamoussoukro", "Attiégouakro"]
  },
  "Bas-Sassandra (San-Pédro)": {
    coords: [4.7485, -6.6363],
    villes: ["San-Pédro", "Sassandra", "Tabou", "Soubré"]
  },
  "Comoé (Abengourou / Aboisso)": {
    coords: [6.7297, -3.4964],
    villes: ["Abengourou", "Aboisso", "Agnibilékrou", "Grand-Bassam"]
  },
  "Denguélé (Odienné)": {
    coords: [9.5051, -7.5643],
    villes: ["Odienné", "Minignan", "Kaniasso"]
  },
  "Gôh-Djiboua (Gagnoa / Divo)": {
    coords: [6.1319, -5.9506],
    villes: ["Gagnoa", "Divo", "Oumé", "Lakota"]
  },
  "Lacs (Dimbokro / Toumodi)": {
    coords: [6.6467, -4.7045],
    villes: ["Dimbokro", "Toumodi", "Bongouanou", "M'Bahiakro"]
  },
  "Lagunes (Agboville / Dabou)": {
    coords: [5.9272, -4.2188],
    villes: ["Agboville", "Dabou", "Grand-Lahou", "Jacqueville"]
  },
  "Montagnes (Man)": {
    coords: [7.4125, -7.5544],
    villes: ["Man", "Danané", "Duékoué", "Guiglo", "Toulepleu"]
  },
  "Sassandra-Marahoué (Daloa / Bouaflé)": {
    coords: [6.8774, -6.4502],
    villes: ["Daloa", "Bouaflé", "Issia", "Sinfra", "Vavoua"]
  },
  "Savanes (Korhogo)": {
    coords: [9.4580, -5.6296],
    villes: ["Korhogo", "Boundiali", "Ferkessédougou", "Tengréla"]
  },
  "Vallée du Bandama (Bouaké)": {
    coords: [7.6900, -5.0300],
    villes: ["Bouaké", "Béoumi", "Sakassou", "Katiola", "Dabakala"]
  },
  "Woroba (Séguéla)": {
    coords: [7.9611, -6.6731],
    villes: ["Séguéla", "Mankono", "Touba"]
  },
  "Zanzan (Bondoukou)": {
    coords: [8.0402, -2.8000],
    villes: ["Bondoukou", "Bouna", "Tanda"]
  }
};

export const VILLE_COORDS = {
  "Abobo": [5.4161, -4.0159],
  "Adjamé": [5.3562, -4.0242],
  "Attécoubé": [5.3370, -4.0410],
  "Cocody": [5.3599, -3.9870],
  "Koumassi": [5.3050, -3.9580],
  "Marcory": [5.3033, -3.9822],
  "Plateau": [5.3255, -4.0211],
  "Port-Bouët": [5.2536, -3.9631],
  "Treichville": [5.3022, -4.0094],
  "Yopougon": [5.3400, -4.0800],
  "Anyama": [5.4946, -4.0518],
  "Bingerville": [5.3558, -3.8856],
  "Yamoussoukro": [6.8276, -5.2893],
  "Bouaké": [7.6900, -5.0300],
  "San-Pédro": [4.7485, -6.6363],
  "Korhogo": [9.4580, -5.6296],
  "Daloa": [6.8774, -6.4502],
  "Man": [7.4125, -7.5544]
};

// Valeurs alignées avec la contrainte CHECK de la table `issues` en base
export const CATEGORIES = [
  { value: 'déchets', label: 'Déchets & Insalubrité' },
  { value: 'infrastructures', label: 'Voirie & Infrastructures' },
  { value: 'eau', label: 'Eau & Assainissement' },
  { value: 'éclairage', label: 'Éclairage Public' },
  { value: 'santé', label: 'Santé' },
  { value: 'éducation', label: 'Éducation' },
  { value: 'sécurité', label: 'Sécurité & Incivilités' },
  { value: 'autre', label: 'Autre' }
];

export const PRIORITIES = [
  { value: 'urgente', label: '🚨 Urgente' },
  { value: 'moyenne', label: '⚠️ Moyenne' },
  { value: 'faible', label: 'ℹ️ Faible' }
];

export const STATUS_LABELS = {
  'Nouveau': { label: 'Nouveau', color: '#64748b' },
  'En vérification': { label: 'En vérification', color: '#f59e0b' },
  'Confirmé': { label: 'Confirmé', color: '#0ea5e9' },
  'Solution proposée': { label: 'Solution proposée', color: '#8b5cf6' },
  'Partenaire identifié': { label: 'Partenaire identifié', color: '#6366f1' },
  'En cours': { label: 'En cours', color: '#f97316' },
  'Résolu': { label: 'Résolu', color: '#22c55e' },
  'Archivé': { label: 'Archivé', color: '#94a3b8' }
};

export function getCoordsForLocation(communeName) {
  if (VILLE_COORDS[communeName]) return VILLE_COORDS[communeName];
  for (const region of Object.values(REGIONS_CI)) {
    if (region.villes.includes(communeName)) return region.coords;
  }
  return [5.3600, -4.0083]; // Abidjan par défaut
}

export function getVillesForRegion(region) {
  if (region === 'Toutes' || !REGIONS_CI[region]) {
    return Object.values(REGIONS_CI).flatMap(r => r.villes);
  }
  return REGIONS_CI[region].villes;
}
