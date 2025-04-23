// Initialiser la scène 3D
const scene3D = new Scene3D('canvas-container');

// Créer et charger 4 pièces identiques
async function loadPieces() {
  try {
    // Options communes pour toutes les pièces
    const pieceOptions = {
      width: 4,
      height: 3,
      imageUrl: 'test.jpg'
    };
    
    // Créer les pièces et les charger
    const piece1 = new Piece(pieceOptions);
    const piece2 = new Piece(pieceOptions);
    const piece3 = new Piece(pieceOptions);
    const piece4 = new Piece(pieceOptions);
    
    // Charger les textures (en parallèle)
    await Promise.all([
      piece1.load(),
      piece2.load(),
      piece3.load(),
      piece4.load()
    ]);
    
    // Ajouter les pièces à la scène avec différentes positions
    scene3D.addPiece(piece1).placeAt(-6, 0, scene3D);   // Gauche
    scene3D.addPiece(piece2).placeAt(-2, 0, scene3D);   // Centre-gauche
    scene3D.addPiece(piece3).placeAt(2, 0, scene3D);    // Centre-droit
    scene3D.addPiece(piece4).placeAt(6, 0, scene3D);    // Droite
    
    console.log("Toutes les pièces sont chargées et placées.");
  } catch (error) {
    console.error("Erreur lors du chargement des pièces:", error);
  }
}

// Démarrer le chargement des pièces
loadPieces();
