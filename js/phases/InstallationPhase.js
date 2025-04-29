export class InstallationPhase {
    constructor() {
        this.currentPlayer = 1; // Commence avec le joueur 1
        this.currentTurn = 1; // Premier tour, chaque action d'un joueur passe au prochain tour
        this.playedTiles = []; // Tableau des tuiles déjà jouées
    }

    // Passe au joueur suivant
    nextPlayer() {
        this.currentPlayer = this.currentPlayer % 3 + 1;
            this.currentTurn++;
    }

    // Ajoute une tuile jouée
    addPlayedTile(tileId) {
        this.playedTiles.push(tileId);
    }

    // Vérifie si c'est le tour du joueur spécifié
    isPlayerTurn(playerId) {
        return this.currentPlayer === playerId;
    }
} 