import {
  Landmark, Scale, ClipboardCheck, Home, Construction, Trash2,
  TrafficCone, Network, Vote, Leaf, Puzzle, ShieldAlert,
  GraduationCap, Megaphone
} from 'lucide-react';

// Contenu court, en puces, pensé pour une lecture rapide type "diapositive"
export const CHAPTERS = [
  {
    icon: Landmark,
    title: 'Qu\'est-ce que la citoyenneté ?',
    points: [
      "Appartenir à une communauté nationale, au-delà d'une simple carte d'identité.",
      "Trois piliers indissociables : des droits, des devoirs, un sentiment d'appartenance.",
      "Chaque Ivoirien est un acteur du destin national, pas un simple spectateur.",
      "La citoyenneté dépasse les origines régionales, ethniques ou religieuses."
    ]
  },
  {
    icon: Scale,
    title: 'Les droits du citoyen',
    points: [
      "Participer à la vie publique locale et nationale.",
      "Accéder aux services essentiels : éducation, santé, eau, sécurité.",
      "S'exprimer librement et être entendu par les institutions.",
      "Être protégé par la loi, sans discrimination."
    ]
  },
  {
    icon: ClipboardCheck,
    title: 'Les devoirs du citoyen',
    points: [
      "Respecter la loi et les règles de vie commune.",
      "Contribuer à l'effort collectif (impôts, taxes, civisme).",
      "Protéger le bien commun comme un bien personnel.",
      "Voter et s'informer sur les décisions publiques."
    ]
  },
  {
    icon: Home,
    title: 'Le civisme au quotidien',
    points: [
      "Ne pas jeter d'ordures dans les caniveaux et espaces publics.",
      "Respecter le code de la route et la signalisation.",
      "Adopter un comportement respectueux dans les lieux publics.",
      "Le civisme est un contrat tacite entre chaque citoyen et sa communauté."
    ]
  },
  {
    icon: Construction,
    title: 'Respect des ouvrages publics',
    points: [
      "Écoles, hôpitaux, routes, éclairage : des biens à protéger.",
      "Un lampadaire vandalisé rend une rue plus dangereuse la nuit.",
      "Signaler rapidement une infrastructure endommagée évite des surcoûts.",
      "Les biens publics appartiennent à tous — les abîmer coûte à tous."
    ]
  },
  {
    icon: Trash2,
    title: 'Propreté & gestion des déchets',
    points: [
      "Un caniveau bouché par des déchets provoque des inondations.",
      "Participer aux opérations d'assainissement de quartier.",
      "Trier ses déchets quand c'est possible.",
      "La salubrité publique est une responsabilité partagée, pas seulement municipale."
    ]
  },
  {
    icon: TrafficCone,
    title: 'Sécurité & prévention',
    points: [
      "Respecter les règles de circulation protège tout le monde.",
      "Signaler un danger (fil électrique, trou, poteau instable).",
      "La prévention collective réduit les accidents évitables.",
      "Chaque signalement peut littéralement sauver une vie."
    ]
  },
  {
    icon: Network,
    title: 'La responsabilité collective',
    points: [
      "Aucun problème urbain ne se résout dans l'isolement.",
      "Citoyen, association, entreprise, collectivité : chacun a un rôle.",
      "Signaler + proposer une solution + agir = une chaîne complète.",
      "La Carte Citoyenne rend cette chaîne visible et actionnable."
    ]
  },
  {
    icon: Vote,
    title: 'Participer à la vie publique locale',
    points: [
      "Assister aux réunions de quartier et comités de gestion.",
      "Participer aux consultations publiques sur l'urbanisme.",
      "Voter aux élections locales, pas seulement nationales.",
      "Dialoguer avec sa mairie plutôt que subir en silence."
    ]
  },
  {
    icon: Leaf,
    title: 'Engagement pour le développement durable',
    points: [
      "Soutenir les initiatives locales de reboisement.",
      "Participer aux journées de salubrité collective.",
      "Économiser l'eau et l'électricité au quotidien.",
      "Chaque geste individuel, multiplié, devient une force nationale."
    ]
  },
  {
    icon: Puzzle,
    title: 'Vivre-ensemble & cohésion sociale',
    points: [
      "La diversité ivoirienne (peuples, langues, religions) est une richesse.",
      "Le vivre-ensemble se construit chaque jour, il n'est jamais acquis.",
      "Privilégier le dialogue et la médiation en cas de conflit.",
      "Respecter les différences dans les quartiers, écoles et lieux de travail."
    ]
  },
  {
    icon: ShieldAlert,
    title: 'Rejeter la violence et la haine',
    points: [
      "Refuser les discours de haine et la stigmatisation communautaire.",
      "La violence ne règle jamais durablement un conflit.",
      "Privilégier le dialogue, même en cas de désaccord profond.",
      "Une société résiliente se construit dans le respect mutuel."
    ]
  },
  {
    icon: GraduationCap,
    title: 'Transmettre aux nouvelles générations',
    points: [
      "Le civisme s'apprend et se transmet, il n'est pas inné.",
      "Parents et enseignants ont un rôle clé dans cette transmission.",
      "Encourager l'esprit critique et le refus de la corruption.",
      "Investir dans l'éducation civique dès le plus jeune âge."
    ]
  },
  {
    icon: Megaphone,
    title: 'Agir concrètement avec le MAC',
    points: [
      "Signaler un problème d'infrastructure ou d'insalubrité sur la carte.",
      "Proposer une solution si vous êtes association, entreprise ou volontaire.",
      "Participer aux campagnes de sensibilisation du MAC.",
      "Partager cette plateforme : plus nous sommes nombreux, plus elle est utile."
    ]
  }
];
