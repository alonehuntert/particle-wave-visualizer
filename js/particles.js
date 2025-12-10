/* ================================
   Particle System
   ================================ */

class ParticleSystem {
    constructor(scene, count = 50000) {
        this.scene = scene;
        this.particleCount = count;
        this.geometry = null;
        this.material = null;
        this.particles = null;
        this.positions = null;
        this.colors = null;
        this.originalPositions = null;
        this.velocities = null;
        this.colorPalette = CONFIG.colors.neon;
        
        this.init();
    }
    
    /**
     * Initialize particle system
     */
    init() {
        // Create buffer geometry
        this.geometry = new THREE.BufferGeometry();
        
        // Create arrays for attributes
        this.positions = new Float32Array(this.particleCount * 3);
        this.colors = new Float32Array(this.particleCount * 3);
        this.originalPositions = new Float32Array(this.particleCount * 3);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.geometry.setAttribute('position', new THREE. BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

        // Initialize with random positions
        this.randomizePositions();
        
        // Set geometry attributes
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        
        // Create material
        this.material = new THREE.PointsMaterial({
            size: CONFIG.particles.defaultSize,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: CONFIG.particles.defaultOpacity,
            sizeAttenuation: true
        });
        
        // Create points mesh
        this.particles = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particles);
    }
    
    /**
     * Randomize particle positions
     */
    randomizePositions() {
        for (let i = 0; i < this.particleCount * 3; i += 3) {
            this.positions[i] = (Math.random() - 0.5) * 200;
            this.positions[i + 1] = (Math.random() - 0.5) * 200;
            this.positions[i + 2] = (Math.random() - 0.5) * 200;
            
            // Store original positions
            this.originalPositions[i] = this.positions[i];
            this.originalPositions[i + 1] = this.positions[i + 1];
            this.originalPositions[i + 2] = this.positions[i + 2];
            
            // Initialize velocities
            this.velocities[i] = 0;
            this.velocities[i + 1] = 0;
            this.velocities[i + 2] = 0;
        }
        
        this.updateColors();
    }
    
    /**
     * Update particle colors based on palette
     */
    updateColors(audioData = null) {
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const position = i / this.particleCount;
            
            // Get color from palette
            let color;
            if (audioData) {
                // Modulate color based on audio
                const intensity = (audioData.bass + audioData.mid + audioData.treble) / (255 * 3);
                const adjustedPos = (position + intensity) % 1.0;
                color = Utils.getColorFromPalette(this.colorPalette, adjustedPos);
            } else {
                color = Utils.getColorFromPalette(this.colorPalette, position);
            }
            
            this.colors[i3] = color[0];
            this.colors[i3 + 1] = color[1];
            this.colors[i3 + 2] = color[2];
        }
        
   if (this.geometry.attributes.color) {
        this.geometry. attributes.color.needsUpdate = true;
    }
    }
    
    /**
     * Set color palette
     */
    setColorPalette(paletteName) {
        if (CONFIG.colors[paletteName]) {
            this.colorPalette = CONFIG.colors[paletteName];
            this.updateColors();
        }
    }
    
    /**
     * Update particle positions
     */
    updatePositions() {
    if (this.geometry.attributes.position) {
        this.geometry.attributes.position.needsUpdate = true;
    }    
    }
    
    /**
     * Set particle size
     */
    setSize(size) {
        this.material.size = size;
    }
    
    /**
     * Set particle opacity
     */
    setOpacity(opacity) {
        this.material.opacity = opacity;
    }
    
    /**
     * Update particle count
     */
    updateParticleCount(newCount) {
        if (newCount === this.particleCount) return;
        
        // Remove old particles
        this.scene.remove(this.particles);
        this.geometry.dispose();
        this.material.dispose();
        
        // Create new particle system
        this.particleCount = newCount;
        this.init();
    }
    
    /**
     * Apply force to particles
     */
    applyForce(force) {
        for (let i = 0; i < this.particleCount * 3; i += 3) {
            this.velocities[i] += force.x;
            this.velocities[i + 1] += force.y;
            this.velocities[i + 2] += force.z;
        }
    }
    
    /**
     * Update particle physics
     */
    updatePhysics(damping = 0.95) {
        for (let i = 0; i < this.particleCount * 3; i += 3) {
            // Apply velocity
            this.positions[i] += this.velocities[i];
            this.positions[i + 1] += this.velocities[i + 1];
            this.positions[i + 2] += this.velocities[i + 2];
            
            // Apply damping
            this.velocities[i] *= damping;
            this.velocities[i + 1] *= damping;
            this.velocities[i + 2] *= damping;
        }
    }
    
    /**
     * Reset particles to original positions
     */
    reset() {
        for (let i = 0; i < this.particleCount * 3; i++) {
            this.positions[i] = this.originalPositions[i];
            this.velocities[i] = 0;
        }
        this.updatePositions();
    }
    
    /**
     * Rotate particles
     */
    rotate(x, y, z) {
        this.particles.rotation.x += x;
        this.particles.rotation.y += y;
        this.particles.rotation.z += z;
    }
    
    /**
     * Set rotation
     */
    setRotation(x, y, z) {
        this.particles.rotation.x = x;
        this.particles.rotation.y = y;
        this.particles.rotation.z = z;
    }
    
    /**
     * Dispose particle system
     */
    dispose() {
        this.scene.remove(this.particles);
        this.geometry.dispose();
        this.material.dispose();
    }
}
