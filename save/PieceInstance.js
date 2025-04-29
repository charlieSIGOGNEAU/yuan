class PieceInstance {
  constructor(pieceType, posX , posy) {
    this.pieceType = pieceType;
    this.posX = posX;
    this.posy = posy;
    this.mesh = null;
    this.scene = null;
  }
  #transformToOrthonormal() {
    return [(this.posX + 0.5 * this.posy), (Math.sqrt(3) / 2) * -this.posy];
  }
  // Crée le mesh de rendu pour cette instance
  createMesh() {
    if (!this.pieceType.isLoaded) {
      console.error("Le type de pièce n'est pas encore chargé");
      return this;
    }

    const geometry = new THREE.PlaneGeometry(this.pieceType.width, this.pieceType.height);
    const material = new THREE.MeshBasicMaterial({
      map: this.pieceType.texture,
      alphaTest: 0.5 
    });
    this.mesh = new THREE.Mesh(geometry, material);

    const [x,z]= this.#transformToOrthonormal();
    this.mesh.position.set(x, 0, z);
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

  remove() {
    if (this.scene) {
      this.scene.removeInstance(this);
      this.scene = null;
    }
    return this;
  }
} 