import { GameBoard3D } from './js/ui/GameBoard3D.js';

// Initialisation de la scène 3D
const gameBoard = new GameBoard3D('threejs-container');
gameBoard.animate();

// Gestion de la sélection des joueurs
let currentPlayer = 1;
const buttons = [
    document.getElementById('player1-btn'),
    document.getElementById('player2-btn'),
    document.getElementById('player3-btn')
];

buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        currentPlayer = idx + 1;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});