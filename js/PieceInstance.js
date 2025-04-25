class PieceInstance {
  constructor(pieceType, posX = 0, posZ = 0) {
    this.pieceType = pieceType;
    this.posX = posX;
    this.posZ = posZ;
    this.mesh = null;
    this.scene = null;
  }

  // Crée le mesh de rendu pour cette instance
  createMesh() {
    if (!this.pieceType.isLoaded) {
      console.error("Le type de pièce n'est pas encore chargé");
      return this;
    }

    const geometry = new THREE.PlaneGeometry(this.pieceType.width, this.pieceType.height);
    // const material = new THREE.MeshBasicMaterial({ map: this.pieceType.texture });
    const material = new THREE.MeshBasicMaterial({
      map: this.pieceType.texture,
      transparent: true,
      alphaTest: 0.5,
      color: 0xffffff, // Couleur blanche pour ne pas altérer l'image
      depthWrite: true,
      flatShading: true
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.posX, 0, this.posZ);
    this.mesh.rotation.set(-Math.PI / 2, 0, 0);

    
    return this;
  }

  // Place l'instance dans la scène
  placeIn(scene) {
    if (!this.mesh) {
      this.createMesh();
    }
    
    this.scene = scene;
    return this;
  }

  // Met à jour la position de l'instance
  moveTo(x, z) {
    this.posX = x;
    this.posZ = z;
    
    if (this.mesh) {
      this.mesh.position.set(x, 0, z);
    }
    
    return this;
  }

  // Supprime l'instance (mais pas le type de pièce)
  remove() {
    if (this.scene) {
      this.scene.removeInstance(this);
      this.scene = null;
    }
    return this;
  }
} 