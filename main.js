import { GameBoard3D } from './js/ui/GameBoard3D.js';
import { PlayerSelectionUI } from './js/ui/PlayerSelectionUI.js';
import { GameSimulator } from './js/network/GameSimulator.js';

// Initialisation de la scène 3D
const gameBoard = new GameBoard3D('threejs-container');

// Initialisation de la sélection des joueurs
const playerSelection = new PlayerSelectionUI();

// Écouter les changements de joueur
document.addEventListener('playerSelected', (event) => {
    console.log(`Joueur ${event.detail.playerNumber} sélectionné`);
    // Ici, tu pourras ajouter la logique pour gérer le changement de joueur
    // Par exemple, changer la couleur des tuiles, etc.
});


// Responsive
window.addEventListener('resize', () => {
    gameBoard.onResize();
});


// creer une partie
const gameSimulator = new GameSimulator();
const gameId = gameSimulator.createGame();
console.log(gameId);
console.log(gameSimulator.games.get(gameId).turn);


gameBoard.addTile('images/Am.webp', { q: 0, r: 0});
gameBoard.addTile('images/Bm.webp', { q: 3, r: -2});
gameBoard.addTile('images/Cm.webp', { q: 2, r: 1});
gameBoard.addTile('images/Dm.webp', { q: -1, r: 3});
gameBoard.addTile('images/Fm.webp', { q: -3, r: 2});
gameBoard.addTile('images/Em.webp', { q: -2, r: -1});
gameBoard.addTile('images/Gm.webp', { q: 1, r: -3});
