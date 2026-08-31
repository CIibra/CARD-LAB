# Carte Citoyenne MAC — Mise à jour v15 — App Android installable

## 🆕 Nouveautés v15

- **`capacitor.config.ts`** ajouté à la racine du projet.
- **URL de réinitialisation de mot de passe fixée** (`AuthContext.jsx`) :
  utilise maintenant une URL fixe plutôt que `window.location.origin`, pour
  fonctionner correctement une fois packagé en app mobile. Mets à jour la
  constante `PRODUCTION_URL` si ton nom de domaine change un jour.

## 📱 Guide complet — obtenir un vrai fichier .apk installable

Toutes ces commandes se lancent depuis la racine de ton projet
(`C:\Users\DELL\Desktop\MAC\carte-citoyenne`), après avoir fusionné ce zip.

### Étape 1 — Installer Capacitor

```
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### Étape 2 — Ajouter la plateforme Android

Le fichier `capacitor.config.ts` fourni dans ce zip sert de configuration :
pas besoin de relancer `npx cap init`.

```
npx cap add android
```

Ça crée un dossier `android/` à la racine : un vrai projet Android Studio complet.

### Étape 3 — Construire le site et le synchroniser dans l'app

```
npm run build
npx cap sync android
```

À refaire à chaque fois que tu modifies le code web et veux que ça se
reflète dans l'app mobile.

### Étape 4 — Ouvrir dans Android Studio

```
npx cap open android
```

Android Studio s'ouvre avec le projet chargé (patience la première fois,
il indexe et télécharge des dépendances Gradle).

### Étape 5 — Générer le fichier .apk installable

Dans Android Studio :
1. Menu **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Attends la fin du build (barre de progression en bas)
3. Une notification apparaît : **"APK(s) generated successfully"** avec un
   lien **"locate"** — clique dessus
4. Le fichier `app-debug.apk` s'ouvre dans l'explorateur de fichiers

Ce fichier `.apk` est **directement installable** sur n'importe quel
téléphone Android : envoie-le par email, clé USB, ou Google Drive, et
installe-le (il faudra peut-être activer "Autoriser l'installation
d'apps inconnues" dans les réglages du téléphone la première fois).

### 🔜 Pour publier sur le Play Store plus tard

Ce fichier `.apk` "debug" suffit pour tester sur de vrais téléphones dès
maintenant. Pour une publication officielle sur le Play Store, il faudra
générer une version "signée" (Build → Generate Signed Bundle / APK), avec
une clé de signature à créer et **à conserver précieusement** (indispensable
pour toute future mise à jour de l'app publiée). On abordera cette étape le
moment venu.

### 🎨 Optionnel — icône personnalisée de l'app

Par défaut, l'app utilise l'icône générique Android. Pour utiliser le logo
MAC :

```
npm install -D @capacitor/assets
```

Crée un dossier `resources/` à la racine avec une image `icon.png` (carrée,
1024x1024 px — tu peux repartir de `src/assets/logo-mac.png` en l'agrandissant),
puis :

```
npx capacitor-assets generate --iconBackgroundColor "#0e7a4f" --iconBackgroundColorDark "#0e7a4f"
npx cap sync android
```

### ⚠️ iOS (mis de côté pour l'instant)

Tu as indiqué ne pas avoir de Mac actuellement — la compilation iOS
nécessite obligatoirement Xcode sur macOS (restriction Apple, aucune
alternative Windows). On reprendra cette partie si tu as accès à un Mac,
ou via un service de build iOS dans le cloud (MacStadium, Codemagic...) le
moment venu.

---



- **Titre raccourci** : "Carte Citoyenne" (au lieu de "La carte des citoyens
  ivoiriens", trop long sur mobile).
- **Boutons connexion/déconnexion en icônes** : sur mobile (< 640px), le texte
  est masqué et seule une icône reste visible (`LogIn`/`LogOut` de
  lucide-react — aucune représentation humaine). Le texte réapparaît sur
  desktop.
- **Nom d'utilisateur tronqué proprement** sur mobile (plus de débordement).
- **Navigation devenue défilable horizontalement** au lieu de revenir à la
  ligne de façon encombrante quand tous les onglets ne tiennent pas.
- **Barre de filtres empilée en pleine largeur** sur mobile (< 560px) :
  sélecteurs et bouton "Signaler" prennent toute la largeur au lieu d'être
  compressés côte à côte.
- **En-tête plus compact** sur petits écrans (padding réduit, taille de
  police adaptative jusqu'à 13px sur les très petits écrans).

Aucun changement SQL pour cette version — uniquement CSS et composants React.

---



- **Complément d'adresse (facultatif)** : nouveau champ pour préciser un lieu
  exact au-delà du quartier ("3ème maison après la pharmacie, portail bleu...").
  Même règle de visibilité que le quartier : masqué publiquement, révélé au
  prestataire une fois sa solution acceptée par le MAC. Modifiable comme le
  reste tant que le signalement est au statut `Nouveau`.

- **Téléphone du déclarant (obligatoire) — protection renforcée** : contrairement
  au quartier/complément d'adresse (simplement masqués à l'écran), le
  téléphone est stocké dans une **table séparée avec ses propres règles
  d'accès en base de données** (`issue_contact_info`). Concrètement :
  - **Seul un compte `mac_admin` peut le lire** — même en interrogeant
    directement l'API Supabase, un prestataire ou un citoyen ne peut
    techniquement pas y accéder (pas seulement "caché à l'écran").
  - **Jamais révélé à un prestataire**, même après acceptation de sa solution
    (contrairement à l'adresse).
  - Visible côté admin en cliquant sur une ligne du tableau "Signalements"
    (ouvre la fenêtre de détail, avec mention "Confidentiel — réservé à
    l'équipe MAC").
  - Un texte rassurant s'affiche sous le champ au moment de la saisie,
    expliquant cette protection.

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v13.sql` : ajoute la colonne `adresse_complement` sur
`issues`, et crée la table `issue_contact_info` avec ses policies dédiées
(insertion par l'auteur du signalement, lecture strictement réservée à
l'admin).

---



- **Adresse précise masquée tant qu'aucune solution n'est validée** : le
  champ "quartier / repère" (adresse exacte, ex: "Quartier Saint Jean, près
  du grand marché") n'est plus visible publiquement sur la carte ni dans la
  fenêtre de détail. Seule la commune (niveau ville) reste publique.
  L'adresse exacte n'apparaît que pour :
  - l'administrateur MAC (toujours)
  - l'auteur du signalement (le sien)
  - le prestataire dont la solution a été **acceptée** par le MAC (`accepté`,
    `en_execution`, `terminé`)

  Objectif : sans validation officielle du MAC, un prestataire ne dispose que
  d'une localisation approximative — insuffisante pour intervenir seul sans
  passer par le circuit de validation.

Aucun changement SQL nécessaire pour cette version (requête basée sur les
tables existantes).

---



- **Photos de réalisation à la fin des travaux (2 max, facultatif)** : quand
  le prestataire clique "Signaler la fin des travaux" depuis son profil, une
  fenêtre lui propose d'ajouter jusqu'à 2 photos du résultat avant de
  confirmer. Ces photos sont ensuite visibles :
  - dans son propre profil (carte de la solution)
  - dans l'espace admin, onglet **"Résolutions à confirmer"**, pour aider
    à vérifier avant de valider le passage en "Résolu"

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v11.sql` : ajoute la colonne `completion_photos` sur
`issue_solutions`. Réutilise le même bucket `issue-photos` déjà en place,
aucune nouvelle policy de stockage nécessaire.

---



- **Miniatures ajoutées dans "Urgences Récentes"** (elles manquaient dans
  cette liste précise, déjà présentes ailleurs).
- **Signalements cliquables** (liste d'accueil + "Mon Profil") : ouvrent une
  **fenêtre de détail par-dessus la page** (pas une nouvelle page) — titre,
  statuts, catégorie, commune, horodatage, description complète (défilable
  si longue), photos en grand, et bouton "Proposer une solution" (sauf dans
  "Mon Profil", puisqu'on ne propose pas de solution à son propre
  signalement). Fermable par la croix ou un clic en dehors.

---



- **Correctif "Bucket not found"** : le bucket `issue-photos` doit être créé
  **manuellement** dans Supabase → Storage (l'INSERT SQL direct échoue selon
  les permissions du rôle utilisé dans le SQL Editor). Voir instructions
  détaillées plus bas.
- **Logo** : revenu à sa taille d'origine (30px), remis strictement à gauche
  (le centrage introduit en v8 le décalait visuellement vers la droite).
- **Texte "Mouvement Avenir Citoyen" retiré** de sous le logo.
- **Titre du header** changé en "La carte des citoyens ivoiriens".

## 🗄️ Étape indispensable — corriger "Bucket not found"

1. Supabase → **Storage** (menu de gauche) → **New bucket**
2. Nom exact : `issue-photos`
3. Coche **Public bucket** → Créer
4. Exécute ensuite `supabase/fix_v9.sql` (policies uniquement, le bucket est
   déjà créé à ce stade)

---



- **Session non persistante** : chaque lancement/rechargement de l'app exige
  une reconnexion (plus de compte resté connecté automatiquement). Voir
  `src/services/supabaseClient.js` (`persistSession: false`) — à reconsidérer
  si tu veux garder ce confort pour les utilisateurs finaux plus tard.
- **Logo agrandi et centré** au-dessus du texte "Mouvement Avenir Citoyen".
- **Photos sur les signalements (2 max, facultatif)** : à la création
  (`ReportModal`) et à la modification (`EditIssueModal`), avec aperçu,
  suppression individuelle, et affichage des miniatures sur la carte
  (popup) et dans "Mon Profil". Stockage via un nouveau bucket Supabase
  Storage `issue-photos` (public en lecture, upload réservé aux connectés).

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v8.sql` : crée le bucket de stockage `issue-photos`
et ses policies (lecture publique, upload par utilisateur connecté,
suppression par le propriétaire du fichier).

---



- **Modifier / retirer un signalement depuis "Mon Profil"** : possible
  uniquement tant que le statut est encore `Nouveau` (dès qu'une solution est
  proposée ou qu'il progresse, il devient figé — logique, pour ne pas
  perturber un travail déjà engagé).
- **Horodatage repositionné et bien visible** : badge en bas à droite de
  chaque carte de signalement (accueil et profil), au lieu d'un petit texte
  discret.

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v7.sql` : ajoute la policy autorisant un auteur à
supprimer son propre signalement, uniquement s'il est encore au statut
`Nouveau`.

---



- **Bug corrigé : "Mes signalements" vide dans le profil** — les signalements
  n'enregistraient jamais l'auteur (`user_id`) à la création. Corrigé.
- **Onglet "Mon Profil"** ajouté dans le menu principal, après "À propos"
  (visible uniquement si connecté).
- **Logo** : le texte "Mouvement Avenir Citoyen" est maintenant sous le logo,
  sur une seule ligne.
- **Footer repensé** : fond navy, colonnes (présentation, liens rapides, site
  officiel), copyright en bas.
- **Redirection après connexion** : accueil pour tout le monde, sauf l'admin
  qui atterrit directement sur `/admin`.
- **Temps relatifs** ("À l'instant", "Il y a 2 h", "Depuis 3 jours"...) sur les
  signalements : panneau d'accueil, popups de la carte, profil.
- **Circuit de résolution complet** (répond à ta question sur "accepté → résolu") :
  1. Signalement créé → `Nouveau`
  2. Une solution est proposée → passage automatique en `Solution proposée`
  3. Le MAC accepte une solution → passage automatique en `Partenaire identifié`
  4. Le porteur de la solution, depuis son **profil**, clique **"Travaux commencés"**
     → sa solution passe en `en_execution`
  5. Puis **"Signaler la fin des travaux"** → passe en `terminé`
  6. Le MAC voit ça dans le nouvel onglet admin **"Résolutions à confirmer"**
     et clique **"Confirmer la résolution"** → *alors seulement* le signalement
     passe en `Résolu`
  - Un signalement `Résolu` (ou `Archivé`) **disparaît de la carte et du
    panneau public "Urgences Récentes"**, mais reste compté dans les
    statistiques et visible dans tout l'espace admin.

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v6.sql` : ajoute la policy permettant à un prestataire
de faire évoluer le statut de sa propre solution proposée (`en_execution`,
`terminé`).

---

# Mise à jour v5 (rappel)

- **Œil afficher/masquer** sur le mot de passe (connexion, inscription, réinitialisation).
- **"Mot de passe oublié ?"** avec envoi d'un lien de réinitialisation par email.
- **Nouvelle page** `/reinitialiser-mot-de-passe`.
- Rappel important : **aucun mot de passe n'est récupérable**, ni par toi ni
  par personne — Supabase ne stocke qu'un hash irréversible, c'est une
  protection standard. Seule la réinitialisation est possible.

---



- **Espace "Mon Profil"** (`/profil`, lien dans le header au clic sur son nom) :
  infos du compte, mes signalements, mes propositions de solution, mes messages
  envoyés au MAC (avec la réponse si l'admin y a répondu).
- **L'admin peut répondre aux messages** (pas seulement "marquer comme traité") :
  la réponse est enregistrée en base et visible par l'expéditeur **s'il était
  connecté** en envoyant son message, dans son espace "Mon Profil". Un envoi
  par email réel nécessiterait un service payant (Resend, SendGrid...) — hors
  scope de cette passe, dis-le-moi si tu veux qu'on l'ajoute.
- **Graphiques admin** (nouvel onglet "Statistiques") : signalements par
  catégorie, répartition par statut, top communes concernées. Nécessite la
  librairie `recharts` (voir installation ci-dessous).
- **Filtres admin** dans l'onglet Signalements : par statut, catégorie, et
  recherche par commune.
- **"Contacter le MAC" masqué pour l'admin connecté** (il en est le
  destinataire) ; s'il visite quand même l'URL directement, un message
  explicatif s'affiche à la place du formulaire.
- **Carte plus robuste** : les signalements avec coordonnées invalides sont
  désormais ignorés proprement (avec avertissement en console) au lieu de
  potentiellement perturber l'affichage des autres marqueurs. Si un
  signalement précis manque toujours sur la carte, vérifie dans Supabase →
  Table Editor → `issues` que ses colonnes `latitude`/`longitude` sont bien
  renseignées (probablement une entrée de test créée avant que tout soit
  branché correctement).
- **Correctif RLS renforcé** (`supabase/fix_v4.sql`) : ajoute des `GRANT`
  explicites en plus des policies, au cas où l'erreur RLS sur
  "Proposer une solution" persistait malgré le fix précédent.

## ⚙️ Nouvelle dépendance à installer

```bash
npm install recharts
```

## 🗄️ Étape SQL supplémentaire

Exécute `supabase/fix_v4.sql` dans le SQL Editor Supabase (rejouable sans
risque). Il ajoute aussi les colonnes `user_id`, `admin_reply`, `replied_at`
sur `contact_messages`, nécessaires pour "Mon Profil" et les réponses admin.

---



- **Design repensé, vert redevenu principal** : header vert (couleur MAC), logo
  officiel affiché dans une **puce blanche** pour rester visible quel que soit
  le fond, titre "Carte Citoyenne" centré, onglets avec indicateur vert actif.
- **Police** : Inter (import Google Fonts via CSS, pas besoin de toucher
  `index.html`), plus proche d'une interface moderne.
- **Footer ajouté** sur toutes les pages (mention MAC + lien vers le site officiel).
- **Marge basse augmentée** sous la carte et sur les pages (`padding-bottom`).
- **Badge "Nouveau" en double corrigé** : seul le badge vert basé sur le temps
  écoulé (moins de 48h) reste affiché dans le panneau "Urgences Récentes" ;
  le badge de statut (bleu/gris) a été retiré de cet endroit précis (il reste
  utilisé, à juste titre, dans le tableau de modération admin).
- **Formulaire de contact pré-rempli** : si l'utilisateur est connecté, son
  nom et son email sont automatiquement remplis (modifiables).
- **Messages de contact visibles côté admin** : nouvel onglet "Messages" dans
  l'espace admin, avec bouton "Marquer comme traité".
- **Correctif RLS** : voir `supabase/fix_issue_solutions_rls.sql` ci-dessous,
  résout l'erreur "new row violates row-level security policy" lors de la
  proposition d'une solution.

## 🗄️ Étape supplémentaire — corriger l'erreur RLS

Exécute `supabase/fix_issue_solutions_rls.sql` dans le SQL Editor Supabase.
Il est **rejouable sans risque** (utilise `DROP POLICY IF EXISTS` avant chaque
`CREATE POLICY`), donc aucune inquiétude si certaines policies existent déjà.
La dernière ligne du script te montre les policies actives sur `issue_solutions`
pour confirmer que tout est en ordre.

## 🔐 Vérification d'email à l'inscription — décision technique

Tu as choisi "recommandée mais non bloquante". Techniquement, Supabase ne
permet pas ce mode intermédiaire nativement : soit la confirmation email est
activée (et bloque la connexion tant qu'elle n'est pas faite), soit elle est
désactivée (connexion immédiate, mais alors aucun email n'est envoyé).

**Recommandation appliquée : désactiver la confirmation email dans Supabase**
pour garantir une connexion immédiate (ta priorité). Vérifie ce réglage dans
Supabase → **Authentication → Providers → Email** → désactive "Confirm email"
si ce n'est pas déjà fait. C'est cohérent avec ce que tu observais (connexion
possible sans avoir reçu/cliqué de lien).

Si tu veux plus tard une vraie vérification obligatoire (plus sécurisé, mais
bloquant tant que l'email n'est pas confirmé), dis-le-moi et on l'implémente
à ce moment — c'est un choix de compromis sécurité/simplicité à trancher plus tard.

---



## ⚠️ Comment installer ce zip (important)

Ce zip n'est **pas un projet autonome**. Il contient uniquement les dossiers
`src/` et `supabase/` à copier **par-dessus** ton projet existant
(`carte-citoyenne/`, celui qui contient déjà `node_modules`, `package.json`,
`index.html`). Ne crée pas de sous-dossier avec ce zip à côté de ton projet :
fusionne son contenu directement dedans, en acceptant le remplacement des
fichiers en conflit.

## ⚙️ Nouvelle dépendance à installer

En plus de `react-router-dom` (déjà demandé précédemment), cette v2 utilise
la librairie d'icônes `lucide-react` :

```bash
npm install lucide-react
```

## 📁 Où placer les fichiers

Copie le contenu de ce zip par-dessus ton dossier `carte-citoyenne/`, en
respectant les chemins (tout part de `src/` et `supabase/`). Les fichiers
suivants sont **remplacés** :

- `src/App.jsx` (nouveau contenu, ancien monolithe supprimé)
- `src/main.jsx`
- `src/context/AuthContext.jsx`, `src/context/IssueContext.jsx`
- `src/services/supabaseClient.js`
- `src/components/auth/AuthModal.jsx`
- `src/assets/styles/global.css`, `navbar.css`, `map.css`, `admin.css`

Et les suivants sont **nouveaux** :

- `src/data/regionsCI.js`
- `src/components/common/Navbar.jsx`, `BadgeStatus.jsx`
- `src/components/citizen/FilterBar.jsx`, `MapView.jsx`, `ReportModal.jsx`, `SolutionModal.jsx`
- `src/components/admin/AdminStats.jsx`, `IssueModerationTable.jsx`, `SolutionValidationList.jsx`
- `src/pages/HomePage.jsx`, `ValeursPage.jsx`, `ContactPage.jsx`, `AboutMacPage.jsx`, `AdminDashboardPage.jsx`
- `supabase/schema_updates.sql`

Les fichiers suivants de ton arbre initial ne sont **pas** utilisés par cette
mise à jour (ancien prototype ou pages non couvertes dans cette passe) :
`src/pages/IssuePage.jsx`, `src/pages/PartnerDashboardPage.jsx`,
`src/components/citizen/IssueDetail.jsx`, `src/components/admin/StatusChangeModal.jsx`,
`src/components/partner/*`. Ils peuvent être développés dans une passe suivante.

## ⚙️ Étape 1 — Installer react-router-dom

L'app utilise maintenant un vrai routeur. Depuis le dossier du projet :

```bash
npm install react-router-dom
```

## 🗄️ Étape 2 — Exécuter le SQL

Dans Supabase → **SQL Editor**, exécute le contenu de `supabase/schema_updates.sql`
(après ton `schema.sql` initial déjà en place). Il ajoute :

- la table `contact_messages` (formulaire de contact) + policies
- la policy manquante permettant à l'admin de valider/refuser une solution
- les policies manquantes sur `organisations` et `profiles`

## 👑 Étape 3 — Devenir super-admin (mac_admin)

1. Crée un compte normalement sur le site (bouton "Connexion / Inscription" → "Créer un compte").
2. Dans Supabase → SQL Editor, exécute (en remplaçant l'email) :

```sql
UPDATE public.profiles
SET role = 'mac_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'ton-email@exemple.com');
```

3. Reconnecte-toi sur le site (déconnexion/reconnexion) : un lien **"🛡️ Espace Admin"**
   apparaît dans la barre de navigation, menant vers `/admin`.

## 🐞 Bugs corrigés dans cette passe

- **Auth fake → vraie auth Supabase** : connexion/inscription réelles, mot de passe
  demandé dans les deux cas, rôles gérés en base.
- **Carte qui débordait sans marge** : hauteur passée de `520px` fixe à
  `min(65vh, 560px)` + suppression de `overflow: hidden` sur `body`/`#root`
  dans `global.css`, qui empêchait tout scroll sur petit écran.
- **Header** : logo "MAC" à gauche, titre vraiment centré (grid 3 colonnes),
  bloc auth à droite.
- **Page Contact non centrée** : conteneur en `flex; justify-content: center`
  au lieu d'un simple `maxWidth` sans marge automatique. Le formulaire écrit
  maintenant réellement en base (`contact_messages`), visible par l'admin.
- **Éducation & Valeurs pauvre** : remplacé par 8 chapitres complets sur la
  citoyenneté, le civisme, la responsabilité collective, l'engagement dans le
  développement du pays, etc., en accordéon cliquable.
- **À propos pauvre + bug `**MAC**`** : contenu enrichi en plusieurs sections,
  et le texte utilisait du markdown brut (`**MAC**`) non interprété par React ;
  remplacé par `<strong>MAC</strong>`.
- **Aucun moyen de devenir admin** : le rôle `mac_admin` existait déjà en base
  mais rien ne l'exploitait ; espace `/admin` créé, protégé, avec validation
  des solutions (confirmer/refuser) et changement de statut des signalements.
- **Workflow de validation** : toute solution proposée est créée avec le statut
  `proposé` (en attente) par défaut ; seul un compte `mac_admin` peut la faire
  passer à `accepté` ou `refusé` (policy RLS dédiée).

## 🆕 Nouveautés de cette v2

- **Logo officiel intégré** : ton logo (`src/assets/logo-mac.png`) est maintenant
  utilisé dans le header, en haut à gauche, **cliquable** (renvoie vers l'accueil),
  avec "Mouvement Avenir Citoyen" affiché en dessous.
- **Palette de couleurs officielle** : dérivée de ton logo (navy, teal, orange,
  vert). Le header passe du vert plein au navy du logo ; l'orange devient la
  couleur d'action/accent (onglet actif, boutons) ; le vert reste présent mais
  n'est plus omniprésent.
- **Titre du header** : simplifié en "Carte Citoyenne" seul (le sous-titre
  "Mouvement Avenir Citoyen" est maintenant sous le logo, plus dans le header).
- **Éducation & Valeurs entièrement repensée** :
  - 14 chapitres courts (au lieu de 8 longs) affichés en grille de cartes
    cliquables avec icônes (objets uniquement, aucun personnage humain,
    via `lucide-react`).
  - Le clic ouvre une **vraie boîte de dialogue modale centrée par-dessus la
    page**, façon diaporama : navigation Précédent/Suivant, indicateur de
    progression, navigation au clavier (flèches + Échap), contenu en **puces
    courtes** plutôt qu'en paragraphes continus.
- **À propos** : texte en **justifié**, ajout d'un lien cliquable vers le site
  officiel `https://mac-84b.pages.dev/`.
- **Carte** : les marqueurs sont maintenant **colorés selon la priorité**
  (rouge = urgente, orange = moyenne, bleu = faible) avec une légende visible
  en bas à gauche de la carte — diversifie la palette et ajoute une info utile.

## 🔜 Pistes pour une prochaine passe

- Upload de photos pour les signalements (colonne `photos` déjà prévue en base).
- Page de détail d'un signalement (`IssuePage.jsx`) avec historique et solutions liées.
- Tableau de bord partenaire (`PartnerDashboardPage.jsx`) pour que les
  organisations suivent leurs propositions.
- Notification par email lors de la validation d'une solution.
