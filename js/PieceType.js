class PieceType {
  constructor(options = {}) {
    this.id = options.id || crypto.randomUUID();
    this.width = options.width ;
    this.height = options.height ;
    this.imageUrl = options.imageUrl || 'test.jpg';
    this.texture = null;
    this.isLoaded = false;
  }

  // Charge la texture une seule fois pour ce type de pièce
  load() {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve(this);
        return;
      }

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        this.imageUrl,
        (texture) => {
          this.texture = texture;
          this.isLoaded = true;
          resolve(this);
        },
        undefined,
        (error) => {
          console.error(`Erreur de chargement de texture pour ${this.id}:`, error);
          reject(error);
        }
      );
    });
  }

  // Crée une instance de ce type de pièce
  createInstance(posX, posZ) {
    return new PieceInstance(this, posX, posZ);
  }
} 