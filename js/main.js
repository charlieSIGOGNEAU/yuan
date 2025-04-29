//fichier non utilise

import { GameBoard3D } from './ui/GameBoard3D.js';
import { PlayerSelectionUI } from './ui/PlayerSelectionUI.js';

class Game {
    constructor() {
        this.gameBoard = new GameBoard3D('game-container');
        this.playerSelectionUI = new PlayerSelectionUI('game-container');
        
        // Écouter l'événement de sélection des joueurs
        document.addEventListener('playersSelected', (event) => {
            const numPlayers = event.detail.numPlayers;
            console.log(`Nombre de joueurs sélectionné: ${numPlayers}`);
            // Ici, nous pourrions initialiser le jeu avec le nombre de joueurs sélectionné
        });
    }
}

// Initialiser le jeu lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 