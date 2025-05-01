import { TILE_CONFIGS } from '../pieces/TileTypes.js';

export class InstallationPhase {
    constructor(numPlayers) {
        this.currentPlayer = 1; // Commence avec le joueur 1
        this.currentTurn = 1; // Premier tour, chaque action d'un joueur passe au prochain tour
        this.playedTiles = []; // Tableau des tuiles déjà jouées
        this.tilesToPlay = this.getTilesForPlayers(numPlayers);; // Tableau des tuiles 
        console.log(this.tilesToPlay);
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    getTilesForPlayers(numPlayers) {
        const tileRanges = {
            2: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
            4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
        };
        const titles = tileRanges[numPlayers]
        this.#shuffle(titles);

        return titles.map(tileId => ({
            id: tileId,
            ...TILE_CONFIGS[tileId]
        }));
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