# Portfolio — Mohamed Biagui

Site vitrine personnel : technicien réseaux & télécoms en transition vers un profil DevSecOps / Security Engineer.

- **Site en ligne** : https://mohamedbiagui15-debug.github.io/portfolio/
- **Dépôt** : https://github.com/mohamedbiagui15-debug/portfolio

Site statique **100 % vanilla** (HTML5, CSS3, JavaScript), sans framework ni dépendance propriétaire. Déployable tel quel sur GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur statique.

## Arborescence

```
portfolio/
├── index.html                  Page unique (sections ancrées)
├── favicon.ico                 Icône MB dorée (placeholder, remplaçable)
├── README.md
├── .gitignore / .gitattributes
└── assets/
    ├── css/style.css           Feuille de style (tokens :root en tête)
    ├── js/main.js              Comportements (typewriter, scrollspy, reveal, compteurs…)
    ├── img/
    │   ├── hero-mohamed.png    Portrait du hero            ← à déposer
    │   ├── hero-bg.jpg         Fond datacenter du hero     ← à déposer
    │   ├── about.jpg           Image section À propos      ← à déposer
    │   ├── rack.jpg            Image verticale Formation   ← à déposer
    │   └── logos/
    │       ├── huawei.png      ← à déposer
    │       ├── cisco.png       ← à déposer
    │       ├── fortinet.png    ← à déposer
    │       ├── excel.png       ← à déposer
    │       └── alten.png       Logo timeline Expérience    ← à déposer
    └── cv/CV_Mohamed_Biagui.pdf                            ← à déposer
```

## Fichiers à déposer (remplacer les placeholders)

Chaque fichier ci-dessous existe déjà sous forme de **placeholder explicite** (image avec le nom du fichier attendu). Il suffit d'écraser le fichier avec le vrai, **sans toucher au code**.

| Fichier | Emplacement | Recommandation |
|---|---|---|
| `hero-mohamed.png` | `assets/img/` | Portrait (pull jaune), fond transparent ou sombre, ~900×1200 px. Affiché en `object-fit: cover; object-position: top`, fondu à gauche. |
| `hero-bg.jpg` | `assets/img/` | Couloir datacenter, ≥ 1600 px de large, poids < 400 Ko. Recouvert par un dégradé sombre côté gauche. |
| `about.jpg` | `assets/img/` | Câbles réseau, ratio 4/5 (ex. 800×1000). |
| `rack.jpg` | `assets/img/` | Baie serveurs verticale, ratio 3/4 (ex. 800×1067). |
| `huawei.png`, `cisco.png`, `fortinet.png`, `excel.png` | `assets/img/logos/` | Logos sur fond blanc ou transparent, ~400×200 px. Affichés à 56 px de haut max. |
| `alten.png` | `assets/img/logos/` | Logo ALTEN, carré ou rond, affiché à 30 px dans un cercle blanc. |
| `CV_Mohamed_Biagui.pdf` | `assets/cv/` | CV au format PDF. |

Les extensions doivent rester identiques (`.png` / `.jpg`), sinon adapter les chemins dans `index.html` (et `assets/css/style.css` pour `hero-bg.jpg`).

## Lancer en local

Aucune étape de build. Deux options :

**Option 1 — double-clic** : ouvrir `index.html` dans un navigateur.

**Option 2 — petit serveur local** (recommandé, comportement identique à l'hébergement) :

```bash
# Python 3
cd portfolio
python -m http.server 8080
# puis ouvrir http://localhost:8080
```

ou avec l'extension VS Code *Live Server* (clic droit sur `index.html` → *Open with Live Server*).

## Déploiement

### GitHub Pages (configuration actuelle)

Le dépôt `mohamedbiagui15-debug/portfolio` est déjà relié (`origin`) et GitHub Pages est activé sur la branche `main`, dossier racine. **Chaque `git push` sur `main` redéploie le site** en une à deux minutes :

```bash
cd portfolio
git add -A
git commit -m "feat: vraies images et CV"
git push
```

Pour refaire la configuration sur un autre compte ou dépôt :

```bash
git remote set-url origin https://github.com/<utilisateur>/<repo>.git
git push -u origin main
```

puis **Settings → Pages → Build and deployment → Source : Deploy from a branch → Branch : `main` / `/ (root)` → Save**.
Le site est publié sur `https://<utilisateur>.github.io/<repo>/`.

> Tous les chemins sont relatifs (`assets/...`), le site fonctionne donc aussi bien à la racine d'un domaine que dans un sous-dossier.

**Authentification pour `git push`** : au premier push, Git for Windows ouvre une fenêtre de connexion GitHub (Git Credential Manager). Alternative : installer la CLI GitHub (`winget install GitHub.cli`), puis `gh auth login`.

### Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** → connecter le dépôt GitHub/GitLab.
2. Paramètres de build : *Build command* vide, *Publish directory* : `.` (racine).
3. **Deploy**. Chaque `git push` redéploie automatiquement.

Alternative sans dépôt : glisser-déposer le dossier `portfolio/` sur la zone *Drag and drop* de Netlify.

### Vercel

1. [vercel.com/new](https://vercel.com/new) → importer le dépôt.
2. *Framework Preset* : **Other**, *Build Command* vide, *Output Directory* : `.`.
3. **Deploy**.

Ou en ligne de commande :

```bash
npm i -g vercel
cd portfolio
vercel --prod
```

## Personnalisation rapide

- **Couleurs, rayons, ombres, polices** : tout est centralisé dans le bloc `:root` en tête de `assets/css/style.css`.
- **Contenus** : directement dans `index.html` (chaque section est délimitée par un commentaire).
- **Lignes du terminal** : tableau `LINES` dans `assets/js/main.js` (le contenu statique équivalent est aussi dans `index.html` pour le repli sans JS).
- **Vitesse du typewriter** : constantes `CHAR_DELAY` (ms/caractère) et `LINE_PAUSE` (ms entre lignes) dans `main.js`.
- **Liens sociaux** : dans le hero et le footer de `index.html` (LinkedIn, GitHub, GitLab, e-mail, téléphone).
- **Pourcentages des barres** : attribut `data-progress` sur chaque `.bar__fill`.
- **Chiffres de la barre de stats** : attributs `data-count` / `data-suffix` sur chaque `.stat__num`.

## Responsive

| Largeur | Comportement |
|---|---|
| ≥ 1024 px | Layout desktop complet (menu horizontal, grilles 3 colonnes, hero 2 colonnes). |
| 768 – 1023 px | Grilles en 2 colonnes, hero en 1 colonne (photo sous le texte), menu burger. |
| < 768 px | Tout en 1 colonne, menu burger plein écran, boutons en pleine largeur. |
| < 480 px | Stats et certifications en 1 colonne. |

## Accessibilité

- HTML5 sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`), un seul `h1`.
- Navigation clavier : lien d'évitement, focus visible doré, fermeture du menu mobile avec `Échap`, `aria-expanded` / `aria-current`.
- Textes alternatifs sur toutes les images, icônes décoratives en `aria-hidden`.
- Barres de progression exposées avec `role="progressbar"`.
- `prefers-reduced-motion` respecté (pas de typewriter, de reveal ni de compteurs animés).

## Licence

© 2026 Mohamed Biagui. Tous droits réservés. Le code peut être réutilisé comme base de portfolio personnel ; les contenus, textes et images restent la propriété de l'auteur.
