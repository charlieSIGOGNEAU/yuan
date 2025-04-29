import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GameBoard3D } from './js/ui/GameBoard3D.js';

// Initialisation de la scène
const gameBoard = new GameBoard3D('threejs-container');

// // Fonction pour créer une tuile
// function createTile(textureUrl, position) {
//     const textureLoader = new THREE.TextureLoader();
//     const texture = textureLoader.load(textureUrl);
    
//     const geometry = new THREE.PlaneGeometry(3, 3);
//     const material = new THREE.MeshBasicMaterial({ 
//         map: texture,
//         alphaTest: 0.5 
//     });
//     const plane = new THREE.Mesh(geometry, material);
    
//     plane.position.set(position.x, position.y, position.z);
//     plane.rotation.x = -Math.PI / 2;
    
//     return plane;
// }

// // Création et ajout des tuiles au plan de travail
// const tileA = createTile('images/Am.png', { x: 0, y: 0, z: 0 });
// const tileB = createTile('images/Am.png', { x: 2.5, y: 0, z: -0.8 });
// const tileC = createTile('images/Am.png', { x: 0.5, y: 0, z: -2.7 });

// gameBoard.workplane.add(tileA);
// gameBoard.workplane.add(tileB);
// gameBoard.workplane.add(tileC);

// Démarrage de l'animation
// gameBoard.animate(); 

gameBoard.addTile('images/Am.webp', { q: 0, r: 0});
gameBoard.addTile('images/Bm.webp', { q: 3, r: -2});
gameBoard.addTile('images/Cm.webp', { q: 2, r: 1});
gameBoard.addTile('images/Dm.webp', { q: -1, r: 3});