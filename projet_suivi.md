# Suivi du projet - Jeu de société hexagonal

## Structure actuelle
- Dossier principal: `js/`
- Sous-dossiers créés:
  - `core/` - Contient HexCoordinates.js, GameLauncher.js, GameSession.js
  - `ui/` - Contient GameMenu.js
  - `pieces/`
  - `phases/`
  - `network/`
- Fichiers existants/migrés:
  - `js/app.js` - Point d'entrée actuel (à remplacer)
  - `js/transformToOrthonormal.js` - (remplacé par HexCoordinates.js)
  - `js/Scene3D.js` - Gère la scène 3D avec Three.js (à refactoriser)
  - `js/PieceType.js` - Définit les types de pièces (à refactoriser)
  - `js/PieceInstance.js` - Crée des instances de pièces (à refactoriser)
  - `js/core/HexCoordinates.js` - Nouvelle classe pour gérer les coordonnées hexagonales
  - `js/core/GameLauncher.js` - Nouveau point d'entrée du jeu
  - `js/ui/GameMenu.js` - Menu de sélection de joueur
  - `js/core/GameSession.js` - Gestion d'une session de jeu

## Architecture proposée
```
js/
├── core/         # Logique principale du jeu
│   ├── GameLauncher.js
│   ├── GameSession.js
│   ├── AssetManager.js
│   └── HexCoordinates.js
├── ui/           # Interface utilisateur
│   ├── GameMenu.js
│   └── GameBoard3D.js
├── pieces/       # Pièces du jeu
│   ├── GamePieceModel.js
│   ├── GamePieceInstance.js
│   ├── Tile.js   # Tuiles hexagonales
│   └── PlayerToken.js
├── phases/       # Phases de jeu
│   ├── SetupPhase.js
│   ├── ActionSelectionPhase.js
│   └── ActionExecutionPhase.js
└── network/      # Communication réseau
    ├── NetworkManager.js
    └── GameSimulator.js  # Pour tests sans backend
```

## Plan d'action progressif
1. **Phase 1: Structure de base et menus (TERMINÉ)**
   - [x] Créer la structure de dossiers
   - [x] Implémenter HexCoordinates pour les transformations de coordonnées
   - [x] Créer un GameLauncher basique (point d'entrée)
   - [x] Développer un GameMenu simple pour la sélection de joueur
   - [x] Établir le squelette de GameSession

2. **Phase 2: Système de pièces (ACTUEL)**
   - [ ] Implémenter la classe GamePieceModel (base)
   - [ ] Implémenter la classe GamePieceInstance
   - [ ] Créer les classes spécifiques (Tile, PlayerToken)

3. **Phase 3: Plateau de jeu et rendu**
   - [ ] Développer GameBoard3D pour remplacer Scene3D
   - [ ] Implémenter le rendu des pièces hexagonales
   - [ ] Gérer les interactions utilisateur basiques

4. **Phase 4: Logique de jeu**
   - [ ] Créer le système de phases
   - [ ] Implémenter les règles spécifiques
   - [ ] Développer la logique tour par tour

5. **Phase 5: Simulation réseau et tests**
   - [ ] Développer le NetworkManager
   - [ ] Créer le GameSimulator pour tests sans backend
   - [ ] Implémenter les événements réseau

6. **Phase 6: Intégration Rails**
   - [ ] Créer l'API Rails
   - [ ] Connecter le jeu au backend
   - [ ] Implémentation multijoueur réelle

## État actuel du jeu
- Structure de base mise en place (GameLauncher, GameMenu, GameSession)
- Flux de navigation entre le menu et la session de jeu fonctionnel
- Possibilité de sélectionner un joueur et de démarrer une session
- Cycle basique des phases de jeu implémenté (setup → action → execution)

## Prochaines étapes recommandées
1. Implémenter GamePieceModel pour gérer les types de pièces
2. Implémenter GamePieceInstance pour les instances de pièces
3. Commencer à développer le plateau de jeu hexagonal

## Règles de contribution

- **Un seul fichier modifié à la fois** (hors fichiers de suivi comme ce fichier).
- **Maximum 40 lignes modifiées ou ajoutées** par étape.
- **Toujours demander la validation de l'utilisateur avant chaque modification** (mode "ask").
- **Expliquer chaque modification** avant de la faire.
- **Mettre à jour ce fichier ou d'autres fichiers de suivi à chaque étape importante**.
- **Séparation stricte des responsabilités :**
  - Le fichier JS principal (`main.js` ou `GameLauncher.js`) doit se concentrer sur la coordination des modules (UI, jeu, scène 3D) et la gestion des événements globaux.
  - La logique spécifique (rendu 3D, gestion des pièces, UI spécifique) doit être encapsulée dans des classes dédiées et des fichiers séparés (ex: `GameBoard3D.js`, `PlayerSelectionUI.js`).
- **Code minimaliste et ciblé :**
  - Ne fournir que le code **strictement nécessaire** pour répondre à la demande actuelle.
  - **Ne pas ajouter de code d'exemple** (objets de test, lumières par défaut, animations basiques) sauf si explicitement demandé par l'utilisateur.
- **Pas de valeurs par défaut ni de solutions de secours :**
  - Ne pas ajouter de valeurs par défaut aux paramètres de fonctions.
  - Ne pas ajouter de vérifications de sécurité inutiles (if exists, try/catch).
  - Laisser le code planter pour identifier clairement les problèmes.
- **Explications détaillées :**
  - Pour chaque modification ou création de code, fournir :
    1. Une explication de la logique métier (ce que fait le code du point de vue du jeu)
    2. Une explication technique (comment le code fonctionne d'un point de vue programmation)
  - Séparer clairement ces deux types d'explications dans la conversation.

## Bonnes pratiques techniques

### Three.js
- **Utiliser les ES Modules** au lieu des scripts CDN
  - Importer Three.js via npm : `npm install three`
  - Utiliser les imports ES6 : `import * as THREE from 'three'`
  - Ne pas utiliser les anciens scripts CDN (`three.min.js`, `three.js`)
  - Voir la documentation officielle : https://threejs.org/docs/index.html#manual/en/introduction/Installation

## Spécifications courantes

- **Au chargement de la page**, une partie à 3 joueurs démarre automatiquement.
- **Trois boutons** en haut de l'écran : Joueur 1 (rouge), Joueur 2 (vert), Joueur 3 (jaune).
- **Cliquer sur un bouton** permet d'incarner ce joueur à tout moment (pour voir ce qu'il voit).
- **Le jeu est en tour par tour, mais chaque joueur joue son tour indépendamment** (simultané).
- **Le tour suivant commence quand tous les joueurs ont joué**.
- **Sous les boutons**, une scène Three.js affiche le plateau de jeu.
