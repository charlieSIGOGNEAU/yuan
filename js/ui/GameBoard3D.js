import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class GameBoard3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.instances = []; // Stocke les instances de pièces
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 9, 6);
        this.camera.rotation.set(THREE.MathUtils.degToRad(-60), 0, 0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.outputEncoding = THREE.LinearEncoding; 
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.workplane = new THREE.Group();
        this.scene.add(this.workplane);
        this.setupEvents();
        this.animate();
      }

    

    setupEvents() {
        // Variables pour le glisser-déposer
        // this.isDragging = false;
        // this.dragStart = null;
        // this.workplaneStartPosition = null;

        // Gestionnaire d'événements souris
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        window.addEventListener('resize', this.onResize.bind(this));
    }
    #hexToCartesian (position = {q: 0, r: 0}) {
        return {x: position.q+position.r/2, y: 0, z: -position.r/2*Math.sqrt(3)};
    }
    // Méthode pour ajouter une tuile, q correspond à un déplacement vers la droite. r correspond à un déplacement en diagonale en haut a droites.
    addTile(imageUrl, position = { q: 0, r: 0}) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(imageUrl);
        const geometry = new THREE.PlaneGeometry(3, 3); 
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });
        const tile = new THREE.Mesh(geometry, material);
        const pos = this.#hexToCartesian (position);
        tile.position.set(pos.x, pos.y, pos.z);
        tile.rotation.x = -Math.PI / 2;
        this.workplane.add(tile);
        return tile;
    }

 

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
        
        const pointToWorkplaneDelta = new THREE.Vector3().subVectors(mousePoint, this.workplane.position);
        
        this.workplane.scale.multiplyScalar(scaleFactor);
        
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

    // Méthode pour ajouter une instance
    // addInstance(instance) {
    //     if (!instance.mesh) {
    //         instance.createMesh();
    //     }
        
    //     this.instances.push(instance);
    //     this.workplane.add(instance.mesh);
    //     return instance;
    // }

    // Méthode pour supprimer une instance
    // removeInstance(instance) {
    //     const index = this.instances.indexOf(instance);
    //     if (index !== -1) {
    //         this.instances.splice(index, 1);
    //         this.workplane.remove(instance.mesh);
    //     }
    // }
} 