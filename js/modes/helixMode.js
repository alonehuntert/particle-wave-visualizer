/* ================================
   DNA Helix Mode
   ================================ */

class HelixMode {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.config = CONFIG.modes.helix;
        this.time = 0;
    }
    
    /**
     * Initialize double helix
     */
    init() {
        const particleCount = this.particleSystem.particleCount;
        const radius = this.config.radius;
        const height = this.config.height;
        const coils = this.config.coils;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const t = (i / particleCount) * coils * Math.PI * 2;
            const y = (i / particleCount) * height - height / 2;
            
            // Determine which strand (0 or 1)
            const strand = i % 2;
            const offset = strand * Math.PI; // 180 degree offset for second strand
            
            const x = Math.cos(t + offset) * radius;
            const z = Math.sin(t + offset) * radius;
            
            this.particleSystem.positions[i3] = x;
            this.particleSystem.positions[i3 + 1] = y;
            this.particleSystem.positions[i3 + 2] = z;
            
            this.particleSystem.originalPositions[i3] = t;
            this.particleSystem.originalPositions[i3 + 1] = y;
            this.particleSystem.originalPositions[i3 + 2] = strand;
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors();
    }
    
    /**
     * Update helix animation
     */
    update(audioData) {
        this.time += this.config.rotationSpeed;
        
        const particleCount = this.particleSystem.particleCount;
        const baseRadius = this.config.radius;
        const thickness = this.config.thickness * (1 + audioData.mid / 255);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const t = this.particleSystem.originalPositions[i3];
            const y = this.particleSystem.originalPositions[i3 + 1];
            const strand = this.particleSystem.originalPositions[i3 + 2];
            
            const offset = strand * Math.PI;
            const radius = baseRadius + Math.sin(y * 0.1 + this.time) * thickness;
            
            this.particleSystem.positions[i3] = Math.cos(t + offset + this.time) * radius;
            this.particleSystem.positions[i3 + 1] = y;
            this.particleSystem.positions[i3 + 2] = Math.sin(t + offset + this.time) * radius;
            
            // Add bass influence
            const bassInfluence = (audioData.bass / 255) * 5;
            this.particleSystem.positions[i3] *= (1 + bassInfluence * 0.1);
            this.particleSystem.positions[i3 + 2] *= (1 + bassInfluence * 0.1);
        }
        
        this.particleSystem.updatePositions();
        this.particleSystem.updateColors(audioData);
    }
}
