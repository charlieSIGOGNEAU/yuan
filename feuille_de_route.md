## Feuille de Route : Jeu Multijoueur en Temps Réel (Priorité Stabilité Connexions)

**Objectif du Projet :** Développer un jeu multijoueur en temps réel en s'assurant d'abord de la robustesse des connexions et de la communication temps réel, puis en construisant la logique du jeu. Backend API Rails 7, frontend HTML/JavaScript simple.

**Technologies Principales :**
*   **Backend :** Ruby on Rails 7 (mode API)
*   **Frontend :** HTML, CSS, JavaScript (client léger)
*   **Communication en Temps Réel :** ActionCable
*   **Authentification :** JWT (pour HTTP et WebSockets)
*   **Base de Données :** SQLite

---

### Phase 1 : Socle Applicatif Robuste – API, Authentification & Test Initial ActionCable

1.  **Backend : Nouvelle API Rails 7 & Configuration Initiale**
    *   Générer une nouvelle application Rails 7 en mode API.
    *   **Configuration CORS rigoureuse :** Anticiper les requêtes cross-origin pour HTTP et WebSockets (ports différents pour le frontend et le backend). Utiliser `rack-cors`.
    *   S'assurer de la configuration correcte du serveur (Puma) pour gérer les connexions ActionCable.
    *   Vérifier l'encodage UTF-8 par défaut.
2.  **Backend : Authentification JWT Solide**
    *   Intégrer la gem `jwt` et `bcrypt`.
    *   Créer un module/librairie `JsonWebToken` pour l'encodage/décodage.
    *   Créer le modèle `User` (`email`, `password_digest`).
    *   Implémenter les points d'accès HTTP pour l'inscription (`POST /api/signup`) et la connexion (`POST /api/login`) retournant un JWT.
    *   Implémenter un point d'accès HTTP authentifié de test (par exemple, `GET /api/profile`) pour valider l'authentification JWT classique.
3.  **Frontend : Structure Minimale & Authentification HTTP de Base**
    *   Créer `index.html` (formulaires inscription/connexion) et `home.html` (page pour utilisateurs connectés). Assurer `<meta charset="UTF-8">`.
    *   JavaScript pour :
        *   Gérer les soumissions de formulaires (inscription, connexion vers les endpoints `/api/...`).
        *   Stocker le JWT reçu dans `localStorage`.
        *   Rediriger vers `home.html` après connexion.
        *   Protéger `home.html` (vérifier JWT, sinon redirection vers `index.html`).
        *   Fonction utilitaire pour les appels API authentifiés (ajout du header `Authorization: Bearer <token>`).
4.  **Backend & Frontend : Configuration Initiale d'ActionCable & Test de Connexion Authentifiée**
    *   **Backend :**
        *   Configurer ActionCable (`config/cable.yml`, monter le serveur dans `config/routes.rb` sur `/cable`).
        *   **Créer `ApplicationCable::Connection` (`app/channels/application_cable/connection.rb`) :**
            *   Implémenter l'identification (`identified_by :current_user`).
            *   Logique `connect` pour trouver l'utilisateur basé sur un JWT transmis (par exemple, via un paramètre dans l'URL de connexion WebSocket `ws://localhost:3000/cable?token=JWT_TOKEN` ou un cookie).
            *   **Rejeter les connexions non authentifiées explicitement.**
            *   Ajouter des logs clairs pour le succès ou l'échec de l'authentification de la connexion WS.
        *   **Backend : Créer un `EchoChannel` de test basique** (`app/channels/echo_channel.rb`) qui renvoie simplement les données reçues (`received(data)` -> `transmit(data)`).
    *   **Frontend :**
        *   **Intégration du client ActionCable (`actioncable.js`) :**
            *   Utiliser une source fiable (CDN recommandé pour commencer, ou s'assurer de la bonne configuration pour le servir via Rails 7 si importé localement, par exemple, si `public/javascripts` est utilisé, `config.public_file_server.enabled = true`).
            *   S'assurer que `ActionCable` est défini globalement ou correctement importé.
        *   JavaScript pour établir une connexion WebSocket vers `/cable` en passant le JWT.
        *   S'abonner à `EchoChannel`.
        *   Envoyer un message test à `EchoChannel` et vérifier la réception de l'écho.
        *   Gérer et afficher les erreurs de connexion WebSocket ou d'abonnement.

**Tests Critiques pour la Phase 1 :**
*   Inscription et connexion HTTP fonctionnent, JWT est géré.
*   Pages protégées par JWT fonctionnent.
*   **Le client ActionCable (`actioncable.js`) se charge-t-il correctement sans erreur `ActionCable is not defined` ?**
*   **La connexion WebSocket à `/cable` s'établit-elle ?**
*   **L'authentification JWT pour la connexion WebSocket fonctionne-t-elle ? (Vérifier logs serveur et `current_user` dans `Connection`).**
*   **Les problèmes de CORS pour WebSockets sont-ils résolus ?**
*   Le `EchoChannel` permet-il une communication bidirectionnelle de base ?
*   Les erreurs de connexion WS (authentification échouée, serveur non joignable) sont-elles correctement interceptées et affichées côté client ?

---

### Phase 2 : Logique de Jeu de Base & Communication Temps Réel Spécifique au Jeu

1.  **Backend : Modèles de Jeu**
    *   Modèle `Game` (`status` : `waiting`, `active`, `finished`; `max_players`, etc.).
    *   Modèle `GameUser` (lie `User` et `Game`).
2.  **Backend : Points d'Accès HTTP pour la Gestion des Parties**
    *   Point d'accès `POST /api/games/quick` (authentifié) :
        *   Rejoint une partie en attente ou en crée une.
        *   Change `game.status` à `active` si la partie est pleine.
3.  **Backend : `GameChannel` pour la Communication Spécifique à une Partie**
    *   Créer `GameChannel` (`app/channels/game_channel.rb`).
    *   Méthode `subscribed` :
        *   Trouver la partie (par exemple, via `params[:game_id]`).
        *   Autoriser la souscription uniquement si l'utilisateur est un `GameUser` de cette partie.
        *   `stream_for game` ou `stream_from "game_#{game.id}"`.
    *   Méthodes pour diffuser des événements de jeu (par exemple, `broadcast_player_joined(user)`, `broadcast_game_started(game)`).
4.  **Backend : Intégration ActionCable dans la Logique de Jeu**
    *   Lorsque qu'un joueur rejoint une partie via `/api/games/quick`, après la création du `GameUser`, diffuser un message via `GameChannel` aux autres joueurs de la partie (s'ils sont déjà abonnés).
    *   Lorsque le statut d'une partie passe à `active`, diffuser un message "Partie Commencée" à tous les joueurs de la partie via `GameChannel`.
5.  **Frontend : Interaction avec les Parties et `GameChannel`**
    *   Sur `home.html`, bouton "Rejoindre/Créer Partie Rapide" appelant `/api/games/quick`.
    *   Après réponse de l'API (indiquant la partie rejointe/créée) :
        *   **S'abonner au `GameChannel` pour l'ID de la partie spécifique.**
        *   Gérer les messages reçus (par exemple, "Joueur X a rejoint", "La partie commence", "En attente de joueurs...") et mettre à jour l'interface.

**Tests Critiques pour la Phase 2 :**
*   La création/jonction de partie via API fonctionne.
*   **Le client peut-il s'abonner au `GameChannel` spécifique à sa partie après l'avoir rejointe ? L'autorisation de souscription fonctionne-t-elle ?**
*   **Les messages (nouveau joueur, début de partie) sont-ils diffusés par le backend uniquement aux joueurs de la bonne partie ?**
*   **Les clients reçoivent-ils et affichent-ils correctement ces messages temps réel ?**
*   Que se passe-t-il si un utilisateur essaie de s'abonner à un canal de jeu auquel il n'appartient pas ? (Doit être rejeté).

---

### Phase 3 : Mécanismes de Jeu de Base & Synchronisation Temps Réel des Actions

1.  **Backend : Modèle de Tuile (`Tile`) et Logique Associée**
    *   Modèle `Tile` (associé à `Game` et `GameUser` (main du joueur), `letter`, `value`, etc.).
    *   Logique de distribution initiale des tuiles lorsque la partie devient `active`.
2.  **Backend : Diffusion de l'État Initial du Jeu**
    *   Après la distribution des tuiles, diffuser à chaque joueur sa main initiale via `GameChannel` (chaque joueur ne voit que ses propres tuiles).
    *   Diffuser l'état public du jeu (par exemple, qui commence).
3.  **Backend : Gestion des Tours et Actions de Jeu**
    *   Ajouter `current_turn_game_user_id` à `Game`. Logique pour désigner le premier joueur et faire avancer le tour.
    *   Point d'accès `POST /api/games/:id/play_turn` (authentifié, vérifie si c'est le tour du joueur) :
        *   Valider l'action (par exemple, placer une tuile).
        *   Mettre à jour l'état du jeu (BDD).
        *   Diffuser le nouvel état du jeu (plateau, score, main mise à jour du joueur, prochain joueur) à tous les joueurs de la partie via `GameChannel`.
4.  **Frontend : Affichage du Jeu et Interaction**
    *   Afficher la main du joueur (reçue via ActionCable).
    *   Afficher les informations publiques du jeu (plateau, à qui le tour).
    *   Permettre au joueur dont c'est le tour d'effectuer une action et d'appeler `/api/games/:id/play_turn`.
    *   L'interface se met à jour pour tous les joueurs en fonction des diffusions reçues via `GameChannel`.

**Tests Critiques pour la Phase 3 :**
*   La distribution des tuiles est correcte, chaque joueur reçoit sa main via WS.
*   Le changement de tour est correctement géré et diffusé.
*   Une action de jeu via API déclenche une mise à jour de l'état du jeu sur le serveur ET une diffusion de ce nouvel état à tous les clients de la partie.
*   L'interface de tous les joueurs se synchronise en temps réel.
*   Seul le joueur dont c'est le tour peut effectuer une action.

---

### Phase 4 : Robustesse, Finalisation & Améliorations

*   **Gestion des Déconnexions/Reconnexions ActionCable :**
    *   Explorer comment `ActionCable` gère les déconnexions temporaires.
    *   Si un joueur se reconnecte, peut-il récupérer l'état actuel du jeu ?
*   **Amélioration de l'Interface Utilisateur (UI/UX).**
*   **Gestion des Scores.**
*   **Conditions de Fin de Partie** (détection, affichage, diffusion).
*   **Gestion des Erreurs plus Poussée** (côté client et serveur pour les actions de jeu, les diffusions).
*   **Tests de charge légers** (plusieurs navigateurs ou onglets simulant des joueurs).
*   Nettoyage du code, refactoring.

--- 