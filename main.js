import { GameBoard3D } from './js/ui/GameBoard3D.js';
import { PlayerSelectionUI } from './js/ui/PlayerSelectionUI.js';
import { gameSimulator } from './js/network/gameSimulator.js';
import { gameState } from './js/core/gameState.js';
import { installationPhase } from './js/phases/installationPhase.js';
import { TILE_CONFIGS } from './js/pieces/TileTypes.js';
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

if (gameSimulator.plateau.tilesToPlay == null) {  // je devrais aussi plus tard verifier que je suis le premier joueur
    const tiles = installationPhase.tilesInGame(gameSimulator.players.length);
    console.log(tiles);
    const position = { q: 0, r: 0};
    const rotation = Math.floor(Math.random() * 6);

    gameSimulator.plateau.playedTiles = [tiles[0]];
    gameSimulator.plateau.tilesToPlay = tiles.shift();
    gameSimulator.plateau.playedTilesPosition.push(position);
    gameSimulator.plateau.playedTilesRotation.push(rotation);



    gameState.plateau.playedTiles = [...gameSimulator.plateau.playedTiles];
    console.log(gameSimulator.plateau.playedTiles); //Km
    console.log(gameState.plateau.playedTiles);
    gameState.plateau.tilesToPlay = [...gameSimulator.plateau.tilesToPlay];
    gameState.plateau.playedTilesPosition = [...gameSimulator.plateau.playedTilesPosition];
    gameState.plateau.playedTilesRotation = [...gameSimulator.plateau.playedTilesRotation];
}

//affichage de la premiere tuile
console.log(gameState.plateau.playedTiles[0]);
const image = TILE_CONFIGS[gameState.plateau.playedTiles[0]].image;
gameBoard.addTile(image, { q: 0, r: 0},gameState.plateau.playedTilesRotation[0]);
const getAllAdjacentTiles = installationPhase.getAllAdjacentTiles(gameState.plateau.playedTilesPosition);
    console.log(getAllAdjacentTiles);
    getAllAdjacentTiles.forEach(position => {
        gameBoard.createCircle(position);
        
    });






// gameBoard.addTile('images/Bm.webp', { q: 3, r: -2});
// gameBoard.addTile('images/Cm.webp', { q: 2, r: 1});
// gameBoard.addTile('images/Dm.webp', { q: -1, r: 3});
// gameBoard.addTile('images/Fm.webp', { q: -3, r: 2});
// gameBoard.addTile('images/Em.webp', { q: -2, r: -1});
// gameBoard.addTile('images/Gm.webp', { q: 1, r: -3});
