class Piece {
  constructor(options = {}) {
    this.width = options.width || 4;
    this.height = options.height || 3;
    this.imageUrl = options.imageUrl || 'test.jpg';
    this.mesh = null;
    this.scene = null;
  }

  // Charger et initialiser la pièce
  load() {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        this.imageUrl,
        (texture) => {
          texture.encoding = THREE.sRGBEncoding;
          texture.anisotropy = 1;

          const geometry = new THREE.PlaneGeometry(this.width, this.height);
          const material = new THREE.MeshBasicMaterial({ map: texture });
          this.mesh = new THREE.Mesh(geometry, material);
          // Ne pas appliquer de rotation ici, car le plan de travail parent sera déjà tourné
          resolve(this);
        },
        undefined,
        (error) => {
          console.error('Erreur de chargement de texture', error);
          reject(error);
        }
      );
    });
  }

  // Placer la pièce dans la scène
  placeAt(x, z, scene) {
    if (!this.mesh) {
      console.error("La pièce n'est pas encore chargée");
      return this;
    }
    
    this.scene = scene;
    this.mesh.position.set(x, 0, z);
    return this;
  }

  // Supprimer la pièce de la scène
  remove() {
    if (this.scene) {
      this.scene.removePiece(this);
      this.scene = null;
    }
    return this;
  }
}