class Scene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.pieceTypes = new Map(); // Stocke les types par ID
    this.instances = []; // Stocke les instances de pièces
    this.init();
  }

  init() {
    // Initialiser la scène
    this.scene = new THREE.Scene();

    // Configurer la caméra
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 9, 6);
    this.camera.rotation.set(THREE.MathUtils.degToRad(-60), 0, 0);

    // Configurer le rendu
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    //this.renderer.outputEncoding = THREE.sRGBEncoding;  ou THREE.LinearEncoding selon votre version de Three.js
    this.renderer.outputEncoding = THREE.LinearEncoding; // ou THREE.LinearEncoding selon votre version de Three.js
    // this.renderer.setClearColor(0x000000); // Fond noir pour meilleur contraste
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);


    // Ajouter l'éclairage
    // const light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.set(0, 1, 1).normalize();
    // this.scene.add(light);

    // Créer un plan de travail (conteneur pour toutes les pièces)
    this.workplane = new THREE.Group();
   
    this.scene.add(this.workplane);

    // Configurer les événements
    this.setupEvents();

    // Démarrer l'animation
    this.animate();
  }

 
  setupEvents() {
    // Variables pour le glisser-déposer
    this.isDragging = false;
    this.dragStart = null;
    this.workplaneStartPosition = null;

    // Gestionnaire d'événements souris
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    window.addEventListener('resize', this.onResize.bind(this));
  }

  // Transforme les coordonnées de la souris en coordonnées 3D
  getMouseWorld(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, this.camera);
    
    // Intersection avec les pièces
    const intersects = raycaster.intersectObjects(this.instances.map(i => i.mesh), true);
    if (intersects.length > 0) {
      return { 
        point: intersects[0].point, 
        instance: this.instances.find(i => i.mesh === intersects[0].object || i.mesh.children.includes(intersects[0].object))
      };
    }

    // Si pas d'intersection, utiliser le plan
    const planeSurface = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeSurface, point);
    return { point, instance: null };
  }

  onMouseDown(e) {
    const result = this.getMouseWorld(e);
    if (!result.point) return;

    this.isDragging = true;
    this.dragStart = result.point;
    this.workplaneStartPosition = this.workplane.position.clone();
  }

  onMouseMove(e) {
    if (!this.isDragging || !this.dragStart) return;

    const result = this.getMouseWorld(e);
    if (!result.point) return;

    // Déplacer tout le plan de travail
    const delta = new THREE.Vector3().subVectors(this.dragStart, result.point);
    this.workplane.position.copy(this.workplaneStartPosition.clone().sub(delta));
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    
    const result = this.getMouseWorld(e);
    if (!result.point) return;
    
    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const mousePoint = result.point;
    
    // Calculer le vecteur du centre du plan vers le point de la souris
    const pointToWorkplaneDelta = new THREE.Vector3().subVectors(mousePoint, this.workplane.position);
    
    // Appliquer le zoom à tout le plan de travail
    this.workplane.scale.multiplyScalar(scaleFactor);
    
    // Ajuster la position pour que le point sous la souris reste fixe
    this.workplane.position.add(
      pointToWorkplaneDelta.multiplyScalar(1 - scaleFactor)
    );
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  // Méthode pour ajouter/récupérer un type de pièce
  addPieceType(pieceType) {
    this.pieceTypes.set(pieceType.id, pieceType);
    return pieceType;
  }

  getPieceType(id) {
    return this.pieceTypes.get(id);
  }

  // Méthode pour ajouter une instance
  addInstance(instance) {
    if (!instance.mesh) {
      instance.createMesh();
    }
    
    this.instances.push(instance);
    this.workplane.add(instance.mesh);
    return instance;
  }

  // Méthode pour supprimer une instance
  removeInstance(instance) {
    const index = this.instances.indexOf(instance);
    if (index !== -1) {
      this.instances.splice(index, 1);
      this.workplane.remove(instance.mesh);
    }
  }
}