import { InstallationPhase } from '../phases/InstallationPhase.js';
export class GameSimulator {
    constructor() {
        // Fausse base de données pour les parties
        this.games = new Map();
        // ID de la partie actuelle
        this.currentGameId = null;
    }

    // Crée une nouvelle partie
    createGame() {
        const installationPhase = new InstallationPhase(3);
        const gameId = Date.now().toString();
        this.games.set(gameId, {
            players: [1, 2, 3], // Toujours 3 joueurs
            currentPlayer: 1,
            turn: 0,
            playedTiles: [],
            installationPhase: installationPhase,
        });
        this.currentGameId = gameId;
        return gameId;
    }

    // Récupère l'état de la partie
    getGameState() {
        return this.games.get(this.currentGameId);
    }

    // Met à jour l'état de la partie
    updateGameState(newState) {
        this.games.set(this.currentGameId, newState);
    }
} 