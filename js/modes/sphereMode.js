/* ================================
   Particle Sphere Mode
   ================================ */

class SphereMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.sphere;
        this.time = 0;
    }
    
    /**
     * Initialize sphere
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const radius = this.config.radius;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            const x = Math.cos(theta) * Math.sin(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(phi);
            
            this.particleSystem.positions[i3] = x * radius;
            this.particleSystem.positions[i3 + 1] = y * radius;
            this.particleSystem.positions[i3 + 2] = z * radius;
            
            this.particleSystem.originalPositions[i3] = x;
            this.particleSystem.originalPositions[i3 + 1] = y;
            this.particleSystem.originalPositions[i3 + 2] = z;
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update sphere animation
     */
    update(audioData) {
        this.time += this.config.pulseSpeed;
        
        const particleCount = this.particleSystem.particleCount;
        const baseRadius = this.config.radius;
        const pulse = Math.sin(this.time) * this.config.pulseAmount;
        const bassBoost = (audioData.bass / 255) * 30;
        const radius = baseRadius + pulse + bassBoost;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            const x = this.particleSystem.originalPositions[i3];
            const y = this.particleSystem.originalPositions[i3 + 1];
            const z = this.particleSystem.originalPositions[i3 + 2];
            
            // Apply pulsing radius
            this.particleSystem.positions[i3] = x * radius;
            this.particleSystem.positions[i3 + 1] = y * radius;
            this.particleSystem.positions[i3 + 2] = z * radius;
            
            // Add some noise based on treble
            const noise = (audioData.treble / 255) * 5;
            this.particleSystem.positions[i3] += (Math.random() - 0.5) * noise;
            this.particleSystem.positions[i3 + 1] += (Math.random() - 0.5) * noise;
            this.particleSystem.positions[i3 + 2] += (Math.random() - 0.5) * noise;
        }
        
        // Rotate sphere
        this.particleSystem.rotate(0, this.config.rotationSpeed, 0);
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
