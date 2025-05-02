import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class GameBoard3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // Désactiver les comportements tactiles par défaut
        this.container.style.touchAction = 'none';
        
        this.instances = []; // Stocke les instances de pièces
        this.circles = []; // Stocke les cercles créés
        this.tiles = []; // Stocke les tuiles créées
        this.animations = []; // Stocke les animations en cours
        this.isDragging = false;
        this.dragStart = null;
        this.workplaneStartPosition = null;
        this.activePointerId = null; // Pour suivre le doigt actif
        this.clickStartPosition = null; // Pour détecter les clics
        this.clickStartTime = null; // Pour mesurer la durée du clic
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

    createCircle(position = {q: 0, r: 0}) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./images/cercle.webp');
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const circle = new THREE.Mesh(geometry, material);
        const pos = this.#hexToCartesian(position);
        circle.position.set(pos.x, pos.y, pos.z);
        circle.rotation.x = -Math.PI / 2; // Pour le mettre à plat sur le plan
        
        // Initialisation de l'échelle à 0
        circle.scale.set(0, 0, 0);
        
        // Ajout de l'animation
        const animation = {
            object: circle,
            startTime: performance.now(),
            duration: 500, // milliseconde
            from: { scale: 0 },
            to: { scale: 1 }
        };
        this.animations.push(animation);
        
        this.workplane.add(circle);
        this.circles.push(circle);
        return circle;
    }

    setupEvents() {
        // Gestionnaire d'événements pointer (fonctionne pour souris et tactile)
        this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.container.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.container.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.container.addEventListener('pointercancel', this.onPointerUp.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        window.addEventListener('resize', this.onResize.bind(this));
    }
    //q correspond à un déplacement vers la droite. r correspond à un déplacement en diagonale en haut a droites.
    #hexToCartesian (position = {q: 0, r: 0}) {
        return {x: position.q+position.r/2, y: 0, z: -position.r/2*Math.sqrt(3)};
    }
    // Méthode pour ajouter une tuile
    addTile(imageUrl, position = { q: 0, r: 0}, rotation = 0) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(imageUrl);
        const geometry = new THREE.PlaneGeometry(3, 3); 
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });
        const tile = new THREE.Mesh(geometry, material);
        const pos = this.#hexToCartesian(position);
        tile.position.set(pos.x, pos.y, pos.z);
        tile.rotation.x = -Math.PI / 2;
        tile.rotation.z = rotation * Math.PI / 3;
        this.workplane.add(tile);
        this.tiles.push(tile); // Stocke la référence de la tuile
        return tile;
    }

    removeAllCircles() {
        // Supprime tous les cercles du workplane
        this.circles.forEach(circle => {
            this.workplane.remove(circle);
            // Libère la mémoire
            circle.geometry.dispose();
            circle.material.dispose();
        });
        // Vide le tableau des cercles
        this.circles = [];
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

    onPointerDown(e) {
        e.preventDefault();
        // Si on est déjà en train de glisser, on ignore
        if (this.isDragging) return;

        const result = this.getMouseWorld(e);
        if (!result.point) return;

        // Stocker la position et le temps de départ pour détecter les clics
        this.clickStartPosition = {
            x: e.clientX,
            y: e.clientY
        };
        this.clickStartTime = performance.now();

        // Si on a cliqué sur un objet interactif (à implémenter plus tard)
        if (result.object) {
            this.handleObjectClick(result.object);
            return;
        }

        // Sinon, on commence le glisser-déposer
        this.isDragging = true;
        this.activePointerId = e.pointerId;
        this.dragStart = result.point;
        this.workplaneStartPosition = this.workplane.position.clone();
        
        // Capturer les événements pointer
        this.container.setPointerCapture(e.pointerId);
    }

    onPointerMove(e) {
        // Ne traiter que les événements du pointer actif
        if (!this.isDragging || e.pointerId !== this.activePointerId) return;

        const result = this.getMouseWorld(e);
        if (!result.point) return;

        const delta = new THREE.Vector3().subVectors(this.dragStart, result.point);
        this.workplane.position.copy(this.workplaneStartPosition.clone().sub(delta));
    }

    onPointerUp(e) {
        // Ne traiter que les événements du pointer actif
        if (e.pointerId !== this.activePointerId) return;

        // Vérifier si c'était un clic (peu de déplacement et durée courte)
        if (this.clickStartPosition && this.clickStartTime) {
            const dx = Math.abs(e.clientX - this.clickStartPosition.x);
            const dy = Math.abs(e.clientY - this.clickStartPosition.y);
            const maxDistance = Math.max(dx, dy); // On prend la plus grande distance
            const duration = performance.now() - this.clickStartTime;
            
            // Si le déplacement est inférieur à 5 pixels ET la durée est inférieure à 500ms
            if (maxDistance < 5 && duration < 1000) {
                console.log('Clic détecté ! Durée:', duration.toFixed(0), 'ms');
                const result = this.getMouseWorld(e);
                if (result.object) {
                    this.handleObjectClick(result.object);
                }
            }
        }

        this.isDragging = false;
        this.activePointerId = null;
        this.clickStartPosition = null;
        this.clickStartTime = null;
        
        // Libérer la capture du pointer
        this.container.releasePointerCapture(e.pointerId);
    }

    handleObjectClick(object) {
        console.log('Objet cliqué:', object);
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
        
        // Gestion des animations
        const currentTime = performance.now();
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const animation = this.animations[i];
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            // Animation d'échelle
            const scale = animation.from.scale + (animation.to.scale - animation.from.scale) * progress;
            animation.object.scale.set(scale, scale, scale);
            
            // Suppression de l'animation une fois terminée
            if (progress === 1) {
                this.animations.splice(i, 1);
            }
        }
        
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