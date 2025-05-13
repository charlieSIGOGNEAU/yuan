import { GameBoard3D } from './js/ui/GameBoard3D.js';

// Initialisation de la scène
const gameBoard = new GameBoard3D('threejs-container');

gameBoard.addTile('images/Am.webp', { q: 0, r: 0});
gameBoard.addTile('images/Bm.webp', { q: 3, r: -2});
gameBoard.addTile('images/Cm.webp', { q: 2, r: 1});
gameBoard.addTile('images/Dm.webp', { q: -1, r: 3});
gameBoard.addTile('images/Fm.webp', { q: -3, r: 2});
gameBoard.addTile('images/Em.webp', { q: -2, r: -1});
gameBoard.addTile('images/Gm.webp', { q: 1, r: -3});


// const GameSimulator = new GameSimulator();
// GameSimulator.createGame();
