// Import coordinate transformer for hexagonal grid
// import { transformToOrthonormal } from './transformToOrthonormal.js';

// Initialiser la scène 3D
const scene3D = new Scene3D('canvas-container');

// Créer et charger les types de pièces puis leurs instances
async function setupGame() {
  try {
    // Créer et charger un type de pièce
    const cardType = new PieceType({
      id: 'card',
      width: 3,
      height: 3,
      // imageUrl: 'test.jpg'
      imageUrl: 'images/Am.png'
    });
    
    // Ajouter le type à la scène
    scene3D.addPieceType(cardType);
    
    // Charger la texture du type
    await cardType.load();
    
    // Créer plusieurs instances à différentes positions
    const card1 = cardType.createInstance(0, 0);
    const card2 = cardType.createInstance(2, 1);
    const card3 = cardType.createInstance(3, -2);
    const card4 = cardType.createInstance(-1, 3);
    
    // Ajouter les instances à la scène
    scene3D.addInstance(card1.placeIn(scene3D));
    scene3D.addInstance(card2.placeIn(scene3D));
    scene3D.addInstance(card3.placeIn(scene3D));
    scene3D.addInstance(card4.placeIn(scene3D));
    
    console.log("Toutes les pièces sont chargées et placées.");
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }
}

// Démarrer l'initialisation
setupGame();
